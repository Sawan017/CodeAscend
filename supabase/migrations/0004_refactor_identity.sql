-- ============================================================
-- IDENTITY REFACTOR MIGRATION
-- Format: <username>#XXXX
-- ============================================================

-- 1. Safely rename the column
ALTER TABLE public.user_identities RENAME COLUMN arinova_id TO login_id;

-- 2. Drop all old CHECK constraints dynamically to ensure a clean slate
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

-- 3. Update existing data to the new login_id format (<username>#XXXX)
-- For existing users, login_id currently holds ARINOVA#XXXX.
-- We must strip the prefix and replace it with username#XXXX
UPDATE public.user_identities 
SET login_id = username || '#' || user_id_number,
    normalized_name = username;

-- 4. Apply the new explicit check constraints
ALTER TABLE public.user_identities
  ADD CONSTRAINT chk_identities_status check (status in ('RESERVED', 'ACTIVE')),
  ADD CONSTRAINT chk_identities_role check (role in ('user', 'moderator', 'co_owner', 'owner', 'official', 'admin')),
  ADD CONSTRAINT chk_identities_username_len check (length(username) >= 4 and length(username) <= 12),
  ADD CONSTRAINT chk_identities_normalized_match check (normalized_name = username),
  ADD CONSTRAINT chk_identities_normalized_fmt check (normalized_name ~ '^[a-zA-Z0-9_]{4,12}$'),
  ADD CONSTRAINT chk_identities_id_fmt check (user_id_number ~ '^[0-9]{4}$'),
  ADD CONSTRAINT chk_identities_id_range check (
    user_id_number::integer > 10 OR 
    role in ('moderator', 'co_owner', 'owner', 'official', 'admin')
  ),
  ADD CONSTRAINT chk_identities_login_id check (login_id = (username || '#' || user_id_number));

-- Rename the index
ALTER INDEX IF EXISTS idx_user_identities_arinova_id RENAME TO idx_user_identities_login_id;


-- 5. Drop ambiguous overloaded functions
DROP FUNCTION IF EXISTS public.reserve_username(text);
DROP FUNCTION IF EXISTS public.reserve_username(text, uuid);
DROP FUNCTION IF EXISTS public.admin_assign_reserved_identity(uuid, text, text, text);

-- 6. Rewrite reserve_username to instantly ACTIVATE and return identity
CREATE OR REPLACE FUNCTION public.reserve_username(username_input text, auth_user_id uuid DEFAULT null)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  norm_name text;
  rand_disc integer;
  str_disc text;
  full_id text;
  new_id uuid;
BEGIN
  norm_name := username_input;
  
  if not norm_name ~ '^[a-zA-Z0-9_]{4,12}$' then
    raise exception 'Username must be 4-12 characters.';
  end if;
  
  -- The sequence guarantees atomicity and no collisions
  rand_disc := nextval('public.arinova_user_id_seq');
  
  if rand_disc > 9999 then
    raise exception 'User ID sequence exhausted.';
  end if;
  
  str_disc := to_char(rand_disc, 'FM0000');
  full_id := norm_name || '#' || str_disc;
  
  insert into public.user_identities (
    user_id, username, normalized_name, user_id_number, login_id, status, role
  ) values (
    auth_user_id, username_input, norm_name, str_disc, full_id, 'ACTIVE', 'user'
  ) returning id into new_id;
  
  return json_build_object(
    'id', new_id,
    'login_id', full_id,
    'user_id_number', str_disc,
    'username', username_input
  );
END;
$$;

-- 7. Rewrite confirm_username
CREATE OR REPLACE FUNCTION public.confirm_username(identity_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- We link the currently logged in auth.uid() to this identity
  update public.user_identities
  set user_id = auth.uid()
  where id = identity_id;
  
  if not found then
    raise exception 'Identity not found';
  end if;
  
  return true;
END;
$$;

-- 8. Rewrite resolve_login_email
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

-- 9. Auto-assign identity trigger fix
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

-- Reload Schema Cache safely
NOTIFY pgrst, 'reload schema';
