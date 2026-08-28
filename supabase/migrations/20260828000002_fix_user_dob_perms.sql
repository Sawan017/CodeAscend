-- Fix missing table grants for user_dob
GRANT SELECT ON public.user_dob TO authenticated;

-- Ensure RLS policies explicitly apply to authenticated
DROP POLICY IF EXISTS "Users can view own DOB" ON public.user_dob;
CREATE POLICY "Users can view own DOB" ON public.user_dob 
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Add a safe RPC to check age verification status to prevent PostgREST errors from confusing the frontend
CREATE OR REPLACE FUNCTION public.is_age_verified()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.user_dob WHERE user_id = auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_age_verified() TO authenticated;

-- Ensure PostgREST cache reload
NOTIFY pgrst, 'reload schema';
