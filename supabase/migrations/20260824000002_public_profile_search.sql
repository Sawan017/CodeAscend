CREATE OR REPLACE FUNCTION get_public_profile_by_username(p_username text)
RETURNS jsonb
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    jsonb_build_object(
      'userId', p.user_id,
      'username', p.data->>'username',
      'displayName', COALESCE(p.data->>'displayName', 'Unknown Developer'),
      'avatar', p.data->>'avatar',
      'level', COALESCE((p.data->>'level')::numeric, 1),
      'xp', COALESCE((p.data->>'xp')::numeric, 0),
      'bio', p.data->>'bio',
      'title', p.data->>'title',
      'login_id', i.login_id
    )
  FROM public.profiles p
  LEFT JOIN public.user_identities i ON p.user_id = i.user_id
  WHERE p.key = 'profile'
    AND p.data->>'isPublic' = 'true'
    AND LOWER(p.data->>'username') = LOWER(p_username)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_public_profile_by_username(text) TO public;
