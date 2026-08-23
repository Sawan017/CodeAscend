-- Enable RLS on support_admins
ALTER TABLE public.support_admins ENABLE ROW LEVEL SECURITY;

-- Admins can view the support_admins table
CREATE POLICY "Admins can view support_admins"
    ON public.support_admins
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.support_admins WHERE user_id = auth.uid()
        )
    );
