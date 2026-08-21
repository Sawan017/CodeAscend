-- ============================================================
-- FIX: Missing table grants for group chat system
-- ============================================================

-- Grant table privileges to authenticated users.
-- RLS policies will restrict what rows they can actually access.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_group_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_group_messages TO authenticated;

-- Also grant usage on the schema public just in case
GRANT USAGE ON SCHEMA public TO authenticated;
