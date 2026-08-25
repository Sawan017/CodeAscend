-- Phase 1 & 4: Privacy by Default & JSONB IDOR Fix

-- 1. Redefine is_profile_public to STRICTLY require isPublic = true (Privacy by Default)
CREATE OR REPLACE FUNCTION is_profile_public(p_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = p_user_id 
      AND key = 'profile' 
      AND data->>'isPublic' = 'true'
  );
$$;

-- 2. Lock down profiles RLS to prevent raw JSONB access to non-owners
DROP POLICY IF EXISTS "Users can view their own profiles and public profiles" ON public.profiles;

CREATE POLICY "Users can view their own profiles"
    ON public.profiles
    FOR SELECT
    TO public
    USING (auth.uid() = user_id);

-- 3. Create a secure RPC for fetching a single public profile without exposing 'contact'
CREATE OR REPLACE FUNCTION get_public_profile(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN data->>'contactPublic' = 'true' THEN data
      ELSE data - 'contact'
    END
  FROM public.profiles 
  WHERE user_id = p_user_id 
    AND key = 'profile'
    AND data->>'isPublic' = 'true';
$$;

GRANT EXECUTE ON FUNCTION get_public_profile(uuid) TO public;

-- 4. Update the bulk get_public_profiles RPC to strictly require isPublic = true (Privacy by Default)
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
    AND p.data->>'isPublic' = 'true'
    AND (needed_ids IS NULL OR p.user_id = ANY(needed_ids))
  LIMIT limit_count;
END;
$$;
