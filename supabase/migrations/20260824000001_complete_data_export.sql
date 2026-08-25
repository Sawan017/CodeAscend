-- Phase 2: COMPLETE DATA EXPORT FIX

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
    'profiles', (SELECT json_agg(row_to_json(p)) FROM public.profiles p WHERE p.user_id = current_user_id),
    'progression', (SELECT json_agg(row_to_json(p)) FROM public.progression p WHERE p.user_id = current_user_id),
    'goals', (SELECT json_agg(row_to_json(g)) FROM public.goals g WHERE g.user_id = current_user_id),
    'projects', (SELECT json_agg(row_to_json(pr)) FROM public.projects pr WHERE pr.user_id = current_user_id),
    'skills', (SELECT json_agg(row_to_json(s)) FROM public.skills s WHERE s.user_id = current_user_id),
    'achievements', (SELECT json_agg(row_to_json(a)) FROM public.achievements a WHERE a.user_id = current_user_id),
    'badges', (SELECT json_agg(row_to_json(b)) FROM public.badges b WHERE b.user_id = current_user_id),
    'settings', (SELECT json_agg(row_to_json(s)) FROM public.settings s WHERE s.user_id = current_user_id),
    'friendships', (SELECT json_agg(row_to_json(f)) FROM public.friendships f WHERE f.user_id1 = current_user_id OR f.user_id2 = current_user_id),
    'friend_requests', (SELECT json_agg(row_to_json(fr)) FROM public.friend_requests fr WHERE fr.sender_id = current_user_id OR fr.receiver_id = current_user_id),
    'support_tickets', (SELECT json_agg(row_to_json(st)) FROM public.support_tickets st WHERE st.user_id = current_user_id),
    'support_messages', (SELECT json_agg(row_to_json(sm)) FROM public.support_messages sm WHERE sm.sender_id = current_user_id),
    'chat_groups', (SELECT json_agg(row_to_json(cg)) FROM public.chat_groups cg WHERE cg.created_by = current_user_id),
    'chat_group_members', (SELECT json_agg(row_to_json(cgm)) FROM public.chat_group_members cgm WHERE cgm.user_id = current_user_id),
    'chat_group_messages', (SELECT json_agg(row_to_json(cgm)) FROM public.chat_group_messages cgm WHERE cgm.sender_id = current_user_id),
    'consents', (SELECT json_agg(row_to_json(c)) FROM public.user_legal_consents c WHERE c.user_id = current_user_id),
    'identities', (SELECT json_agg(row_to_json(ui)) FROM public.user_identities ui WHERE ui.user_id = current_user_id)
  ) INTO user_data;

  RETURN user_data;
END;
$$;

GRANT EXECUTE ON FUNCTION public.export_user_data() TO authenticated;
