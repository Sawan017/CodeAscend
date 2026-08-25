-- Allow friends to view private profiles

-- 1. Update is_profile_public to return true for friends
CREATE OR REPLACE FUNCTION is_profile_public(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_visibility text;
BEGIN
    IF auth.uid() = p_user_id THEN
        RETURN true;
    END IF;

    SELECT coalesce(data->>'profileVisibility', 'public') INTO v_visibility 
    FROM public.settings 
    WHERE user_id = p_user_id AND key = 'settings';
    
    -- Default to public if missing
    IF v_visibility IS NULL OR v_visibility = 'public' THEN
        RETURN true;
    END IF;
    
    -- If private/friends-only, check friendship
    IF auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.friendships
        WHERE (user_id1 = auth.uid() AND user_id2 = p_user_id)
           OR (user_id2 = auth.uid() AND user_id1 = p_user_id)
    ) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$;

-- 2. Update get_public_profile (singular) to allow friends
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
        -- Only check friendship if we are not the owner
        IF auth.uid() IS NULL OR (auth.uid() != p_user_id AND NOT EXISTS (
            SELECT 1 FROM public.friendships
            WHERE (user_id1 = auth.uid() AND user_id2 = p_user_id)
               OR (user_id2 = auth.uid() AND user_id1 = p_user_id)
        )) THEN
            RETURN NULL;
        END IF;
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
