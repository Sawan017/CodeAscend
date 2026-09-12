CREATE OR REPLACE FUNCTION public.protect_admin_identity()
RETURNS trigger AS $$
DECLARE
  v_new_username text;
  v_new_tag text;
  v_is_admin boolean;
BEGIN
  -- Extract username and tag (case-insensitive check)
  v_new_username := lower(NEW.data->>'username');
  v_new_tag := upper(NEW.data->>'tag');

  -- Check if attempting to claim admin username or ARSA tag
  IF (v_new_username = 'admin' OR v_new_tag = '#ARSA') THEN
    -- Allow if the user is already in support_admins
    SELECT EXISTS (
      SELECT 1 FROM public.support_admins WHERE user_id = NEW.user_id
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Reserved identity: You cannot claim the admin username or #ARSA tag.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ensure_admin_identity_protection ON public.profiles;
CREATE TRIGGER ensure_admin_identity_protection
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_admin_identity();
