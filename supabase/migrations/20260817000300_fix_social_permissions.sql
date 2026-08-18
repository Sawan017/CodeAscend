-- ============================================================
-- FIX SOCIAL NETWORK PERMISSIONS
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.friend_requests TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO authenticated, anon;
