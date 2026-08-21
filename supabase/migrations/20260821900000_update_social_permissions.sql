-- 1. send_friend_request
CREATE OR REPLACE FUNCTION public.send_friend_request(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

    -- Privacy check
    SELECT data INTO target_settings FROM public.profiles WHERE user_id = target_user_id AND key = 'settings';
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


-- 2. send_chat_message
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
  v_permission text;
BEGIN
  IF my_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_receiver_uuid := p_receiver_id::uuid;

  SELECT data INTO my_chat FROM public.profiles WHERE user_id = my_uid AND key = 'chat';
  IF my_chat ? 'blockedUsers' AND jsonb_typeof(my_chat->'blockedUsers') = 'array' THEN
    IF my_chat->'blockedUsers' @> to_jsonb(p_receiver_id) THEN
      RAISE EXCEPTION 'Cannot send message to blocked user';
    END IF;
  END IF;

  SELECT data INTO receiver_chat FROM public.profiles WHERE user_id = v_receiver_uuid AND key = 'chat';
  IF receiver_chat ? 'blockedUsers' AND jsonb_typeof(receiver_chat->'blockedUsers') = 'array' THEN
    IF receiver_chat->'blockedUsers' @> to_jsonb(my_uid::text) THEN
      RAISE EXCEPTION 'You have been blocked by this user';
    END IF;
  END IF;

  -- Privacy check
  SELECT data INTO target_settings FROM public.profiles WHERE user_id = v_receiver_uuid AND key = 'settings';
  v_permission := coalesce(target_settings->>'whoCanMessage', 'everyone');
  
  IF v_permission = 'friends' OR target_settings->>'allowMessages' = 'false' THEN
      IF NOT EXISTS (
          SELECT 1 FROM public.friendships
          WHERE (user_id1 = my_uid AND user_id2 = v_receiver_uuid)
             OR (user_id1 = v_receiver_uuid AND user_id2 = my_uid)
      ) THEN
          RAISE EXCEPTION 'This user only accepts messages from friends.';
      END IF;
  END IF;

  new_msg := jsonb_build_object(
    'id', p_msg_id,
    'conversationId', (
      SELECT CASE WHEN my_uid < v_receiver_uuid THEN my_uid::text || '_' || p_receiver_id
                  ELSE p_receiver_id || '_' || my_uid::text END
    ),
    'senderId', my_uid,
    'receiverId', p_receiver_id,
    'content', p_content,
    'timestamp', p_timestamp,
    'read', false
  );

  IF my_chat IS NULL THEN my_chat := '{}'::jsonb; END IF;
  IF receiver_chat IS NULL THEN receiver_chat := '{}'::jsonb; END IF;

  my_chat := jsonb_set(
    my_chat,
    '{messages}',
    COALESCE(my_chat->'messages', '[]'::jsonb) || new_msg
  );
  receiver_chat := jsonb_set(
    receiver_chat,
    '{messages}',
    COALESCE(receiver_chat->'messages', '[]'::jsonb) || new_msg
  );

  UPDATE public.profiles SET data = my_chat WHERE user_id = my_uid AND key = 'chat';
  UPDATE public.profiles SET data = receiver_chat WHERE user_id = v_receiver_uuid AND key = 'chat';

  PERFORM public.notify_user(v_receiver_uuid, 'message', new_msg);

  RETURN new_msg;
END;
$$;


-- 3. create_chat_group
CREATE OR REPLACE FUNCTION public.create_chat_group(
    p_name text,
    p_description text DEFAULT NULL,
    p_avatar text DEFAULT NULL,
    p_members uuid[] DEFAULT '{}'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_group_id uuid;
    v_creator_id uuid;
    v_member_id uuid;
    target_settings jsonb;
    v_permission text;
BEGIN
    v_creator_id := auth.uid();
    IF v_creator_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF array_length(p_members, 1) > 0 THEN
        FOREACH v_member_id IN ARRAY p_members
        LOOP
            IF v_member_id != v_creator_id THEN
                SELECT data INTO target_settings FROM public.profiles WHERE user_id = v_member_id AND key = 'settings';
                v_permission := coalesce(target_settings->>'whoCanGroup', 'everyone');
                IF v_permission = 'friends' THEN
                    IF NOT EXISTS (
                        SELECT 1 FROM public.friendships
                        WHERE (user_id1 = v_creator_id AND user_id2 = v_member_id)
                           OR (user_id1 = v_member_id AND user_id2 = v_creator_id)
                    ) THEN
                        RAISE EXCEPTION 'One or more users only allow friends to add them to groups.';
                    END IF;
                END IF;
            END IF;
        END LOOP;
    END IF;

    INSERT INTO public.chat_groups (name, description, avatar, created_by)
    VALUES (p_name, p_description, p_avatar, v_creator_id)
    RETURNING id INTO v_group_id;

    IF NOT EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = v_group_id AND user_id = v_creator_id) THEN
        INSERT INTO public.chat_group_members (group_id, user_id, role)
        VALUES (v_group_id, v_creator_id, 'owner');
    END IF;

    IF array_length(p_members, 1) > 0 THEN
        FOREACH v_member_id IN ARRAY p_members
        LOOP
            IF v_member_id != v_creator_id THEN
                IF NOT EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = v_group_id AND user_id = v_member_id) THEN
                    INSERT INTO public.chat_group_members (group_id, user_id, role)
                    VALUES (v_group_id, v_member_id, 'member');
                END IF;
            END IF;
        END LOOP;
    END IF;

    RETURN json_build_object('id', v_group_id);
END;
$$;


-- 4. check_group_member_privacy trigger
CREATE OR REPLACE FUNCTION public.check_group_member_privacy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_creator_id uuid := auth.uid();
    target_settings jsonb;
    v_permission text;
BEGIN
    IF v_creator_id IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW.user_id != v_creator_id THEN
        SELECT data INTO target_settings FROM public.profiles WHERE user_id = NEW.user_id AND key = 'settings';
        v_permission := coalesce(target_settings->>'whoCanGroup', 'everyone');
        IF v_permission = 'friends' THEN
            IF NOT EXISTS (
                SELECT 1 FROM public.friendships
                WHERE (user_id1 = v_creator_id AND user_id2 = NEW.user_id)
                   OR (user_id1 = NEW.user_id AND user_id2 = v_creator_id)
            ) THEN
                RAISE EXCEPTION 'This user only allows friends to add them to groups.';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;
