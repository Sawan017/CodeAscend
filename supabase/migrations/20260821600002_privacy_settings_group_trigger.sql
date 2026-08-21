CREATE OR REPLACE FUNCTION public.check_group_member_privacy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_settings jsonb;
    v_creator_id uuid := auth.uid();
BEGIN
    -- Only check if someone ELSE is adding this user
    IF NEW.user_id != v_creator_id THEN
        SELECT data INTO target_settings FROM public.profiles WHERE user_id = NEW.user_id AND key = 'settings';
        IF target_settings IS NOT NULL AND target_settings->>'allowMessages' = 'false' THEN
            RAISE EXCEPTION 'This user does not accept new messages or group invitations.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_group_member_privacy ON public.chat_group_members;

CREATE TRIGGER trg_check_group_member_privacy
BEFORE INSERT ON public.chat_group_members
FOR EACH ROW
EXECUTE FUNCTION public.check_group_member_privacy();
