-- ==========================================================================
-- EXHAUSTIVE SEARCH_PATH FIX
-- ==========================================================================

ALTER FUNCTION public.notify_user(uuid, text, text, text, text, text) SET search_path = public;
ALTER FUNCTION public.take_support_ticket(uuid) SET search_path = public;
ALTER FUNCTION public.is_official() SET search_path = public;
ALTER FUNCTION public.auto_assign_identity() SET search_path = public;
ALTER FUNCTION public.generate_ticket_number() SET search_path = public;
ALTER FUNCTION public.create_chat_group(text, text, text, uuid[]) SET search_path = public;
ALTER FUNCTION public.check_group_member_privacy() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.cleanup_expired_reservations() SET search_path = public;
