-- ============================================================
-- ATOMIC AUTH SIGNUP MIGRATION
-- Bypasses Supabase API email rate limits by creating the
-- Auth User directly inside the same transaction as the identity.
-- ============================================================

-- Ensure pgcrypto is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Drop the previous version
DROP FUNCTION IF EXISTS public.reserve_username(text, uuid);

-- Create the new atomic signup function
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
BEGIN
  norm_name := username_input;
  
  if not norm_name ~ '^[a-zA-Z0-9_]{4,12}$' then
    raise exception 'Username must be 4-12 characters.';
  end if;
  
  if length(password_input) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  -- 1. Generate identity values
  rand_disc := nextval('public.arinova_user_id_seq');
  
  if rand_disc > 9999 then
    raise exception 'User ID sequence exhausted.';
  end if;
  
  str_disc := to_char(rand_disc, 'FM0000');
  full_id := norm_name || '#' || str_disc;
  
  new_identity_id := gen_random_uuid();
  new_auth_user_id := gen_random_uuid();
  dummy_email := 'id_' || new_identity_id::text || '@internal.arinova.com';
  
  -- 2. Generate bcrypt password hash
  enc_pass := extensions.crypt(password_input, extensions.gen_salt('bf'));

  -- 3. Insert into auth.users directly to bypass email rate limits
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    aud, role, created_at, updated_at, confirmation_token
  ) VALUES (
    new_auth_user_id, '00000000-0000-0000-0000-000000000000', dummy_email, enc_pass, now(), 
    'authenticated', 'authenticated', now(), now(), ''
  );
  
  -- 4. Insert into auth.identities so Supabase recognizes the email login
  -- Note: provider_id is required in newer Supabase Auth versions (usually maps to email for email provider)
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_auth_user_id, new_auth_user_id, jsonb_build_object('sub', new_auth_user_id::text, 'email', dummy_email), 'email', dummy_email, now(), now(), now()
  );

  -- 5. Insert into public.user_identities mapped to the new auth user
  insert into public.user_identities (
    id, user_id, username, normalized_name, user_id_number, login_id, status, role
  ) values (
    new_identity_id, new_auth_user_id, username_input, norm_name, str_disc, full_id, 'ACTIVE', 'user'
  );
  
  -- 6. Return the credentials needed for the frontend to sign in
  return json_build_object(
    'id', new_identity_id,
    'login_id', full_id,
    'user_id_number', str_disc,
    'username', username_input,
    'dummy_email', dummy_email
  );
END;
$$;

-- Grant execute permissions specifically for the new function signature
GRANT EXECUTE ON FUNCTION public.reserve_username(text, text) TO anon, authenticated, service_role;
