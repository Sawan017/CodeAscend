-- Fix send_friend_request checking wrong table for settings
CREATE OR REPLACE FUNCTION public.send_friend_request(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_settings jsonb;
    v_permission text;
BEGIN
    IF auth.uid() = target_user_id THEN
        RAISE EXCEPTION 'You cannot send a friend request to yourself.';
    END IF;

    -- Check if already friends
    IF EXISTS (
        SELECT 1 FROM public.friendships 
        WHERE (user_id1 = auth.uid() AND user_id2 = target_user_id)
           OR (user_id1 = target_user_id AND user_id2 = auth.uid())
    ) THEN
        RAISE EXCEPTION 'You are already friends with this user.';
    END IF;
    
    -- Check if request already exists
    IF EXISTS (
        SELECT 1 FROM public.friend_requests 
        WHERE (sender_id = auth.uid() AND receiver_id = target_user_id AND status = 'pending')
    ) THEN
        RAISE EXCEPTION 'Friend request already sent.';
    END IF;

    -- Privacy check (Fixed to use public.settings instead of public.profiles)
    SELECT data INTO target_settings FROM public.settings WHERE user_id = target_user_id AND key = 'settings';
    v_permission := coalesce(target_settings->>'whoCanFriendRequest', 'everyone');
    
    IF v_permission = 'none' OR target_settings->>'allowFriendRequests' = 'false' THEN
        RAISE EXCEPTION 'This user does not accept friend requests.';
    ELSIF v_permission = 'friends_of_friends' THEN
        IF NOT EXISTS (
            SELECT 1 FROM (
                SELECT CASE WHEN user_id1 = auth.uid() THEN user_id2 ELSE user_id1 END as f_id 
                FROM public.friendships WHERE user_id1 = auth.uid() OR user_id2 = auth.uid()
            ) my_friends
            JOIN (
                SELECT CASE WHEN user_id1 = target_user_id THEN user_id2 ELSE user_id1 END as f_id 
                FROM public.friendships WHERE user_id1 = target_user_id OR user_id2 = target_user_id
            ) their_friends ON my_friends.f_id = their_friends.f_id
        ) THEN
            RAISE EXCEPTION 'This user only accepts friend requests from friends of friends.';
        END IF;
    END IF;

    -- Insert request
    INSERT INTO public.friend_requests (sender_id, receiver_id, status)
    VALUES (auth.uid(), target_user_id, 'pending');
END;
$$;
