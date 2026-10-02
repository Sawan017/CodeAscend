CREATE OR REPLACE FUNCTION public.admin_override_skills_with_xp(
    p_target_user_id uuid,
    p_skills jsonb,
    p_skill_snapshot jsonb
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_progression jsonb;
    v_old_skills jsonb;
    v_old_xp int;
    v_new_xp int;
    v_xp_delta int := 0;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    -- Fetch old skills
    SELECT data INTO v_old_skills FROM public.skills WHERE user_id = p_target_user_id AND key = 'skills';
    IF v_old_skills IS NULL THEN
        v_old_skills := '[]'::jsonb;
    END IF;

    -- Calculate XP delta
    WITH new_topics AS (
        SELECT 
            skill->>'id' AS skill_id,
            subtopic->>'id' AS topic_id,
            subtopic->>'status' AS status,
            COALESCE((subtopic->>'baseXP')::int, 88) AS base_xp
        FROM jsonb_array_elements(p_skills) AS skill,
             jsonb_array_elements(COALESCE(skill->'subtopics', '[]'::jsonb)) AS subtopic
    ),
    old_topics AS (
        SELECT 
            skill->>'id' AS skill_id,
            subtopic->>'id' AS topic_id,
            subtopic->>'status' AS status
        FROM jsonb_array_elements(v_old_skills) AS skill,
             jsonb_array_elements(COALESCE(skill->'subtopics', '[]'::jsonb)) AS subtopic
    )
    SELECT COALESCE(SUM(n.base_xp), 0) INTO v_xp_delta
    FROM new_topics n
    LEFT JOIN old_topics o ON n.skill_id = o.skill_id AND n.topic_id = o.topic_id
    WHERE n.status = 'Completed' AND (o.status IS NULL OR o.status != 'Completed');

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
    v_new_xp := v_old_xp + v_xp_delta;
    
    -- Snapshot legitimate_skills if not exists
    IF p_skill_snapshot IS NOT NULL AND NOT v_progression ? 'legitimate_skills' THEN
        v_progression := jsonb_set(v_progression, '{legitimate_skills}', p_skill_snapshot);
    END IF;
    
    -- Update XP
    IF v_xp_delta > 0 THEN
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
    VALUES (auth.uid(), 'ADMIN_OVERRIDE_SKILLS', p_target_user_id, jsonb_build_object('xp_awarded', v_xp_delta));

    RETURN v_xp_delta;
END;
$$;

NOTIFY pgrst, 'reload schema';
