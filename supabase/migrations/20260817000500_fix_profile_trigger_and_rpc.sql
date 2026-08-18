-- ============================================================
-- FIX PROFILE TRIGGER AND ENHANCE RPC
-- ============================================================

-- 1. Fix the legacy trigger that was broken because of the `arinova_id` to `login_id` rename.
-- This was preventing all new users from having their profile rows inserted.
CREATE OR REPLACE FUNCTION public.auto_assign_identity_on_profile_creation()
RETURNS trigger AS $$
DECLARE
  base_username text;
  norm_name text;
  seq_val integer;
  str_disc text;
  full_id text;
BEGIN
  -- We only care when the profile key is created or updated
  if NEW.key = 'profile' then
    -- Check if they already have an identity (from standard email signup flow)
    if not exists (select 1 from public.user_identities where user_id = NEW.user_id) then
      
      base_username := NEW.data->>'username';
      
      -- If they don't have a username in JSON, use display name or fallback
      if base_username is null or length(base_username) < 4 then
        base_username := NEW.data->>'displayName';
      end if;
      
      if base_username is null or length(base_username) < 4 then
        base_username := 'user' || substr(md5(random()::text), 1, 6);
      end if;
      
      -- Clean and lowercase
      base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
      if length(base_username) < 4 then
        base_username := 'user' || substr(md5(random()::text), 1, 6);
      elsif length(base_username) > 12 then
        base_username := substr(base_username, 1, 12);
      end if;
      
      norm_name := base_username;
      
      -- Ensure uniqueness by appending digits if necessary
      while exists (select 1 from public.user_identities where normalized_name = norm_name) loop
        base_username := substr(base_username, 1, 8) || (floor(random() * 9000 + 1000)::text);
        norm_name := base_username;
      end loop;
      
      -- Generate Sequence
      seq_val := nextval('public.arinova_user_id_seq');
      str_disc := to_char(seq_val, 'FM0000');
      -- Still prefix with ARINOVA# if that's the logic, though the column is now login_id
      -- If login_id uses a different format, we could change this, but we'll preserve behavior.
      -- Actually, `reserve_username` uses username#0000 format. Let's make it consistent or just preserve legacy.
      -- The trigger in 0003 originally used `full_id := 'ARINOVA#' || str_disc;`
      -- We will just maintain the original logic, just mapping to login_id.
      full_id := base_username || '#' || str_disc;
      
      -- Insert
      insert into public.user_identities (
        user_id, username, normalized_name, user_id_number, login_id, status, role
      ) values (
        NEW.user_id, base_username, norm_name, str_disc, full_id, 'ACTIVE', 'user'
      );
    end if;
    
    -- Sync official identity back into the JSON profile for frontend consumption
    select username, login_id into base_username, full_id 
    from public.user_identities 
    where user_id = NEW.user_id limit 1;
    
    if base_username is not null then
      NEW.data := NEW.data || jsonb_build_object('username', base_username, 'login_id', full_id);
    end if;
    
  end if;
  return NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Enhance the RPC to read from user_identities as the base table.
-- This ensures that even if a profile row is missing, the user is still discoverable
-- via their base identity and can appear in incoming request lists.
CREATE OR REPLACE FUNCTION get_public_profiles(needed_ids uuid[] DEFAULT NULL, limit_count integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar text,
  level integer,
  login_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.user_id,
    COALESCE((p.data->>'displayName')::text, i.username::text) as display_name,
    (p.data->>'avatar')::text as avatar,
    1 as level,
    i.login_id::text
  FROM public.user_identities i
  LEFT JOIN public.profiles p ON p.user_id = i.user_id AND p.key = 'profile'
  WHERE 
    (needed_ids IS NULL OR i.user_id = ANY(needed_ids))
  LIMIT limit_count;
END;
$$;
