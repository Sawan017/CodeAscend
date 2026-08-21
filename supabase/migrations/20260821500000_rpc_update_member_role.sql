-- Create RPC for securely updating member roles
CREATE OR REPLACE FUNCTION public.update_group_member_role(
    p_group_id uuid,
    p_target_user_id uuid,
    p_new_role text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_role text;
    v_target_role text;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Validate role
    IF p_new_role NOT IN ('owner', 'admin', 'member') THEN
        RAISE EXCEPTION 'Invalid role specified';
    END IF;

    -- Get caller's role
    SELECT role INTO v_caller_role
    FROM chat_group_members
    WHERE group_id = p_group_id AND user_id = auth.uid();

    IF v_caller_role NOT IN ('owner', 'admin') THEN
        RAISE EXCEPTION 'Only admins or the owner can change roles';
    END IF;

    -- Get target's current role
    SELECT role INTO v_target_role
    FROM chat_group_members
    WHERE group_id = p_group_id AND user_id = p_target_user_id;

    IF v_target_role IS NULL THEN
        RAISE EXCEPTION 'Target is not a member of this group';
    END IF;

    -- Cannot change the owner's role
    IF v_target_role = 'owner' THEN
        RAISE EXCEPTION 'Cannot change the role of the group owner';
    END IF;
    
    -- Admins cannot change roles of other admins (only owner can do this)
    IF v_target_role = 'admin' AND v_caller_role = 'admin' AND p_target_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Admins cannot change the role of other admins';
    END IF;

    -- Perform the update
    UPDATE chat_group_members
    SET role = p_new_role
    WHERE group_id = p_group_id AND user_id = p_target_user_id;

END;
$$;
-- Disable direct updates to chat_group_members to force use of the secure RPC
DROP POLICY IF EXISTS "Admins can update members" ON public.chat_group_members;
