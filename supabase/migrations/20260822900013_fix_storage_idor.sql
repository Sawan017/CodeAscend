-- ==========================================================================
-- STORAGE AUDIT FIXES
-- ==========================================================================
-- Fixes IDOR vulnerability in the 'avatars' storage bucket where any 
-- authenticated user could update or delete any other user's avatars.

DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;

-- Insert (User must own the file they upload)
CREATE POLICY "Auth Upload"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid() = owner
    );

-- Update (User can only update their own files)
CREATE POLICY "Auth Update"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars' 
        AND auth.uid() = owner
    );

-- Delete (User can only delete their own files)
CREATE POLICY "Auth Delete"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'avatars' 
        AND auth.uid() = owner
    );
