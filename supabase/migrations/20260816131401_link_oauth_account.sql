-- Custom RPC to link a newly created OAuth account to an existing account
CREATE OR REPLACE FUNCTION public.link_oauth_account(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  google_email text;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get the email from the newly created Google account
  SELECT email INTO google_email FROM auth.users WHERE id = current_user_id;

  IF google_email IS NULL THEN
    RAISE EXCEPTION 'No email found for current user';
  END IF;

  -- Update the target account with the new email
  -- Note: If email is already taken, this might throw a unique constraint violation
  UPDATE auth.users SET email = google_email WHERE id = target_user_id;

  -- Move the Google identity to the target account
  UPDATE auth.identities SET user_id = target_user_id WHERE user_id = current_user_id AND provider = 'google';

  -- Delete the temporary Google account
  DELETE FROM auth.users WHERE id = current_user_id;

  RETURN json_build_object('success', true, 'email', google_email);
END;
$$;
-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.link_oauth_account(uuid) TO authenticated;
