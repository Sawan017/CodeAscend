CREATE OR REPLACE FUNCTION get_public_profiles(needed_ids uuid[] DEFAULT NULL, limit_count integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar text,
  level integer,
  login_id text
)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    COALESCE((p.data->>'displayName')::text, 'Unknown Developer') as display_name,
    (p.data->>'avatar')::text as avatar,
    1 as level,
    i.login_id::text
  FROM public.profiles p
  LEFT JOIN public.user_identities i ON p.user_id = i.user_id
  WHERE 
    p.key = 'profile'
    AND (
      p.data->>'isPublic' = 'true'
      OR (needed_ids IS NOT NULL AND p.user_id = ANY(needed_ids))
    )
    AND (needed_ids IS NULL OR p.user_id = ANY(needed_ids))
  LIMIT limit_count;
END;
$$;
