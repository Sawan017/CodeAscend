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
