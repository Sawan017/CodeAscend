-- ============================================================
-- ENFORCE IDENTITY METADATA AND FIX DUMMY EMAILS
-- ============================================================

-- 1. Fix the email sync trigger to handle both dummy email domains
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
      -- (Handles both older @internal.arinova.com and current @example.com)
      IF current_user_email LIKE 'id_%@example.com' OR current_user_email LIKE 'id_%@internal.arinova.com' THEN
        -- Check if the oauth email is already taken by another account
        IF EXISTS (SELECT 1 FROM auth.users WHERE email = oauth_email AND id != NEW.user_id) THEN
          RAISE EXCEPTION 'This email is already linked to another account.';
        ELSE
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

DROP TRIGGER IF EXISTS on_auth_identity_created ON auth.identities;
CREATE TRIGGER on_auth_identity_created
AFTER INSERT ON auth.identities
FOR EACH ROW
EXECUTE FUNCTION public.sync_email_from_identity();


-- 2. Create a BEFORE UPDATE trigger on auth.users to prevent Google from overwriting the App User ID
CREATE OR REPLACE FUNCTION public.enforce_app_metadata()
RETURNS trigger AS $$
DECLARE
  app_login_id text;
BEGIN
  -- Retrieve the permanent App User ID for this user
  SELECT login_id INTO app_login_id FROM public.user_identities WHERE user_id = NEW.id;
  
  IF app_login_id IS NOT NULL THEN
    -- Enforce that the Supabase dashboard uses the App User ID
    -- This intercepts Supabase Auth's automatic OAuth metadata merging
    NEW.raw_user_meta_data := coalesce(NEW.raw_user_meta_data, '{}'::jsonb) 
      || jsonb_build_object(
           'name', app_login_id,
           'full_name', app_login_id,
           'display_name', app_login_id
         )
      - 'avatar_url' - 'picture';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_metadata_update ON auth.users;
CREATE TRIGGER on_auth_user_metadata_update
BEFORE UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.enforce_app_metadata();


-- 3. Backfill and fix any existing accounts (Dummy Emails)
UPDATE auth.users u
SET 
  email = i.identity_data->>'email',
  email_confirmed_at = coalesce(u.email_confirmed_at, now())
FROM auth.identities i
WHERE u.id = i.user_id
AND (u.email LIKE 'id_%@example.com' OR u.email LIKE 'id_%@internal.arinova.com')
AND i.provider != 'email'
AND i.identity_data->>'email' IS NOT NULL
AND i.identity_data->>'email' != ''
AND NOT EXISTS (
    SELECT 1 FROM auth.users u2 
    WHERE u2.email = i.identity_data->>'email' 
    AND u2.id != u.id
);


-- 4. Backfill and fix any existing accounts (Hijacked Display Names)
UPDATE auth.users u
SET raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) 
    || jsonb_build_object(
         'name', ui.login_id,
         'full_name', ui.login_id,
         'display_name', ui.login_id
       )
    - 'avatar_url' - 'picture'
FROM public.user_identities ui
WHERE u.id = ui.user_id
AND (
  coalesce(raw_user_meta_data->>'name', '') != ui.login_id OR 
  coalesce(raw_user_meta_data->>'full_name', '') != ui.login_id OR 
  coalesce(raw_user_meta_data->>'display_name', '') != ui.login_id OR
  coalesce(raw_user_meta_data, '{}'::jsonb) ? 'avatar_url' OR
  coalesce(raw_user_meta_data, '{}'::jsonb) ? 'picture'
);

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
