-- ==========================================================================
-- STRONG PASSWORD ENFORCEMENT (Backend)
-- ==========================================================================
-- This migration updates the reserve_username RPC to enforce strong password
-- requirements server-side. The frontend validates identically, but the
-- backend MUST independently reject weak passwords even if the UI is bypassed.
-- ==========================================================================

-- Helper function: validate password strength (server-side)
CREATE OR REPLACE FUNCTION public.validate_strong_password(
  pw text,
  username_ctx text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  lower_pw text := lower(pw);
  char_set integer;
  common_list text[] := ARRAY[
    'password','password1','password123','password1234','123456','1234567',
    '12345678','123456789','1234567890','qwerty','qwerty123','qwertyuiop',
    'abc123','abcdef','abcdefgh','letmein','welcome','monkey','dragon',
    'master','login','princess','admin','administrator','root','trustno1',
    'iloveyou','sunshine','shadow','football','baseball','soccer',
    'superman','batman','starwars','whatever','qazwsx','passw0rd',
    'p@ssw0rd','p@ssword','pass1234','changeme','default','testing',
    'access','hello','mustang','bailey','freedom','summer','winter',
    'computer','internet','google','facebook','arinova','arinova123',
    '1q2w3e4r','1q2w3e4r5t','1qaz2wsx','zaq12wsx','qweasdzxc',
    'q1w2e3r4','abcd1234','nothing','trustme','hello123','secret',
    'secret123','temp1234','guest','guest123','welcome1','admin123',
    '111111','222222','333333','444444','555555','666666','777777',
    '888888','999999','000000','111111111111','123456789012',
    'aaaaaaaaaaaa','password12345'
  ];
BEGIN
  -- 1. Minimum length: 12 characters
  IF length(pw) < 12 THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 2. Must contain uppercase
  IF pw !~ '[A-Z]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 3. Must contain lowercase
  IF pw !~ '[a-z]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 4. Must contain digit
  IF pw !~ '[0-9]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 5. Must contain special character (anything not alphanumeric/space)
  IF pw !~ '[^a-zA-Z0-9 ]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 6. No spaces
  IF pw ~ '\s' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 7. Not all repeated characters
  SELECT count(DISTINCT c) INTO char_set FROM unnest(string_to_array(pw, NULL)) AS c;
  IF char_set <= 1 THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 8. Not a common password
  IF lower_pw = ANY(common_list) THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 9. Must not contain username
  IF username_ctx IS NOT NULL AND length(username_ctx) >= 3 THEN
    IF position(lower(username_ctx) IN lower_pw) > 0 THEN
      RAISE EXCEPTION 'Password does not meet security requirements.';
    END IF;
  END IF;
END;
$$;

-- Now update reserve_username to use the new validator
CREATE OR REPLACE FUNCTION public.reserve_username(
  username_input text, 
  password_input text,
  terms_version text,
  privacy_version text
)
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
  
  existing_id uuid;
  existing_login_id text;
  existing_disc text;
  existing_username text;
  existing_email text;
BEGIN
  IF terms_version IS NULL OR privacy_version IS NULL THEN
    RAISE EXCEPTION 'Explicit consent to Terms of Service and Privacy Policy is required.';
  END IF;

  norm_name := username_input;
  
  IF NOT norm_name ~ '^[a-zA-Z0-9_ ]{4,12}$' THEN
    RAISE EXCEPTION 'Username must be 4-12 characters.';
  END IF;
  
  -- Enforce strong password server-side
  PERFORM public.validate_strong_password(password_input, username_input);

  -- Idempotency check
  SELECT ui.id, ui.login_id, ui.user_id_number, ui.username, u.email
  INTO existing_id, existing_login_id, existing_disc, existing_username, existing_email
  FROM public.user_identities ui
  JOIN auth.users u ON u.id = ui.user_id
  WHERE ui.username = username_input
  AND ui.created_at > now() - interval '15 minutes'
  AND u.encrypted_password = extensions.crypt(password_input, u.encrypted_password)
  LIMIT 1;

  IF existing_id IS NOT NULL THEN
    RETURN json_build_object(
      'id', existing_id,
      'login_id', existing_login_id,
      'user_id_number', existing_disc,
      'username', existing_username,
      'dummy_email', existing_email
    );
  END IF;

  -- Generate unique discriminator
  LOOP
    attempts := attempts + 1;
    IF attempts > max_attempts THEN
      RAISE EXCEPTION 'Failed to generate a unique discriminator after % attempts.', max_attempts;
    END IF;
    
    rand_disc := floor(random() * (9999 - 11 + 1)) + 11;
    str_disc := to_char(rand_disc, 'FM0000');
    full_id := norm_name || '#' || str_disc;
    
    IF NOT EXISTS (SELECT 1 FROM public.user_identities WHERE login_id = full_id) THEN
      EXIT;
    END IF;
  END LOOP;

  new_identity_id := gen_random_uuid();
  new_auth_user_id := gen_random_uuid();
  dummy_email := 'id_' || new_identity_id::text || '@example.com';
  
  enc_pass := extensions.crypt(password_input, extensions.gen_salt('bf'));

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

  INSERT INTO public.user_identities (
    id, user_id, username, normalized_name, user_id_number, login_id, status, role
  ) VALUES (
    new_identity_id, new_auth_user_id, username_input, norm_name, str_disc, full_id, 'ACTIVE', 'user'
  );

  INSERT INTO public.user_legal_consents (user_id, terms_version, privacy_version)
  VALUES (new_auth_user_id, terms_version, privacy_version);
  
  RETURN json_build_object(
    'id', new_identity_id,
    'login_id', full_id,
    'user_id_number', str_disc,
    'username', username_input,
    'dummy_email', dummy_email
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.reserve_username(text, text, text, text) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
