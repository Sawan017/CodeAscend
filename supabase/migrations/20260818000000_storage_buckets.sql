-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for avatars bucket
-- 1. Allow public read access to the avatars bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- 2. Allow authenticated users to upload avatars
CREATE POLICY "Auth Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to update their own uploads
CREATE POLICY "Auth Update" 
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 4. Allow authenticated users to delete their own uploads
CREATE POLICY "Auth Delete" 
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
