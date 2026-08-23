-- ==========================================================================
-- RATE LIMITING SYSTEM
-- ==========================================================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
    key text PRIMARY KEY,
    points int NOT NULL DEFAULT 1,
    reset_time timestamptz NOT NULL
);

-- Enable RLS (nobody can read/write directly from frontend)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Core rate limiting logic
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_key text,
    p_limit int,
    p_window_interval interval
) RETURNS int AS $$
DECLARE
    v_reset_time timestamptz;
    v_points int;
    v_retry_after int;
BEGIN
    INSERT INTO public.rate_limits (key, points, reset_time)
    VALUES (p_key, 1, now() + p_window_interval)
    ON CONFLICT (key) DO UPDATE
    SET 
        points = CASE WHEN public.rate_limits.reset_time < now() THEN 1 ELSE public.rate_limits.points + 1 END,
        reset_time = CASE WHEN public.rate_limits.reset_time < now() THEN now() + p_window_interval ELSE public.rate_limits.reset_time END
    RETURNING points, reset_time INTO v_points, v_reset_time;
    
    IF v_points > p_limit THEN
        v_retry_after := EXTRACT(EPOCH FROM (v_reset_time - now()))::int;
        IF v_retry_after < 1 THEN v_retry_after := 1; END IF;
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED:%', v_retry_after;
    END IF;
    
    RETURN v_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for tables
CREATE OR REPLACE FUNCTION public.trigger_rate_limit() RETURNS trigger AS $$
DECLARE
    v_action text := TG_ARGV[0];
    v_limit int := TG_ARGV[1]::int;
    v_window text := TG_ARGV[2];
    v_uid uuid := auth.uid();
    v_key text;
BEGIN
    IF v_uid IS NULL THEN
        -- Fallback to IP for anon requests
        v_key := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown') || ':' || v_action;
    ELSE
        v_key := v_uid::text || ':' || v_action;
    END IF;
    
    PERFORM public.check_rate_limit(v_key, v_limit, v_window::interval);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply Triggers
-- 1. Chat spam (30 msgs / min)
DROP TRIGGER IF EXISTS tr_chat_rate_limit ON public.chat_group_messages;
CREATE TRIGGER tr_chat_rate_limit
BEFORE INSERT ON public.chat_group_messages
FOR EACH ROW EXECUTE FUNCTION public.trigger_rate_limit('chat', '30', '1 minute');

-- 2. Support tickets (3 / hour)
DROP TRIGGER IF EXISTS tr_support_ticket_rate_limit ON public.support_tickets;
CREATE TRIGGER tr_support_ticket_rate_limit
BEFORE INSERT ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.trigger_rate_limit('support_ticket', '3', '1 hour');

-- 3. Projects creation (10 / hour)
DROP TRIGGER IF EXISTS tr_project_rate_limit ON public.projects;
CREATE TRIGGER tr_project_rate_limit
BEFORE INSERT ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.trigger_rate_limit('create_project', '10', '1 hour');

-- RPC for Edge Functions to consume rate limits
CREATE OR REPLACE FUNCTION public.consume_edge_rate_limit(
    p_action text,
    p_limit int,
    p_window_seconds int
) RETURNS jsonb AS $$
DECLARE
    v_key text;
    v_uid uuid := auth.uid();
BEGIN
    IF v_uid IS NULL THEN
        v_key := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown') || ':' || p_action;
    ELSE
        v_key := v_uid::text || ':' || p_action;
    END IF;
    
    BEGIN
        PERFORM public.check_rate_limit(v_key, p_limit, (p_window_seconds || ' seconds')::interval);
        RETURN jsonb_build_object('allowed', true);
    EXCEPTION WHEN OTHERS THEN
        IF SQLERRM LIKE 'RATE_LIMIT_EXCEEDED:%' THEN
            RETURN jsonb_build_object(
                'allowed', false, 
                'retry_after', split_part(SQLERRM, ':', 2)::int
            );
        END IF;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
