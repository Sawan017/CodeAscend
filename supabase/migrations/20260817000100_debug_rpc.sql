CREATE OR REPLACE FUNCTION public.debug_user_state(target_login_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  uid uuid;
  u_email text;
  u_identities json;
  u_profile json;
  u_user_identities json;
BEGIN
  -- 1. Get the user_id from user_identities
  SELECT user_id INTO uid FROM public.user_identities WHERE login_id = target_login_id;
  
  IF uid IS NULL THEN
    RETURN json_build_object('error', 'login_id not found in user_identities');
  END IF;

  -- 2. Get auth.users email
  SELECT email INTO u_email FROM auth.users WHERE id = uid;

  -- 3. Get auth.identities
  SELECT json_agg(row_to_json(i)) INTO u_identities FROM auth.identities i WHERE user_id = uid;

  -- 4. Get profile
  SELECT data INTO u_profile FROM public.profiles WHERE user_id = uid AND key = 'profile';

  -- 5. Get user_identities row
  SELECT row_to_json(ui) INTO u_user_identities FROM public.user_identities ui WHERE user_id = uid;

  RETURN json_build_object(
    'user_id', uid,
    'auth_email', u_email,
    'auth_identities', u_identities,
    'profile', u_profile,
    'user_identities', u_user_identities
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_user_state(text) TO anon, authenticated, service_role;
