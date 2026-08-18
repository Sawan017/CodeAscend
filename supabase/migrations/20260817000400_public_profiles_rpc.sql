-- ============================================================
-- SECURE PUBLIC PROFILES RPC
-- ============================================================

-- Safely retrieves public profile fields (bypassing the strict profiles RLS)
-- without exposing sensitive data like emails or private settings.
-- Also supports optionally filtering by specific user UUIDs.

CREATE OR REPLACE FUNCTION get_public_profiles(needed_ids uuid[] DEFAULT NULL, limit_count integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar text,
  level integer,
  login_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    -- Extract public fields from the JSONB blob safely
    COALESCE((p.data->>'displayName')::text, 'Unknown Developer') as display_name,
    (p.data->>'avatar')::text as avatar,
    -- Default to level 1 if not stored or calculated elsewhere
    1 as level,
    -- Get the permanent login ID
    i.login_id::text
  FROM public.profiles p
  LEFT JOIN public.user_identities i ON p.user_id = i.user_id
  WHERE 
    p.key = 'profile'
    AND (needed_ids IS NULL OR p.user_id = ANY(needed_ids))
  LIMIT limit_count;
END;
$$;

-- Grant execution to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_public_profiles(uuid[], integer) TO authenticated, anon;
