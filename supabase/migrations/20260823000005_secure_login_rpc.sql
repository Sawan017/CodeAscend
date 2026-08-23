-- Secure RPC for Login ID Resolution
-- Returns the email only if the password is correct to prevent username enumeration.
CREATE OR REPLACE FUNCTION public.resolve_login_id_secure(identifier text, pass text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  target_user_id uuid;
  target_email text;
  is_valid boolean;
BEGIN
  -- 1. Try resolving using user_identities (strict login_id match to support shared base usernames)
  SELECT user_id INTO target_user_id 
  FROM public.user_identities 
  WHERE login_id = identifier
  LIMIT 1;
  
  IF target_user_id IS NOT NULL THEN
    -- Verify password securely
    SELECT (encrypted_password = extensions.crypt(pass, encrypted_password)), email 
    INTO is_valid, target_email 
    FROM auth.users 
    WHERE id = target_user_id 
    LIMIT 1;

    IF is_valid THEN
      RETURN target_email;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_login_id_secure(text, text) TO anon, authenticated;
