-- ==========================================================================
-- PASSWORD CHANGE ENFORCEMENT
-- ==========================================================================
-- Creates a secure RPC for password changes to enforce strong password 
-- requirements server-side.

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

GRANT EXECUTE ON FUNCTION public.change_password(text) TO authenticated;
