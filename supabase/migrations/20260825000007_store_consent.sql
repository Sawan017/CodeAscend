-- Step 1: Add columns to user_identities
ALTER TABLE public.user_identities 
ADD COLUMN IF NOT EXISTS terms_version text DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS privacy_version text DEFAULT '1.0';

-- Step 2: Update reserve_username to insert these versions
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
  dummy_email text;
  max_attempts integer := 100;
  attempts integer := 0;
  v_ip text;
BEGIN
  v_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown');
  PERFORM public.check_rate_limit(v_ip || ':signup', 10, '1 hour'::interval);

  IF terms_version IS NULL OR privacy_version IS NULL THEN
    RAISE EXCEPTION 'Explicit consent to Terms of Service and Privacy Policy is required.';
  END IF;

  norm_name := username_input;
  IF NOT norm_name ~ '^[a-zA-Z0-9_ ]{4,12}$' THEN
    RAISE EXCEPTION 'Username must be 4-12 characters.';
  END IF;

  PERFORM public.validate_strong_password(password_input, username_input);

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

  INSERT INTO public.user_identities (
    username, normalized_name, user_id_number, login_id, status, role, terms_version, privacy_version
  ) VALUES (
    norm_name, norm_name, str_disc, full_id, 'RESERVED', 'user', terms_version, privacy_version
  ) RETURNING id INTO new_identity_id;

  dummy_email := 'id_' || new_identity_id::text || '@example.com';

  RETURN json_build_object(
    'id', new_identity_id,
    'login_id', full_id,
    'user_id_number', str_disc,
    'username', norm_name,
    'dummy_email', dummy_email
  );
END;
$$;

-- Step 3: Update trigger_link_reserved_identity to insert into user_legal_consents
CREATE OR REPLACE FUNCTION public.link_reserved_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  extracted_id uuid;
  v_terms text;
  v_privacy text;
BEGIN
  IF NEW.email LIKE 'id_%@example.com' THEN
    extracted_id := (substring(NEW.email from 4 for 36))::uuid;
    
    UPDATE public.user_identities 
    SET user_id = NEW.id, status = 'ACTIVE' 
    WHERE id = extracted_id AND status = 'RESERVED'
    RETURNING terms_version, privacy_version INTO v_terms, v_privacy;
    
    IF FOUND THEN
      INSERT INTO public.user_legal_consents (user_id, terms_version, privacy_version)
      VALUES (NEW.id, coalesce(v_terms, '1.0'), coalesce(v_privacy, '1.0'));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
