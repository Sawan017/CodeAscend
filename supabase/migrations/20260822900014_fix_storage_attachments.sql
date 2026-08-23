-- ==========================================================================
-- STORAGE ATTACHMENTS FIX
-- ==========================================================================
-- Prevents path spoofing in support_attachments.

DROP POLICY IF EXISTS "Users can upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own attachments" ON storage.objects;

-- Insert (User must upload to their own folder)
CREATE POLICY "Users can upload attachments"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'support_attachments' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Select (User can view files in their own folder)
CREATE POLICY "Users can view own attachments"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'support_attachments' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
