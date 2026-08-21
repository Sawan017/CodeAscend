-- Simulate the JSONB logic
DO $$
DECLARE
  my_chat jsonb := '{"blockedUsers": []}'::jsonb;
  p_receiver_id text := '1234';
BEGIN
  IF my_chat ? 'blockedUsers' AND my_chat->'blockedUsers' @> to_jsonb(p_receiver_id) THEN
    RAISE NOTICE 'Blocked!';
  ELSE
    RAISE NOTICE 'Not blocked!';
  END IF;
END $$;
