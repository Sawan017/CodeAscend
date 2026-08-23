-- ==========================================================================
-- AUTHENTICATION RATE LIMITING
-- ==========================================================================

-- 1. Apply rate limit to change_password
CREATE OR REPLACE FUNCTION public.change_password(new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  v_user_id uuid;
  v_username text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Rate limit: 5 password changes per day per user
  PERFORM public.check_rate_limit(v_user_id::text || ':password_change', 5, '1 day'::interval);
  
  -- Get username context for validation
  SELECT username INTO v_username 
  FROM public.user_identities 
  WHERE user_id = v_user_id 
  LIMIT 1;
  
  -- Enforce strong password
  PERFORM public.validate_strong_password(new_password, v_username);
  
  -- Update auth.users with new encrypted password
  UPDATE auth.users 
  SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = now()
  WHERE id = v_user_id;
END;
$$;

-- 2. Apply rate limit to reserve_username
CREATE OR REPLACE FUNCTION public.reserve_username(
  username_input text, 
  password_input text,
  terms_version text DEFAULT '1.0',
  privacy_version text DEFAULT '1.0'
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
  
  v_ip text;
BEGIN
  -- Rate limit signup endpoint based on IP: 10 per hour
  v_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown');
  PERFORM public.check_rate_limit(v_ip || ':signup', 10, '1 hour'::interval);

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
