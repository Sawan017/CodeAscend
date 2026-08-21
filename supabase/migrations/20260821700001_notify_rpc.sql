CREATE OR REPLACE FUNCTION public.notify_user(
    p_user_id uuid,
    p_type text,
    p_title text,
    p_body text DEFAULT NULL,
    p_link_type text DEFAULT NULL,
    p_link_id text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_settings jsonb;
    master_switch boolean := true;
    category_switch boolean := true;
BEGIN
    -- Get user settings
    SELECT data INTO target_settings FROM public.profiles WHERE user_id = p_user_id AND key = 'settings';
    
    IF target_settings IS NOT NULL THEN
        -- 1. Check Master Switch
        IF target_settings->>'enableAllNotifications' = 'false' THEN
            master_switch := false;
        END IF;

        -- 2. Check Category Switch
        IF p_type = 'message' AND target_settings->>'notifyMessages' = 'false' THEN
            category_switch := false;
        ELSIF p_type = 'friend_request' AND target_settings->>'notifyFriendRequests' = 'false' THEN
            category_switch := false;
        ELSIF p_type = 'group_activity' AND target_settings->>'notifyGroupActivity' = 'false' THEN
            category_switch := false;
        ELSIF p_type = 'mention' AND target_settings->>'notifyMentions' = 'false' THEN
            category_switch := false;
        ELSIF p_type = 'achievement' AND target_settings->>'notifyAchievements' = 'false' THEN
            category_switch := false;
        ELSIF p_type = 'learning' AND target_settings->>'notifyLearningReminders' = 'false' THEN
            category_switch := false;
        END IF;
    END IF;

    -- Only insert if allowed
    IF master_switch = true AND category_switch = true THEN
        INSERT INTO public.notifications (user_id, type, title, body, link_type, link_id)
        VALUES (p_user_id, p_type, p_title, p_body, p_link_type, p_link_id);
    END IF;
END;
$$;
