-- ==========================================================================
-- PROJECT RATE LIMIT & ATOMIC SYNC
-- ==========================================================================

-- 1. Create a function to preview rate limits without consuming tokens
CREATE OR REPLACE FUNCTION public.preview_rate_limit(
    p_key text,
    p_limit int,
    p_cost int DEFAULT 1
) RETURNS jsonb AS $$
DECLARE
    v_record record;
    v_retry_after int;
BEGIN
    SELECT * INTO v_record FROM public.rate_limits WHERE key = p_key;
    
    IF v_record IS NOT NULL THEN
        IF v_record.reset_time < now() THEN
            -- Expired, would reset to p_cost
            IF p_cost > p_limit THEN
                RETURN jsonb_build_object('allowed', false, 'retry_after', 1);
            END IF;
        ELSE
            -- Active, would add p_cost
            IF (v_record.points + p_cost) > p_limit THEN
                v_retry_after := EXTRACT(EPOCH FROM (v_record.reset_time - now()))::int;
                IF v_retry_after < 1 THEN v_retry_after := 1; END IF;
                RETURN jsonb_build_object('allowed', false, 'retry_after', v_retry_after);
            END IF;
        END IF;
    ELSE
        IF p_cost > p_limit THEN
            RETURN jsonb_build_object('allowed', false, 'retry_after', 1);
        END IF;
    END IF;

    RETURN jsonb_build_object('allowed', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Modify check_rate_limit to accept cost and revert on failure
DROP FUNCTION IF EXISTS public.check_rate_limit(text, int, interval);

CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_key text,
    p_limit int,
    p_window_interval interval,
    p_cost int DEFAULT 1
) RETURNS int AS $$
DECLARE
    v_reset_time timestamptz;
    v_points int;
    v_retry_after int;
BEGIN
    IF p_cost <= 0 THEN
        RETURN 0;
    END IF;

    INSERT INTO public.rate_limits (key, points, reset_time)
    VALUES (p_key, p_cost, now() + p_window_interval)
    ON CONFLICT (key) DO UPDATE
    SET 
        points = CASE WHEN public.rate_limits.reset_time < now() THEN p_cost ELSE public.rate_limits.points + p_cost END,
        reset_time = CASE WHEN public.rate_limits.reset_time < now() THEN now() + p_window_interval ELSE public.rate_limits.reset_time END
    RETURNING points, reset_time INTO v_points, v_reset_time;
    
    IF v_points > p_limit THEN
        -- Revert the cost since we are atomically rejecting the operation
        UPDATE public.rate_limits 
        SET points = points - p_cost 
        WHERE key = p_key;

        v_retry_after := EXTRACT(EPOCH FROM (v_reset_time - now()))::int;
        IF v_retry_after < 1 THEN v_retry_after := 1; END IF;
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED:%', v_retry_after;
    END IF;
    
    RETURN v_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Replace the old trigger with the new array-diff trigger on public.projects
DROP TRIGGER IF EXISTS tr_project_rate_limit ON public.projects;

CREATE OR REPLACE FUNCTION public.trigger_project_array_rate_limit()
RETURNS trigger AS $$
DECLARE
    v_old_ids jsonb := '[]'::jsonb;
    v_new_ids jsonb := '[]'::jsonb;
    v_new_count int;
BEGIN
    IF NEW.key != 'projects' THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.data IS NOT NULL AND jsonb_typeof(OLD.data) = 'array' THEN
        SELECT COALESCE(jsonb_agg(elem->>'id'), '[]'::jsonb) INTO v_old_ids
        FROM jsonb_array_elements(OLD.data) AS elem;
    END IF;
    
    IF NEW.data IS NOT NULL AND jsonb_typeof(NEW.data) = 'array' THEN
        SELECT COALESCE(jsonb_agg(elem->>'id'), '[]'::jsonb) INTO v_new_ids
        FROM jsonb_array_elements(NEW.data) AS elem;
    END IF;

    -- Count elements in NEW that are not in OLD
    SELECT count(*) INTO v_new_count
    FROM jsonb_array_elements_text(v_new_ids) AS n(id)
    WHERE n.id NOT IN (SELECT jsonb_array_elements_text(v_old_ids));

    IF v_new_count > 0 THEN
        PERFORM public.check_rate_limit(
            auth.uid()::text || ':create_project',
            10,
            '1 hour'::interval,
            v_new_count
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_project_rate_limit
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.trigger_project_array_rate_limit();
