-- 1. Create table
CREATE TABLE IF NOT EXISTS public.user_legal_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version text NOT NULL,
  privacy_version text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. RLS
ALTER TABLE public.user_legal_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own consent" ON public.user_legal_consents FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 3. Update RPC
DROP FUNCTION IF EXISTS public.reserve_username(text, text);

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
  
  -- Variables for idempotency check
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
  
  if not norm_name ~ '^[a-zA-Z0-9_ ]{4,12}$' then
    raise exception 'Username must be 4-12 characters.';
  end if;
  
  if length(password_input) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  SELECT ui.id, ui.login_id, ui.user_id_number, ui.username, u.email
  INTO existing_id, existing_login_id, existing_disc, existing_username, existing_email
  FROM public.user_identities ui
  JOIN auth.users u ON u.id = ui.user_id
  WHERE ui.username = username_input
  AND ui.created_at > now() - interval '15 minutes'
  AND u.encrypted_password = extensions.crypt(password_input, u.encrypted_password)
  LIMIT 1;

  IF existing_id IS NOT NULL THEN
    return json_build_object(
      'id', existing_id,
      'login_id', existing_login_id,
      'user_id_number', existing_disc,
      'username', existing_username,
      'dummy_email', existing_email
    );
  END IF;

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

  -- Store legal consent atomically
  INSERT INTO public.user_legal_consents (user_id, terms_version, privacy_version)
  VALUES (new_auth_user_id, terms_version, privacy_version);
  
  return json_build_object(
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
