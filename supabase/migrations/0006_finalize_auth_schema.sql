-- ============================================================
-- FINAL AUTH SCHEMA REFACTOR
-- Idempotent schema sync for identity and atomic auth creation
-- ============================================================

-- 1. Ensure pgcrypto is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2. Safely rename arinova_id to login_id if it exists
DO $$ 
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_identities' AND column_name='arinova_id') THEN
    ALTER TABLE public.user_identities RENAME COLUMN arinova_id TO login_id;
  END IF;
END $$;

-- 3. Drop all old CHECK constraints dynamically to ensure a clean slate
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (
    SELECT conname 
    FROM pg_constraint 
    WHERE conrelid = 'public.user_identities'::regclass AND contype = 'c'
  ) LOOP
    EXECUTE 'ALTER TABLE public.user_identities DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

-- 4. Update existing data to the new login_id format (<username>#XXXX)
-- For existing users, login_id currently holds ARINOVA#XXXX or might be null.
UPDATE public.user_identities 
SET login_id = username || '#' || user_id_number,
    normalized_name = username
WHERE user_id_number IS NOT NULL;

-- 5. Apply the new explicit check constraints safely
ALTER TABLE public.user_identities
  ADD CONSTRAINT chk_identities_status check (status in ('RESERVED', 'ACTIVE')),
  ADD CONSTRAINT chk_identities_role check (role in ('user', 'moderator', 'co_owner', 'owner', 'official', 'admin')),
  ADD CONSTRAINT chk_identities_username_len check (length(username) >= 4 and length(username) <= 12),
  ADD CONSTRAINT chk_identities_normalized_match check (normalized_name = username),
  ADD CONSTRAINT chk_identities_normalized_fmt check (normalized_name ~ '^[a-zA-Z0-9_]{4,12}$'),
  ADD CONSTRAINT chk_identities_id_fmt check (user_id_number ~ '^[0-9]{4}$'),
  ADD CONSTRAINT chk_identities_login_id check (login_id = (username || '#' || user_id_number));

-- 6. Rename the index safely
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_user_identities_arinova_id') THEN
    ALTER INDEX public.idx_user_identities_arinova_id RENAME TO idx_user_identities_login_id;
  END IF;
END $$;

-- 7. Drop all ambiguous or outdated functions to prevent cache confusion
DROP FUNCTION IF EXISTS public.reserve_username(text);
DROP FUNCTION IF EXISTS public.reserve_username(text, uuid);
DROP FUNCTION IF EXISTS public.admin_assign_reserved_identity(uuid, text, text, text);

-- 8. Create the atomic server-side signup function
CREATE OR REPLACE FUNCTION public.reserve_username(username_input text, password_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  norm_name text;
  rand_disc integer;
  str_disc text;
  full_id text;
  new_identity_id uuid;
  new_auth_user_id uuid;
  dummy_email text;
  enc_pass text;
  
  -- Variables for existing check
  existing_identity record;
  existing_auth_user record;
BEGIN
  norm_name := username_input;
  
  if not norm_name ~ '^[a-zA-Z0-9_]{4,12}$' then
    raise exception 'Username must be 4-12 characters.';
  end if;
  
  if length(password_input) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  -- =========================================================
  -- IDEMPOTENCY CHECK
  -- =========================================================
  select * into existing_identity from public.user_identities where normalized_name = norm_name limit 1;
  
  if found then
    -- It exists! We must securely check if the provided password matches the existing auth user.
    if existing_identity.user_id is not null then
      select * into existing_auth_user from auth.users where id = existing_identity.user_id limit 1;
      
      if found and existing_auth_user.encrypted_password = extensions.crypt(password_input, existing_auth_user.encrypted_password) then
        -- Password matches! Idempotently return the existing identity credentials so they can just log in.
        return json_build_object(
          'id', existing_identity.id,
          'login_id', existing_identity.login_id,
          'user_id_number', existing_identity.user_id_number,
          'username', existing_identity.username,
          'dummy_email', existing_auth_user.email
        );
      end if;
    end if;
    
    -- If it exists but password didn't match (or user_id was null), they cannot claim it.
    raise exception 'Username already taken';
  end if;

  -- =========================================================
  -- NEW ACCOUNT CREATION
  -- =========================================================
  rand_disc := nextval('public.arinova_user_id_seq');
  
  if rand_disc > 9999 then
    raise exception 'User ID sequence exhausted.';
  end if;
  
  str_disc := to_char(rand_disc, 'FM0000');
  full_id := norm_name || '#' || str_disc;
  
  new_identity_id := gen_random_uuid();
  new_auth_user_id := gen_random_uuid();
  dummy_email := 'id_' || new_identity_id::text || '@example.com';
  
  -- Generate bcrypt password hash
  enc_pass := extensions.crypt(password_input, extensions.gen_salt('bf'));

  -- Insert into auth.users directly to bypass email rate limits
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    aud, role, created_at, updated_at, confirmation_token
  ) VALUES (
    new_auth_user_id, '00000000-0000-0000-0000-000000000000', dummy_email, enc_pass, now(), 
    'authenticated', 'authenticated', now(), now(), ''
  );
  
  -- Insert into auth.identities
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_auth_user_id, new_auth_user_id, jsonb_build_object('sub', new_auth_user_id::text, 'email', dummy_email), 'email', dummy_email, now(), now(), now()
  );

  -- Insert into public.user_identities mapped to the new auth user
  insert into public.user_identities (
    id, user_id, username, normalized_name, user_id_number, login_id, status, role
  ) values (
    new_identity_id, new_auth_user_id, username_input, norm_name, str_disc, full_id, 'ACTIVE', 'user'
  );
  
  -- Return the credentials needed for the frontend to sign in
  return json_build_object(
    'id', new_identity_id,
    'login_id', full_id,
    'user_id_number', str_disc,
    'username', username_input,
    'dummy_email', dummy_email
  );
END;
$$;

-- Grant execute securely
GRANT EXECUTE ON FUNCTION public.reserve_username(text, text) TO anon, authenticated, service_role;

-- 9. Fix resolve_login_email (it needs to support both old format and new format logins)
CREATE OR REPLACE FUNCTION public.resolve_login_email(identifier text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  target_email text;
BEGIN
  select user_id into target_user_id 
  from public.user_identities 
  where username = identifier 
     or login_id = identifier
  limit 1;
     
  if target_user_id is null then
    return null;
  end if;
  
  select email into target_email
  from auth.users
  where id = target_user_id
  limit 1;
  
  return target_email;
END;
$$;

-- 10. Update the auto_assign trigger to use the correct columns
CREATE OR REPLACE FUNCTION public.auto_assign_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_username text;
  norm_name text;
  seq_val integer;
  str_disc text;
  full_id text;
BEGIN
  if NEW.key = 'profile' then
    if not exists (select 1 from public.user_identities where user_id = NEW.user_id) then
      
      base_username := NEW.data->>'username';
      if base_username is null or length(base_username) < 4 then
        base_username := NEW.data->>'displayName';
      end if;
      if base_username is null or length(base_username) < 4 then
        base_username := 'user' || substr(md5(random()::text), 1, 6);
      end if;
      
      base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
      if length(base_username) < 4 then
        base_username := 'user' || substr(md5(random()::text), 1, 6);
      elsif length(base_username) > 12 then
        base_username := substr(base_username, 1, 12);
      end if;
      
      norm_name := base_username;
      
      seq_val := nextval('public.arinova_user_id_seq');
      str_disc := to_char(seq_val, 'FM0000');
      full_id := norm_name || '#' || str_disc;
      
      insert into public.user_identities (
        user_id, username, normalized_name, user_id_number, login_id, status, role
      ) values (
        NEW.user_id, base_username, norm_name, str_disc, full_id, 'ACTIVE', 'user'
      );
    end if;

    DECLARE
      official_username text;
      official_login_id text;
    BEGIN
      select username, login_id into official_username, official_login_id
      from public.user_identities
      where user_id = NEW.user_id
      limit 1;
      
      if official_username is not null then
        NEW.data := jsonb_set(NEW.data, '{username}', to_jsonb(official_username));
        NEW.data := jsonb_set(NEW.data, '{login_id}', to_jsonb(official_login_id));
      end if;
    END;
  end if;
  
  RETURN NEW;
END;
$$;
