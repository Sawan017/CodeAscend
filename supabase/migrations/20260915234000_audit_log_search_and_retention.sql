-- Create a function for the scheduled cleanup
CREATE OR REPLACE FUNCTION public.cleanup_expired_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_audit_logs 
  WHERE created_at < NOW() - INTERVAL '10 days';
END;
$$;

-- Secure the cleanup function so it cannot be triggered via public REST endpoints
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_audit_logs() FROM public, anon, authenticated;

-- Attempt to schedule via pg_cron if available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('cleanup-expired-audit-logs', '0 0 * * *', 'SELECT public.cleanup_expired_audit_logs()');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If pg_cron is not accessible or another error occurs, ignore gracefully.
    NULL;
END $$;

-- Create an RPC to search audit logs with profile join
CREATE OR REPLACE FUNCTION public.admin_search_audit_logs(
    p_search_query text,
    p_limit int DEFAULT 100
)
RETURNS TABLE (
    id uuid,
    admin_id uuid,
    action text,
    target_id uuid,
    details jsonb,
    created_at timestamptz,
    admin_username text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    RETURN QUERY
    SELECT 
        l.id,
        l.admin_id,
        l.action,
        l.target_id,
        l.details,
        l.created_at,
        COALESCE(p.data->>'username', '') AS admin_username
    FROM public.admin_audit_logs l
    LEFT JOIN public.profiles p ON p.user_id = l.admin_id AND p.key = 'profile'
    WHERE 
        p_search_query = '' OR p_search_query IS NULL
        OR l.admin_id::text ILIKE '%' || p_search_query || '%'
        OR l.target_id::text ILIKE '%' || p_search_query || '%'
        OR l.action ILIKE '%' || p_search_query || '%'
        OR l.details::text ILIKE '%' || p_search_query || '%'
        OR (p.data->>'username') ILIKE '%' || p_search_query || '%'
        OR l.created_at::text ILIKE '%' || p_search_query || '%'
    ORDER BY l.created_at DESC
    LIMIT p_limit;
END;
$$;

NOTIFY pgrst, 'reload schema';
