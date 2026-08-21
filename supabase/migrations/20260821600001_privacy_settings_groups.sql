CREATE OR REPLACE FUNCTION public.create_chat_group(
    p_name text,
    p_description text DEFAULT NULL,
    p_avatar text DEFAULT NULL,
    p_members uuid[] DEFAULT '{}'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_group_id uuid;
    v_creator_id uuid;
    v_member_id uuid;
    target_settings jsonb;
BEGIN
    -- 1. Validate authenticated user
    v_creator_id := auth.uid();
    IF v_creator_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1.5. Validate privacy settings of added members
    IF array_length(p_members, 1) > 0 THEN
        FOREACH v_member_id IN ARRAY p_members
        LOOP
            IF v_member_id != v_creator_id THEN
                SELECT data INTO target_settings FROM public.profiles WHERE user_id = v_member_id AND key = 'settings';
                IF target_settings IS NOT NULL AND target_settings->>'allowMessages' = 'false' THEN
                    RAISE EXCEPTION 'One or more users do not accept new messages.';
                END IF;
            END IF;
        END LOOP;
    END IF;

    -- 2. Insert the group
    INSERT INTO public.chat_groups (name, description, avatar, created_by)
    VALUES (p_name, p_description, p_avatar, v_creator_id)
    RETURNING id INTO v_group_id;

    IF NOT EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = v_group_id AND user_id = v_creator_id) THEN
        INSERT INTO public.chat_group_members (group_id, user_id, role)
        VALUES (v_group_id, v_creator_id, 'owner');
    END IF;

    -- 4. Add additional members
    IF array_length(p_members, 1) > 0 THEN
        FOREACH v_member_id IN ARRAY p_members
        LOOP
            IF v_member_id != v_creator_id THEN
                INSERT INTO public.chat_group_members (group_id, user_id, role)
                VALUES (v_group_id, v_member_id, 'member')
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END IF;

    -- 5. Return the created group as JSON
    RETURN (
        SELECT row_to_json(g) 
        FROM public.chat_groups g 
        WHERE g.id = v_group_id
    );
END;
$$;
