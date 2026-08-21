-- ============================================================
-- FIX: Infinite recursion in chat_group_members RLS policies
-- ============================================================
-- PROBLEM: Every RLS policy on chat_group_members contained a subquery
-- like EXISTS (SELECT 1 FROM chat_group_members m2 WHERE ...) which
-- re-triggers the same RLS policies, causing infinite recursion.
--
-- SOLUTION: Create SECURITY DEFINER helper functions that bypass RLS
-- to check membership/admin status, then rewrite all policies to use
-- those helpers instead of direct subqueries.
-- ============================================================

-- 1. Helper: Check if a user is a member of a group (any role)
CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.chat_group_members
        WHERE group_id = p_group_id AND user_id = p_user_id
    );
$$;

-- 2. Helper: Check if a user is an admin or owner of a group
CREATE OR REPLACE FUNCTION public.is_group_admin(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.chat_group_members
        WHERE group_id = p_group_id AND user_id = p_user_id AND role IN ('owner', 'admin')
    );
$$;

-- 3. Helper: Check if a user is the owner of a group
CREATE OR REPLACE FUNCTION public.is_group_owner(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.chat_group_members
        WHERE group_id = p_group_id AND user_id = p_user_id AND role = 'owner'
    );
$$;


-- ============================================================
-- Rewrite chat_group_members policies using the helpers
-- ============================================================

-- SELECT: Members can view other members of groups they belong to
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.chat_group_members;
CREATE POLICY "Users can view members of their groups" ON public.chat_group_members
    FOR SELECT TO authenticated
    USING (public.is_group_member(group_id, auth.uid()));

-- INSERT: Admins/owners can add members.
-- The initial owner insert is done by the handle_new_chat_group trigger
-- which is SECURITY DEFINER and bypasses RLS entirely.
DROP POLICY IF EXISTS "Admins can add members" ON public.chat_group_members;
CREATE POLICY "Admins can add members" ON public.chat_group_members
    FOR INSERT TO authenticated
    WITH CHECK (public.is_group_admin(group_id, auth.uid()));

-- UPDATE: Only admins/owners can change member roles
DROP POLICY IF EXISTS "Admins can update members" ON public.chat_group_members;
CREATE POLICY "Admins can update members" ON public.chat_group_members
    FOR UPDATE TO authenticated
    USING (public.is_group_admin(group_id, auth.uid()));

-- DELETE: Admins can remove members, or a user can remove themselves (leave)
DROP POLICY IF EXISTS "Admins can remove members or users can leave" ON public.chat_group_members;
CREATE POLICY "Admins can remove members or users can leave" ON public.chat_group_members
    FOR DELETE TO authenticated
    USING (
        auth.uid() = user_id
        OR public.is_group_admin(group_id, auth.uid())
    );


-- ============================================================
-- Rewrite chat_groups policies using the helpers
-- ============================================================

DROP POLICY IF EXISTS "Users can view groups they belong to" ON public.chat_groups;
CREATE POLICY "Users can view groups they belong to" ON public.chat_groups
    FOR SELECT TO authenticated
    USING (public.is_group_member(id, auth.uid()));

DROP POLICY IF EXISTS "Admins can update groups" ON public.chat_groups;
CREATE POLICY "Admins can update groups" ON public.chat_groups
    FOR UPDATE TO authenticated
    USING (public.is_group_admin(id, auth.uid()));

DROP POLICY IF EXISTS "Owners can delete groups" ON public.chat_groups;
CREATE POLICY "Owners can delete groups" ON public.chat_groups
    FOR DELETE TO authenticated
    USING (public.is_group_owner(id, auth.uid()));


-- ============================================================
-- Rewrite chat_group_messages policies using the helpers
-- ============================================================

DROP POLICY IF EXISTS "Members can view messages" ON public.chat_group_messages;
CREATE POLICY "Members can view messages" ON public.chat_group_messages
    FOR SELECT TO authenticated
    USING (public.is_group_member(group_id, auth.uid()));

DROP POLICY IF EXISTS "Members can send messages" ON public.chat_group_messages;
CREATE POLICY "Members can send messages" ON public.chat_group_messages
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = sender_id AND public.is_group_member(group_id, auth.uid()));
