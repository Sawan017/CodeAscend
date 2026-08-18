-- ============================================================
-- UPDATE INCOMING CHAT MESSAGES RPC TO ENFORCE BLOCKS
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
  blocked_users jsonb;
BEGIN
  -- If not authenticated, return empty
  IF my_uid IS NULL THEN
    RETURN result;
  END IF;

  -- Fetch my own chat state to check for blocked users
  SELECT data INTO my_chat_data FROM public.profiles WHERE user_id = my_uid::uuid AND key = 'chat';
  IF my_chat_data ? 'blockedUsers' THEN
    blocked_users := my_chat_data->'blockedUsers';
  ELSE
    blocked_users := '[]'::jsonb;
  END IF;

  -- Scan chat profiles
  FOR profile_row IN SELECT user_id, data FROM public.profiles WHERE key = 'chat' LOOP
    -- If there are messages, iterate through them
    IF profile_row.data ? 'messages' AND jsonb_typeof(profile_row.data->'messages') = 'array' THEN
      FOR msg IN SELECT * FROM jsonb_array_elements(profile_row.data->'messages') LOOP
        -- Security: ensure the senderId matches the profile owner!
        IF (msg->>'receiverId') = my_uid AND (msg->>'senderId') = profile_row.user_id::text THEN
          
          -- Block Check: Ensure sender is NOT in my blocked_users array
          IF NOT (blocked_users @> to_jsonb(msg->>'senderId')) THEN
            
            -- Also verify the sender and receiver are actually friends
            -- to prevent someone from sending messages to non-friends
            IF EXISTS (
              SELECT 1 FROM public.friendships 
              WHERE (user_id1 = my_uid::uuid AND user_id2 = profile_row.user_id)
                 OR (user_id2 = my_uid::uuid AND user_id1 = profile_row.user_id)
            ) THEN
              result := array_append(result, msg);
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
