-- ============================================================
-- SECURE MESSAGE SENDING RPC (Fix Signature)
-- ============================================================

CREATE OR REPLACE FUNCTION send_chat_message(
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
BEGIN
  IF my_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_receiver_uuid := p_receiver_id::uuid;

  -- 1. Check if I have blocked the receiver
  SELECT data INTO my_chat FROM public.profiles WHERE user_id = my_uid AND key = 'chat';
  IF my_chat ? 'blockedUsers' AND my_chat->'blockedUsers' @> to_jsonb(p_receiver_id) THEN
    RAISE EXCEPTION 'Cannot send message to blocked user';
  END IF;

  -- 2. Check if the receiver has blocked me
  SELECT data INTO receiver_chat FROM public.profiles WHERE user_id = v_receiver_uuid AND key = 'chat';
  IF receiver_chat ? 'blockedUsers' AND receiver_chat->'blockedUsers' @> to_jsonb(my_uid::text) THEN
    RAISE EXCEPTION 'You have been blocked by this user';
  END IF;

  -- 3. Verify friendship
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships 
    WHERE (user_id1 = my_uid AND user_id2 = v_receiver_uuid)
       OR (user_id2 = my_uid AND user_id1 = v_receiver_uuid)
  ) THEN
    RAISE EXCEPTION 'You can only send messages to friends';
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

GRANT EXECUTE ON FUNCTION send_chat_message(text, text, text, text) TO authenticated;
