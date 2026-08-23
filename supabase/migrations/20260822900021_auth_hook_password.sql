-- ==========================================================================
-- SUPABASE AUTH HOOK: PASSWORD VERIFICATION ATTEMPT
-- ==========================================================================

-- 1. Create table to track failed attempts
CREATE TABLE IF NOT EXISTS public.auth_login_attempts (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    failed_count int NOT NULL DEFAULT 0,
    locked_until timestamptz
);

-- Secure the table
ALTER TABLE public.auth_login_attempts ENABLE ROW LEVEL SECURITY;
-- Revoke all access from public/anon/authenticated
REVOKE ALL ON public.auth_login_attempts FROM public, anon, authenticated;
-- Grant access ONLY to supabase_auth_admin (the role executing the hook)
GRANT ALL ON public.auth_login_attempts TO supabase_auth_admin;

-- 2. Create the hook function
CREATE OR REPLACE FUNCTION public.hook_password_verification_attempt(event jsonb)
RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_is_valid boolean;
    v_failed_count int;
    v_locked_until timestamptz;
BEGIN
    v_user_id := (event->>'user_id')::uuid;
    v_is_valid := (event->>'is_valid')::boolean;

    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('decision', 'continue');
    END IF;

    -- Fetch current state
    SELECT failed_count, locked_until 
    INTO v_failed_count, v_locked_until 
    FROM public.auth_login_attempts 
    WHERE user_id = v_user_id;

    IF NOT FOUND THEN
        v_failed_count := 0;
    END IF;

    -- A. If account is currently locked
    IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
        RETURN jsonb_build_object(
            'decision', 'reject',
            'message', 'ACCOUNT_COOLDOWN'
        );
    END IF;

    -- B. Process the attempt
    IF v_is_valid THEN
        -- Success: clear history completely
        IF v_failed_count > 0 THEN
            DELETE FROM public.auth_login_attempts WHERE user_id = v_user_id;
        END IF;
        RETURN jsonb_build_object('decision', 'continue');
    ELSE
        -- Failure: increment counter
        v_failed_count := coalesce(v_failed_count, 0) + 1;
        
        -- Progressive Thresholds:
        -- 5 failures -> 5 minutes cooldown
        -- 10 failures -> 30 minutes cooldown
        -- (More than 10 continues the 30 minute rolling lockout)
        IF v_failed_count >= 10 THEN
            v_locked_until := now() + interval '30 minutes';
        ELSIF v_failed_count >= 5 THEN
            v_locked_until := now() + interval '5 minutes';
        ELSE
            v_locked_until := NULL;
        END IF;

        -- Persist the state
        INSERT INTO public.auth_login_attempts (user_id, failed_count, locked_until)
        VALUES (v_user_id, v_failed_count, v_locked_until)
        ON CONFLICT (user_id) DO UPDATE SET 
            failed_count = EXCLUDED.failed_count,
            locked_until = EXCLUDED.locked_until;

        -- If this specific failure crossed the threshold, reject immediately
        IF v_locked_until IS NOT NULL THEN
            RETURN jsonb_build_object(
                'decision', 'reject',
                'message', 'ACCOUNT_COOLDOWN'
            );
        END IF;

        -- Otherwise allow Supabase to return the normal Invalid Credentials response
        RETURN jsonb_build_object('decision', 'continue');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant execute permissions to supabase_auth_admin
REVOKE ALL ON FUNCTION public.hook_password_verification_attempt(jsonb) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hook_password_verification_attempt(jsonb) TO supabase_auth_admin;
