-- Migration for Google OAuth "Complete your account" flow
CREATE OR REPLACE FUNCTION public.claim_oauth_identity(username_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  norm_name text;
  rand_disc integer;
  str_disc text;
  full_id text;
  current_uid uuid := auth.uid();
  max_attempts integer := 100;
  attempts integer := 0;
BEGIN
  IF current_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  norm_name := username_input;
  
  if not norm_name ~ '^[a-zA-Z0-9_ ]{4,12}$' then
    raise exception 'Username must be 4-12 characters (letters, numbers, underscores, spaces).';
  end if;
  
  -- Remove spaces and special characters for the normalized name
  norm_name := regexp_replace(norm_name, '[^a-zA-Z0-9_]', '', 'g');
  if length(norm_name) < 4 then
    raise exception 'Username must contain at least 4 letters/numbers.';
  end if;

  -- 1. Uniqueness / Existing check
  IF EXISTS (SELECT 1 FROM public.user_identities WHERE user_id = current_uid) THEN
    RAISE EXCEPTION 'Identity already claimed for this account.';
  END IF;

  -- 2. Loop for unique login_id
  loop
    attempts := attempts + 1;
    if attempts > max_attempts then
      raise exception 'Failed to generate a unique discriminator.';
    end if;
    
    -- Generate random 4 digit discriminator
    rand_disc := floor(random() * (9999 - 11 + 1)) + 11;
    str_disc := to_char(rand_disc, 'FM0000');
    full_id := norm_name || '#' || str_disc;
    
    -- Ensure uniqueness by checking table and attempting insert
    if not exists (select 1 from public.user_identities where login_id = full_id) then
      BEGIN
        insert into public.user_identities (
          id, user_id, username, normalized_name, user_id_number, login_id, status, role
        ) values (
          gen_random_uuid(), current_uid, username_input, norm_name, str_disc, full_id, 'ACTIVE', 'user'
        );
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        IF SQLERRM LIKE '%user_identities_user_id_key%' THEN
          RAISE EXCEPTION 'Identity already claimed for this account.';
        END IF;
        -- If login_id unique constraint failed, loop again and try new discriminator
      END;
    end if;
  end loop;

  return json_build_object(
    'login_id', full_id,
    'user_id_number', str_disc,
    'username', username_input
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_oauth_identity(text) TO authenticated;
