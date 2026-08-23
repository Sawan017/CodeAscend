CREATE OR REPLACE FUNCTION public.export_user_data()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  user_data json;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT json_build_object(
    'profile', (SELECT row_to_json(p) FROM public.profiles p WHERE p.user_id = current_user_id),
    'friends', (SELECT json_agg(row_to_json(f)) FROM public.friends f WHERE f.sender_id = current_user_id OR f.receiver_id = current_user_id),
    'support_tickets', (SELECT json_agg(row_to_json(st)) FROM public.support_tickets st WHERE st.user_id = current_user_id),
    'consents', (SELECT json_agg(row_to_json(c)) FROM public.user_legal_consents c WHERE c.user_id = current_user_id)
  ) INTO user_data;

  RETURN user_data;
END;
$$;

GRANT EXECUTE ON FUNCTION public.export_user_data() TO authenticated;
NOTIFY pgrst, 'reload schema';
