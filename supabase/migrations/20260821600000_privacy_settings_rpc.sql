CREATE OR REPLACE FUNCTION public.send_friend_request(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_settings jsonb;
BEGIN
    IF auth.uid() = target_user_id THEN
        RAISE EXCEPTION 'You cannot send a friend request to yourself.';
    END IF;

    -- Check if target allows friend requests
    SELECT data INTO target_settings FROM public.profiles WHERE user_id = target_user_id AND key = 'settings';
    IF target_settings IS NOT NULL AND target_settings->>'allowFriendRequests' = 'false' THEN
        RAISE EXCEPTION 'This user does not accept friend requests.';
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
           OR (sender_id = target_user_id AND receiver_id = auth.uid() AND status = 'pending')
    ) THEN
        RAISE EXCEPTION 'A friend request is already pending between these users.';
    END IF;

    INSERT INTO public.friend_requests (sender_id, receiver_id)
    VALUES (auth.uid(), target_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.send_chat_message(
  p_receiver_id text,
  p_msg_id text,
  p_content text,
  p_timestamp text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  my_uid uuid := auth.uid();
  my_chat jsonb;
  receiver_chat jsonb;
  new_msg jsonb;
  v_receiver_uuid uuid;
  target_settings jsonb;
  has_history boolean := false;
BEGIN
  IF my_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_receiver_uuid := p_receiver_id::uuid;

  -- 1. Check if I have blocked the receiver
  SELECT data INTO my_chat FROM public.profiles WHERE user_id = my_uid AND key = 'chat';
  IF my_chat ? 'blockedUsers' AND jsonb_typeof(my_chat->'blockedUsers') = 'array' THEN
    IF my_chat->'blockedUsers' @> to_jsonb(p_receiver_id) THEN
      RAISE EXCEPTION 'Cannot send message to blocked user';
    END IF;
  END IF;

  -- 2. Check if the receiver has blocked me
  SELECT data INTO receiver_chat FROM public.profiles WHERE user_id = v_receiver_uuid AND key = 'chat';
  IF receiver_chat ? 'blockedUsers' AND jsonb_typeof(receiver_chat->'blockedUsers') = 'array' THEN
    IF receiver_chat->'blockedUsers' @> to_jsonb(my_uid::text) THEN
      RAISE EXCEPTION 'You have been blocked by this user';
    END IF;
  END IF;

  -- 3. Verify friendship
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships 
    WHERE (user_id1 = my_uid AND user_id2 = v_receiver_uuid)
       OR (user_id2 = my_uid AND user_id1 = v_receiver_uuid)
  ) THEN
    RAISE EXCEPTION 'You can only send messages to friends';
  END IF;

  -- 3.5 Check allowMessages (prevent NEW chat creation)
  SELECT data INTO target_settings FROM public.profiles WHERE user_id = v_receiver_uuid AND key = 'settings';
  IF target_settings IS NOT NULL AND target_settings->>'allowMessages' = 'false' THEN
    -- Check if we already have a conversation history.
    IF my_chat ? 'messages' AND jsonb_typeof(my_chat->'messages') = 'array' THEN
       SELECT EXISTS (
           SELECT 1 FROM jsonb_array_elements(my_chat->'messages') m 
           WHERE (m->>'receiverId' = p_receiver_id AND m->>'senderId' = my_uid::text)
              OR (m->>'receiverId' = my_uid::text AND m->>'senderId' = p_receiver_id)
       ) INTO has_history;
    END IF;
    
    IF NOT has_history THEN
       IF receiver_chat ? 'messages' AND jsonb_typeof(receiver_chat->'messages') = 'array' THEN
          SELECT EXISTS (
              SELECT 1 FROM jsonb_array_elements(receiver_chat->'messages') m
              WHERE (m->>'receiverId' = my_uid::text AND m->>'senderId' = p_receiver_id)
                 OR (m->>'receiverId' = p_receiver_id AND m->>'senderId' = my_uid::text)
          ) INTO has_history;
       END IF;
    END IF;

    IF NOT has_history THEN
      RAISE EXCEPTION 'This user does not accept new messages.';
    END IF;
  END IF;

  -- 4. Build the new message JSON
  new_msg := jsonb_build_object(
    'id', p_msg_id,
    'conversationId', (
      SELECT CASE WHEN my_uid < v_receiver_uuid THEN my_uid::text || '_' || p_receiver_id
                  ELSE p_receiver_id || '_' || my_uid::text END
    ),
    'senderId', my_uid::text,
    'receiverId', p_receiver_id,
    'content', p_content,
    'timestamp', p_timestamp
  );

  -- 5. Append to my chat state
  IF my_chat IS NULL THEN
    my_chat := jsonb_build_object('messages', jsonb_build_array(new_msg));
  ELSIF NOT (my_chat ? 'messages') THEN
    my_chat := jsonb_set(my_chat, '{messages}', jsonb_build_array(new_msg));
  ELSE
    my_chat := jsonb_set(my_chat, '{messages}', (my_chat->'messages') || new_msg);
  END IF;

  -- 6. Save back to profiles
  UPDATE public.profiles SET data = my_chat WHERE user_id = my_uid AND key = 'chat';
  
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id, key, data) VALUES (my_uid, 'chat', my_chat);
  END IF;

  RETURN new_msg;
END;
$$;
