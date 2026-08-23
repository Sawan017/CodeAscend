-- ==========================================================================
-- FIX PERMISSIVE RLS POLICIES (IDOR & ENUMERATION FIX)
-- ==========================================================================
-- Prevents unauthorized users from reading private user data
-- which was previously exposed by "qual: true" policies.

-- 1. Create a helper function to safely check profile visibility
CREATE OR REPLACE FUNCTION is_profile_public(p_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = p_user_id 
      AND key = 'profile' 
      AND (data->>'isPublic' = 'true' OR data->>'isPublic' IS NULL)
  );
$$;

-- 2. Update 'profiles' table
DROP POLICY IF EXISTS "Everyone can view profiles" ON public.profiles;
CREATE POLICY "Users can view their own profiles and public profiles"
    ON public.profiles
    FOR SELECT
    TO public
    USING (
        auth.uid() = user_id 
        OR 
        (key = 'profile' AND is_profile_public(user_id))
    );

-- 3. Update 'progression' table
DROP POLICY IF EXISTS "Everyone can view progression" ON public.progression;
CREATE POLICY "Users can view own or public progression"
    ON public.progression
    FOR SELECT
    TO public
    USING (auth.uid() = user_id OR is_profile_public(user_id));

-- 4. Update 'goals' table
DROP POLICY IF EXISTS "Everyone can view goals" ON public.goals;
CREATE POLICY "Users can view own or public goals"
    ON public.goals
    FOR SELECT
    TO public
    USING (auth.uid() = user_id OR is_profile_public(user_id));

-- 5. Update 'projects' table
DROP POLICY IF EXISTS "Everyone can view projects" ON public.projects;
CREATE POLICY "Users can view own or public projects"
    ON public.projects
    FOR SELECT
    TO public
    USING (auth.uid() = user_id OR is_profile_public(user_id));

-- 6. Update 'skills' table
DROP POLICY IF EXISTS "Everyone can view skills" ON public.skills;
CREATE POLICY "Users can view own or public skills"
    ON public.skills
    FOR SELECT
    TO public
    USING (auth.uid() = user_id OR is_profile_public(user_id));

-- 7. Update 'achievements' table
DROP POLICY IF EXISTS "Everyone can view achievements" ON public.achievements;
CREATE POLICY "Users can view own or public achievements"
    ON public.achievements
    FOR SELECT
    TO public
    USING (auth.uid() = user_id OR is_profile_public(user_id));

-- 8. Update 'badges' table
DROP POLICY IF EXISTS "Everyone can view badges" ON public.badges;
CREATE POLICY "Users can view own or public badges"
    ON public.badges
    FOR SELECT
    TO public
    USING (auth.uid() = user_id OR is_profile_public(user_id));
