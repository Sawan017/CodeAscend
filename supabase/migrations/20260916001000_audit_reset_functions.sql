CREATE OR REPLACE FUNCTION public.admin_reset_skills(p_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_progression_data jsonb;
    v_legit_skills jsonb;
    v_legit_xp int;
BEGIN
    IF NOT public.is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

    SELECT data INTO v_progression_data FROM public.progression WHERE user_id = p_target_user_id AND key = 'progression';
    IF v_progression_data IS NULL THEN RETURN; END IF;

    v_legit_skills := COALESCE(v_progression_data->'legitimate_skills', '[]'::jsonb);
    
    -- Restore skills
    INSERT INTO public.skills (user_id, key, data) VALUES (p_target_user_id, 'skills', v_legit_skills) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;

    -- Restore XP if snapshot exists
    IF v_progression_data ? 'legitimate_xp' THEN
        v_legit_xp := (v_progression_data->>'legitimate_xp')::int;
        v_progression_data := jsonb_set(v_progression_data, '{xp}', to_jsonb(v_legit_xp));
    END IF;

    v_progression_data := v_progression_data - 'legitimate_skills' - 'legitimate_xp';
    
    INSERT INTO public.progression (user_id, key, data) VALUES (p_target_user_id, 'progression', v_progression_data) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;

    INSERT INTO public.admin_audit_logs (admin_id, action, target_id, details)
    VALUES (auth.uid(), 'ADMIN_RESET_SKILLS', p_target_user_id, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reset_achievements(p_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_progression_data jsonb;
    v_legit_achievements jsonb;
    v_legit_badges jsonb;
    v_count int;
BEGIN
    IF NOT public.is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

    SELECT data INTO v_progression_data FROM public.progression WHERE user_id = p_target_user_id AND key = 'progression';
    IF v_progression_data IS NULL THEN RETURN; END IF;
    
    -- Fallback to empty array if corrupted/missing
    v_legit_achievements := COALESCE(v_progression_data->'legitimate_achievements', '[]'::jsonb);
    
    INSERT INTO public.achievements (user_id, key, data) VALUES (p_target_user_id, 'achievements', v_legit_achievements) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;
    
    -- Also update the count in progression
    v_count := jsonb_array_length(v_legit_achievements);
    v_progression_data := jsonb_set(v_progression_data, '{achievements}', to_jsonb(v_count));

    -- MUST ALSO FALLBACK FOR BADGES!
    v_legit_badges := COALESCE(v_progression_data->'legitimate_badges', '[]'::jsonb);
    INSERT INTO public.badges (user_id, key, data) VALUES (p_target_user_id, 'badges', v_legit_badges) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;
    
    v_progression_data := v_progression_data - 'legitimate_achievements' - 'legitimate_badges';
    INSERT INTO public.progression (user_id, key, data) VALUES (p_target_user_id, 'progression', v_progression_data) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;

    INSERT INTO public.admin_audit_logs (admin_id, action, target_id, details)
    VALUES (auth.uid(), 'ADMIN_RESET_ACHIEVEMENTS', p_target_user_id, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reset_progression(p_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_progression_data jsonb;
    v_profile_data jsonb;
BEGIN
    IF NOT public.is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;

    SELECT data INTO v_progression_data FROM public.progression WHERE user_id = p_target_user_id AND key = 'progression';
    IF v_progression_data IS NULL THEN RETURN; END IF;

    IF v_progression_data ? 'legitimate_xp' THEN
        v_progression_data := jsonb_set(v_progression_data, '{xp}', v_progression_data->'legitimate_xp');
    END IF;
    IF v_progression_data ? 'legitimate_level' THEN
        v_progression_data := jsonb_set(v_progression_data, '{level}', v_progression_data->'legitimate_level');
    END IF;

    v_progression_data := v_progression_data - 'is_god_mode' - 'legitimate_xp' - 'legitimate_level';

    INSERT INTO public.progression (user_id, key, data) VALUES (p_target_user_id, 'progression', v_progression_data) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;

    SELECT data INTO v_profile_data FROM public.profiles WHERE user_id = p_target_user_id AND key = 'profile';
    IF v_profile_data IS NOT NULL THEN
        IF v_progression_data ? 'xp' THEN v_profile_data := jsonb_set(v_profile_data, '{xp}', v_progression_data->'xp'); END IF;
        IF v_progression_data ? 'level' THEN v_profile_data := jsonb_set(v_profile_data, '{level}', v_progression_data->'level'); END IF;
        INSERT INTO public.profiles (user_id, key, data) VALUES (p_target_user_id, 'profile', v_profile_data) ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;
    END IF;

    INSERT INTO public.admin_audit_logs (admin_id, action, target_id, details)
    VALUES (auth.uid(), 'ADMIN_RESET_PROGRESSION', p_target_user_id, '{}'::jsonb);
END;
$$;

NOTIFY pgrst, 'reload schema';
