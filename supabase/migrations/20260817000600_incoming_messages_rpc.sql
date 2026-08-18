-- ============================================================
-- SECURE INCOMING CHAT MESSAGES RPC (Bidirectional Block)
-- ============================================================

CREATE OR REPLACE FUNCTION get_incoming_messages()
RETURNS jsonb[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb[] := '{}';
  profile_row RECORD;
  msg jsonb;
  my_uid text := auth.uid()::text;
  my_chat_data jsonb;
  my_blocked_users jsonb;
BEGIN
  -- If not authenticated, return empty
  IF my_uid IS NULL THEN
    RETURN result;
  END IF;

  -- Fetch my own chat state to check for blocked users
  SELECT data INTO my_chat_data FROM public.profiles WHERE user_id = my_uid::uuid AND key = 'chat';
  IF my_chat_data ? 'blockedUsers' THEN
    my_blocked_users := my_chat_data->'blockedUsers';
  ELSE
    my_blocked_users := '[]'::jsonb;
  END IF;

  -- Scan chat profiles
  FOR profile_row IN SELECT user_id, data FROM public.profiles WHERE key = 'chat' LOOP
    -- If there are messages, iterate through them
    IF profile_row.data ? 'messages' AND jsonb_typeof(profile_row.data->'messages') = 'array' THEN
      FOR msg IN SELECT * FROM jsonb_array_elements(profile_row.data->'messages') LOOP
        -- Security: ensure the senderId matches the profile owner!
        IF (msg->>'receiverId') = my_uid AND (msg->>'senderId') = profile_row.user_id::text THEN
          
          -- Block Check 1: Ensure sender is NOT in my blocked_users array (I didn't block them)
          IF NOT (my_blocked_users @> to_jsonb(msg->>'senderId')) THEN
            
            -- Block Check 2: Ensure I am NOT in the sender's blockedUsers array (They didn't block me)
            -- If they blocked me, I shouldn't be able to receive their messages.
            IF NOT (profile_row.data ? 'blockedUsers' AND profile_row.data->'blockedUsers' @> to_jsonb(my_uid)) THEN

              -- Also verify the sender and receiver are actually friends
              IF EXISTS (
                SELECT 1 FROM public.friendships 
                WHERE (user_id1 = my_uid::uuid AND user_id2 = profile_row.user_id)
                   OR (user_id2 = my_uid::uuid AND user_id1 = profile_row.user_id)
              ) THEN
                result := array_append(result, msg);
              END IF;

            END IF;
          END IF;
        END IF;
      END LOOP;
    END IF;
  END LOOP;
  RETURN result;
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION get_incoming_messages() TO authenticated;
