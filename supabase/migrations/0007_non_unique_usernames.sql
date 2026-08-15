-- ============================================================
-- NON-UNIQUE USERNAMES & COLLISION CHECKING MIGRATION (V2)
-- ============================================================

-- 1. Explicitly drop the unique constraint on normalized_name
ALTER TABLE public.user_identities DROP CONSTRAINT IF EXISTS user_identities_normalized_name_key;
ALTER TABLE public.user_identities DROP CONSTRAINT IF EXISTS idx_user_identities_normalized_name_unique;

-- Explicitly drop any unique index just in case it was created without a constraint
DROP INDEX IF EXISTS public.user_identities_normalized_name_key;
DROP INDEX IF EXISTS public.idx_user_identities_normalized_name_unique;

-- Ensure login_id has a unique constraint
ALTER TABLE public.user_identities DROP CONSTRAINT IF EXISTS user_identities_login_id_key;
ALTER TABLE public.user_identities ADD CONSTRAINT user_identities_login_id_key UNIQUE (login_id);


-- 2. Rewrite reserve_username to fully remove the old idempotency block and use collision-checked random suffixes
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
  max_attempts integer := 100;
  attempts integer := 0;
BEGIN
  norm_name := username_input;
  
  if not norm_name ~ '^[a-zA-Z0-9_ ]{4,12}$' then
    raise exception 'Username must be 4-12 characters.';
  end if;
  
  if length(password_input) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  -- =========================================================
  -- UNIQUE ID GENERATION & COLLISION CHECK
  -- =========================================================
  loop
    attempts := attempts + 1;
    if attempts > max_attempts then
      raise exception 'Failed to generate a unique discriminator after % attempts.', max_attempts;
    end if;
    
    -- Generate random discriminator strictly between 0011 and 9999
    rand_disc := floor(random() * (9999 - 11 + 1)) + 11;
    str_disc := to_char(rand_disc, 'FM0000');
    full_id := norm_name || '#' || str_disc;
    
    -- Check if this specific full_id (e.g. TestId#0020) is already taken
    if not exists (select 1 from public.user_identities where login_id = full_id) then
      -- Unclaimed! Break out of the loop and claim it.
      exit;
    end if;
    -- If it exists, the loop repeats silently to generate a new suffix
  end loop;

  -- =========================================================
  -- NEW ACCOUNT CREATION
  -- =========================================================
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

GRANT EXECUTE ON FUNCTION public.reserve_username(text, text) TO anon, authenticated, service_role;

-- 3. Rewrite resolve_login_email to ONLY accept login_id
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
  where login_id = identifier
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
