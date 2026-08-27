-- ==========================================================================
-- DPDP ACT 2023 — SECTION 14: RIGHT TO NOMINATION
-- ==========================================================================
-- Allows Data Principals to nominate a person to exercise their data rights
-- in the event of death or incapacity.
--
-- Security: RLS enforced. Users can only manage their own nominees.
-- Limit: Maximum 3 nominees per user.

CREATE TABLE IF NOT EXISTS public.user_nominees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nominee_name text NOT NULL,
    nominee_email text,
    nominee_phone text,
    nominee_relationship text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.user_nominees ENABLE ROW LEVEL SECURITY;

-- Revoke public access
REVOKE ALL ON public.user_nominees FROM public, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_nominees TO authenticated;

-- Policies: strict user_id = auth.uid() ownership
CREATE POLICY "Users can read own nominees"
    ON public.user_nominees FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nominees"
    ON public.user_nominees FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nominees"
    ON public.user_nominees FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nominees"
    ON public.user_nominees FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_nominees_user_id ON public.user_nominees(user_id);

-- Limit: max 3 active nominees per user
CREATE OR REPLACE FUNCTION public.check_nominee_limit()
RETURNS trigger AS $$
DECLARE
    v_count int;
BEGIN
    SELECT count(*) INTO v_count
    FROM public.user_nominees
    WHERE user_id = NEW.user_id AND status = 'active';

    IF v_count >= 3 THEN
        RAISE EXCEPTION 'Maximum of 3 active nominees allowed per user';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS tr_check_nominee_limit ON public.user_nominees;
CREATE TRIGGER tr_check_nominee_limit
BEFORE INSERT ON public.user_nominees
FOR EACH ROW EXECUTE FUNCTION public.check_nominee_limit();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_nominee_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_nominee_updated_at ON public.user_nominees;
CREATE TRIGGER tr_nominee_updated_at
BEFORE UPDATE ON public.user_nominees
FOR EACH ROW EXECUTE FUNCTION public.set_nominee_updated_at();
