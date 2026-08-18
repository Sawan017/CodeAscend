-- ============================================================
-- ENFORCE CHAT BLOCKS ON INSERT (BIDIRECTIONAL)
-- ============================================================

CREATE OR REPLACE FUNCTION enforce_chat_blocks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  msg jsonb;
  receiver_id uuid;
  receiver_chat jsonb;
  sender_blocked jsonb;
  receiver_blocked jsonb;
BEGIN
  IF NEW.key = 'chat' THEN
    -- Extract sender's blocked list
    IF NEW.data ? 'blockedUsers' THEN
      sender_blocked := NEW.data->'blockedUsers';
    ELSE
      sender_blocked := '[]'::jsonb;
    END IF;

    -- Only check newly added messages to avoid failing on historical messages
    -- We do this by finding elements in NEW.data->'messages' that are NOT in OLD.data->'messages'
    IF NEW.data ? 'messages' AND jsonb_typeof(NEW.data->'messages') = 'array' THEN
      FOR msg IN 
        SELECT * FROM jsonb_array_elements(NEW.data->'messages')
        EXCEPT
        SELECT * FROM jsonb_array_elements(
          CASE 
            WHEN OLD.data IS NOT NULL AND OLD.data ? 'messages' AND jsonb_typeof(OLD.data->'messages') = 'array' 
            THEN OLD.data->'messages' 
            ELSE '[]'::jsonb 
          END
        )
      LOOP
        -- For outgoing messages
        IF (msg->>'senderId') = NEW.user_id::text THEN
          receiver_id := (msg->>'receiverId')::uuid;

          -- Rule 1: Sender cannot send to someone they blocked
          IF sender_blocked @> to_jsonb(receiver_id::text) THEN
            RAISE EXCEPTION 'Cannot send message to blocked user %', receiver_id;
          END IF;

          -- Rule 2: Sender cannot send to someone who blocked them
          SELECT data INTO receiver_chat FROM public.profiles WHERE user_id = receiver_id AND key = 'chat';
          IF receiver_chat ? 'blockedUsers' THEN
            receiver_blocked := receiver_chat->'blockedUsers';
            IF receiver_blocked @> to_jsonb(NEW.user_id::text) THEN
              RAISE EXCEPTION 'You have been blocked by user %', receiver_id;
            END IF;
          END IF;
        END IF;
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_chat_blocks ON public.profiles;
CREATE TRIGGER trg_enforce_chat_blocks
BEFORE UPDATE OR INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION enforce_chat_blocks();
