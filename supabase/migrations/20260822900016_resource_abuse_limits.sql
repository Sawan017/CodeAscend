-- ==========================================================================
-- RESOURCE ABUSE / DOS PROTECTIONS
-- ==========================================================================
-- Adds text length constraints and storage bucket size limits.

-- 1. Profile bio limit
ALTER TABLE public.profiles ADD CONSTRAINT profiles_bio_length CHECK (length(data->>'bio') <= 1000);

-- 2. Chat messages limit
ALTER TABLE public.chat_group_messages ADD CONSTRAINT chat_msg_length CHECK (length(content) <= 2000);

-- 3. Support messages limit
ALTER TABLE public.support_messages ADD CONSTRAINT support_msg_length CHECK (length(message) <= 4000);

-- 4. Support ticket description limit
ALTER TABLE public.support_tickets ADD CONSTRAINT support_ticket_length CHECK (length(description) <= 4000);

-- 5. Update Storage bucket configurations to restrict file sizes and types
UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']::text[]
WHERE id = 'support_attachments';

UPDATE storage.buckets
SET 
  file_size_limit = 2097152, -- 2MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
WHERE id = 'avatars';
