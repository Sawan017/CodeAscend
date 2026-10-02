CREATE OR REPLACE FUNCTION public.admin_override_skills_with_xp(
    p_target_user_id uuid,
    p_skills jsonb,
    p_skill_snapshot jsonb,
    p_xp_delta int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_progression jsonb;
    v_old_xp int;
    v_new_xp int;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    -- Update skills table
    INSERT INTO public.skills (user_id, key, data)
    VALUES (p_target_user_id, 'skills', p_skills)
    ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;
    
    -- Fetch progression
    SELECT data INTO v_progression FROM public.progression WHERE user_id = p_target_user_id AND key = 'progression';
    IF v_progression IS NULL THEN
        v_progression := '{}'::jsonb;
    END IF;
    
    v_old_xp := COALESCE((v_progression->>'xp')::int, 0);
    v_new_xp := v_old_xp + p_xp_delta;
    
    -- Snapshot legitimate_skills if not exists
    IF p_skill_snapshot IS NOT NULL AND NOT v_progression ? 'legitimate_skills' THEN
        v_progression := jsonb_set(v_progression, '{legitimate_skills}', p_skill_snapshot);
    END IF;
    
    -- Update XP
    IF p_xp_delta > 0 THEN
        v_progression := jsonb_set(v_progression, '{xp}', to_jsonb(v_new_xp));
        
        -- Snapshot legitimate_xp if not exists
        IF NOT v_progression ? 'legitimate_xp' THEN
            v_progression := jsonb_set(v_progression, '{legitimate_xp}', to_jsonb(v_old_xp));
        END IF;
    END IF;
    
    INSERT INTO public.progression (user_id, key, data)
    VALUES (p_target_user_id, 'progression', v_progression)
    ON CONFLICT (user_id, key) DO UPDATE SET data = EXCLUDED.data;
    
    INSERT INTO public.admin_audit_logs (admin_id, action, target_id, details)
    VALUES (auth.uid(), 'ADMIN_OVERRIDE_SKILLS', p_target_user_id, jsonb_build_object('xp_awarded', p_xp_delta));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reset_skills(p_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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
END;
$$;

NOTIFY pgrst, 'reload schema';
