CREATE OR REPLACE FUNCTION public.resolve_login_id_secure(identifier text, pass text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id uuid;
  target_email text;
  is_valid boolean;
  v_ip text;
BEGIN
  -- 1. IP Rate Limiting (DoS protection)
  -- Uses x-forwarded-for to throttle based on IP address
  v_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown');
  PERFORM public.check_rate_limit('ip:' || v_ip || ':login', 30, '1 minute'::interval);
  
  -- 2. Identifier Rate Limiting (Brute-force protection)
  -- Applies identical thresholds whether the identifier exists or not to prevent enumeration
  PERFORM public.check_rate_limit('id:' || identifier || ':login', 5, '5 minutes'::interval);
  PERFORM public.check_rate_limit('id:' || identifier || ':login_long', 10, '30 minutes'::interval);

  -- 3. Resolve using user_identities (strict login_id match)
  SELECT user_id INTO target_user_id 
  FROM public.user_identities 
  WHERE login_id = identifier
  LIMIT 1;
  
  IF target_user_id IS NULL THEN
    -- Prevent timing attacks by wasting the exact same amount of CPU cycles
    PERFORM extensions.crypt(pass, '$2a$06$FvFvFvFvFvFvFvFvFvFvFv');
    RETURN NULL;
  END IF;

  -- Verify password securely
  SELECT (encrypted_password = extensions.crypt(pass, encrypted_password)), email 
  INTO is_valid, target_email 
  FROM auth.users 
  WHERE id = target_user_id 
  LIMIT 1;

  IF is_valid THEN
    RETURN target_email;
  END IF;

  RETURN NULL;
END;
$$;
