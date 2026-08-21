-- ============================================================
-- SESSIONS RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_sessions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  result jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT coalesce(jsonb_agg(
    jsonb_build_object(
      'id', id,
      'created_at', created_at,
      'updated_at', updated_at,
      'user_agent', user_agent,
      'ip', ip
    )
  ), '[]'::jsonb)
  INTO result
  FROM auth.sessions
  WHERE user_id = v_uid;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_sessions() TO authenticated;
CREATE OR REPLACE FUNCTION public.revoke_my_session(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM auth.sessions 
  WHERE id = p_session_id AND user_id = v_uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.revoke_my_session(uuid) TO authenticated;
