CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete from user_identities
  DELETE FROM public.user_identities WHERE user_id = current_user_id;

  -- Delete from auth.identities
  DELETE FROM auth.identities WHERE user_id = current_user_id;
  
  -- Delete from auth.users (cascades)
  DELETE FROM auth.users WHERE id = current_user_id;

  RETURN json_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
