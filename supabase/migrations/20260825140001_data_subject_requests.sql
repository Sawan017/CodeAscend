-- ==========================================================================
-- DPDP ACT 2023 — DATA SUBJECT REQUEST TRACKING / ACCOUNTABILITY
-- ==========================================================================
-- Tracks all formal data principal requests (access, correction, erasure,
-- grievances, nomination, portability, withdrawal) for audit/accountability.
--
-- Security: RLS enforced. Users can only read/insert their own requests.
-- Admin updates (status, resolution) are handled via SECURITY DEFINER RPCs
-- or direct admin access, not through user-facing RLS policies.

CREATE TABLE IF NOT EXISTS public.data_subject_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type text NOT NULL CHECK (request_type IN (
        'access', 'correction', 'erasure', 'grievance',
        'nomination', 'portability', 'withdrawal', 'other'
    )),
    category text,
    description text,
    status text NOT NULL DEFAULT 'received' CHECK (status IN (
        'received', 'acknowledged', 'in_progress', 'resolved', 'rejected'
    )),
    acknowledged_at timestamptz,
    resolved_at timestamptz,
    resolution_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;

-- Revoke public access
REVOKE ALL ON public.data_subject_requests FROM public, anon;
GRANT SELECT, INSERT ON public.data_subject_requests TO authenticated;

-- Policies: users can read and create their own requests only
CREATE POLICY "Users can read own requests"
    ON public.data_subject_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit own requests"
    ON public.data_subject_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- NO UPDATE/DELETE policies for authenticated users.
-- These are audit records. Status changes are admin-only operations.

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dsr_user_id ON public.data_subject_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_dsr_user_type ON public.data_subject_requests(user_id, request_type);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_dsr_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_dsr_updated_at ON public.data_subject_requests;
CREATE TRIGGER tr_dsr_updated_at
BEFORE UPDATE ON public.data_subject_requests
FOR EACH ROW EXECUTE FUNCTION public.set_dsr_updated_at();
