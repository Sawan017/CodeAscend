-- 1. Create table to store Date of Birth
CREATE TABLE IF NOT EXISTS public.user_dob (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dob DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Secure it with RLS
ALTER TABLE public.user_dob ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own DOB" ON public.user_dob;
CREATE POLICY "Users can view own DOB" ON public.user_dob 
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own DOB" ON public.user_dob;
CREATE POLICY "Users can insert own DOB" ON public.user_dob 
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users cannot update DOB" ON public.user_dob;
CREATE POLICY "Users cannot update DOB" ON public.user_dob 
FOR UPDATE USING (false);

-- 3. Enforce 18+ upon insertion
CREATE OR REPLACE FUNCTION public.enforce_18_plus()
RETURNS TRIGGER AS $func
BEGIN
    IF age(CURRENT_DATE, NEW.dob) < interval '18 years' THEN
        RAISE EXCEPTION 'ARINOVA requires users to be at least 18 years old.';
    END IF;
    RETURN NEW;
END;
$func LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_enforce_18_plus ON public.user_dob;
CREATE TRIGGER tr_enforce_18_plus
BEFORE INSERT ON public.user_dob
FOR EACH ROW EXECUTE FUNCTION public.enforce_18_plus();

-- 4. Global API Gate: Require DOB for any data modification
CREATE OR REPLACE FUNCTION public.check_global_age_gate()
RETURNS TRIGGER AS $func
BEGIN
    -- Only enforce for authenticated real users
    IF auth.uid() IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public.user_dob WHERE user_id = auth.uid()) THEN
            RAISE EXCEPTION 'AGE_VERIFICATION_REQUIRED';
        END IF;
    END IF;
    RETURN NEW;
END;
$func LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Apply to all major data tables
DO $do
DECLARE
    t text;
BEGIN
    FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
             AND tablename NOT IN ('user_dob', 'auth_login_attempts', 'user_identities')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS tr_age_gate_%I ON public.%I;
            CREATE TRIGGER tr_age_gate_%I
            BEFORE INSERT OR UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION public.check_global_age_gate();
        ', t, t, t, t);
    END LOOP;
END;
$do;

-- 6. RPC to verify age (for OAuth & legacy users)
CREATE OR REPLACE FUNCTION public.verify_user_age(p_dob date)
RETURNS void AS $func
BEGIN
    IF age(CURRENT_DATE, p_dob) < interval '18 years' THEN
        RAISE EXCEPTION 'ARINOVA is restricted to users aged 18 and above.';
    END IF;
    
    INSERT INTO public.user_dob (user_id, dob)
    VALUES (auth.uid(), p_dob)
    ON CONFLICT (user_id) DO NOTHING;
END;
$func LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.verify_user_age(date) TO authenticated;

-- 7. Extract DOB from auth.users metadata on signup
CREATE OR REPLACE FUNCTION public.sync_auth_dob()
RETURNS TRIGGER AS $func
BEGIN
    IF NEW.raw_user_meta_data->>'dob' IS NOT NULL THEN
        BEGIN
            INSERT INTO public.user_dob (user_id, dob)
            VALUES (NEW.id, (NEW.raw_user_meta_data->>'dob')::date)
            ON CONFLICT (user_id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            -- If the date is invalid or under 18, the insert will fail.
            -- We don't abort the auth.user creation here because Supabase Auth doesn't handle exceptions well,
            -- but the user will be blocked from doing anything else by check_global_age_gate.
        END;
    END IF;
    RETURN NEW;
END;
$func LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_auth_dob ON auth.users;
CREATE TRIGGER tr_sync_auth_dob
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_auth_dob();
