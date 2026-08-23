-- ==========================================================================
-- CHAT RATE LIMITING
-- ==========================================================================

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

  -- Enforce rate limit (30 messages per minute)
  PERFORM public.check_rate_limit(my_uid::text || ':chat', 30, '1 minute'::interval);

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
