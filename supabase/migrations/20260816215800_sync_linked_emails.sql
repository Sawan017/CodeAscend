-- ============================================================
-- SYNC LINKED OAUTH EMAILS MIGRATION
-- ============================================================

-- 1. Create a trigger function to sync the email from auth.identities to auth.users
CREATE OR REPLACE FUNCTION public.sync_email_from_identity()
RETURNS trigger AS $$
DECLARE
  oauth_email text;
  current_user_email text;
BEGIN
  -- Only proceed for external OAuth providers where an email is provided
  IF NEW.provider != 'email' THEN
    oauth_email := NEW.identity_data->>'email';
    
    IF oauth_email IS NOT NULL AND oauth_email != '' THEN
      -- Get the parent user's current email
      SELECT email INTO current_user_email FROM auth.users WHERE id = NEW.user_id;
      
      -- Only update if the current email is an internally generated dummy email
      -- (This prevents overwriting a legitimate email if they linked a second OAuth account)
      IF current_user_email LIKE 'id_%@example.com' THEN
        -- Check if the oauth email is already taken by another account
        -- GoTrue usually prevents this, but it's safe to check to prevent unique constraint violations
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = oauth_email AND id != NEW.user_id) THEN
          UPDATE auth.users 
          SET 
            email = oauth_email, 
            email_confirmed_at = coalesce(email_confirmed_at, now()) 
          WHERE id = NEW.user_id;
        END IF;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to auth.identities
DROP TRIGGER IF EXISTS on_auth_identity_created ON auth.identities;
CREATE TRIGGER on_auth_identity_created
AFTER INSERT ON auth.identities
FOR EACH ROW
EXECUTE FUNCTION public.sync_email_from_identity();


-- 3. Backfill any existing accounts that were successfully linked but still have the dummy email
UPDATE auth.users u
SET 
  email = i.identity_data->>'email',
  email_confirmed_at = coalesce(u.email_confirmed_at, now())
FROM auth.identities i
WHERE u.id = i.user_id
AND u.email LIKE 'id_%@example.com'
AND i.provider != 'email'
AND i.identity_data->>'email' IS NOT NULL
AND i.identity_data->>'email' != ''
AND NOT EXISTS (
    SELECT 1 FROM auth.users u2 
    WHERE u2.email = i.identity_data->>'email' 
    AND u2.id != u.id
);

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
