-- ============================================================
-- SYNC USER METADATA DISPLAY NAME MIGRATION
-- ============================================================

-- 1. Update the reserve_username RPC so it inserts the login_id as display_name in raw_user_meta_data
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

  loop
    attempts := attempts + 1;
    if attempts > max_attempts then
      raise exception 'Failed to generate a unique discriminator after % attempts.', max_attempts;
    end if;
    
    rand_disc := floor(random() * (9999 - 11 + 1)) + 11;
    str_disc := to_char(rand_disc, 'FM0000');
    full_id := norm_name || '#' || str_disc;
    
    if not exists (select 1 from public.user_identities where login_id = full_id) then
      exit;
    end if;
  end loop;

  new_identity_id := gen_random_uuid();
  new_auth_user_id := gen_random_uuid();
  dummy_email := 'id_' || new_identity_id::text || '@example.com';
  
  enc_pass := extensions.crypt(password_input, extensions.gen_salt('bf'));

  -- Insert into auth.users directly.
  -- Add the permanent login_id to raw_user_meta_data under display_name.
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    aud, role, created_at, updated_at, 
    confirmation_token, recovery_token, email_change_token_new, email_change,
    phone, phone_change, phone_change_token, email_change_token_current, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user, is_anonymous, email_change_confirm_status
  ) VALUES (
    new_auth_user_id, '00000000-0000-0000-0000-000000000000', dummy_email, enc_pass, now(), 
    'authenticated', 'authenticated', now(), now(), 
    '', '', '', '', 
    NULL, '', '', '', '',
    '{}'::jsonb, jsonb_build_object('display_name', full_id), false, false, false, 0
  );
  
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_auth_user_id, new_auth_user_id, jsonb_build_object('sub', new_auth_user_id::text, 'email', dummy_email), 'email', dummy_email, now(), now(), now()
  );

  insert into public.user_identities (
    id, user_id, username, normalized_name, user_id_number, login_id, status, role
  ) values (
    new_identity_id, new_auth_user_id, username_input, norm_name, str_disc, full_id, 'ACTIVE', 'user'
  );
  
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

-- 2. Update existing accounts so their Auth metadata is populated with their permanent app User ID.
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(coalesce(raw_user_meta_data, '{}'::jsonb), '{display_name}', to_jsonb(ui.login_id))
FROM public.user_identities ui
WHERE auth.users.id = ui.user_id
AND (raw_user_meta_data->>'display_name' IS NULL OR raw_user_meta_data->>'display_name' = '');

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
