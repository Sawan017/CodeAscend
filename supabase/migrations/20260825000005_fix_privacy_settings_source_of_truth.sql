-- Fix privacy settings source of truth

-- 1. Update is_profile_public to check settings table
CREATE OR REPLACE FUNCTION is_profile_public(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_visibility text;
BEGIN
    SELECT coalesce(data->>'profileVisibility', 'public') INTO v_visibility 
    FROM public.settings 
    WHERE user_id = p_user_id AND key = 'settings';
    
    -- Default to public if missing
    IF v_visibility IS NULL THEN
        RETURN true;
    END IF;
    
    RETURN v_visibility = 'public';
END;
$$;

-- 2. Update get_public_profile (singular) to check settings table and include settings in JSON
CREATE OR REPLACE FUNCTION get_public_profile(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_visibility text;
    v_settings jsonb;
    v_profile jsonb;
BEGIN
    SELECT data INTO v_settings 
    FROM public.settings 
    WHERE user_id = p_user_id AND key = 'settings';
    
    v_visibility := coalesce(v_settings->>'profileVisibility', 'public');
    
    IF v_visibility != 'public' THEN
        RETURN NULL;
    END IF;
    
    SELECT 
      CASE 
        WHEN data->>'contactPublic' = 'true' THEN data
        ELSE data - 'contact'
      END INTO v_profile
    FROM public.profiles 
    WHERE user_id = p_user_id AND key = 'profile';
    
    IF v_profile IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Inject privacy settings so the frontend knows what's allowed
    RETURN v_profile || jsonb_build_object('_privacySettings', coalesce(v_settings, '{}'::jsonb));
END;
$$;

-- 3. Update get_public_profiles (plural) to return profile_visibility and allow_friend_requests
DROP FUNCTION IF EXISTS get_public_profiles(uuid[], integer);

CREATE OR REPLACE FUNCTION get_public_profiles(needed_ids uuid[] DEFAULT NULL, limit_count integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar text,
  level integer,
  login_id text,
  profile_visibility text,
  allow_friend_requests boolean
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
    i.login_id::text,
    COALESCE((s.data->>'profileVisibility')::text, 'public') as profile_visibility,
    COALESCE((s.data->>'allowFriendRequests')::boolean, true) as allow_friend_requests
  FROM public.profiles p
  LEFT JOIN public.user_identities i ON p.user_id = i.user_id
  LEFT JOIN public.settings s ON s.user_id = p.user_id AND s.key = 'settings'
  WHERE 
    p.key = 'profile'
    AND (
      COALESCE((s.data->>'profileVisibility')::text, 'public') = 'public'
      OR (needed_ids IS NOT NULL AND p.user_id = ANY(needed_ids))
    )
    AND (needed_ids IS NULL OR p.user_id = ANY(needed_ids))
  LIMIT limit_count;
END;
$$;
