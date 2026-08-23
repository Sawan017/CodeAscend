-- 1. Upgrade Foreign Key to ON DELETE CASCADE
ALTER TABLE public.user_identities
  DROP CONSTRAINT IF EXISTS user_identities_user_id_fkey;

ALTER TABLE public.user_identities
  ADD CONSTRAINT user_identities_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 2. Enforce Strict 1-to-1 Mapping
ALTER TABLE public.user_identities
  ADD CONSTRAINT user_identities_user_id_key UNIQUE (user_id);

-- 3. Replace Trigger Function for Concurrency Safety
CREATE OR REPLACE FUNCTION public.auto_assign_identity_on_profile_creation()
RETURNS trigger AS $$
DECLARE
  base_username text;
  norm_name text;
  seq_val integer;
  str_disc text;
  full_id text;
BEGIN
  if NEW.key = 'profile' then
    if not exists (select 1 from public.user_identities where user_id = NEW.user_id) then
      
      base_username := NEW.data->>'username';
      if base_username is null or length(base_username) < 4 then
        base_username := NEW.data->>'displayName';
      end if;
      if base_username is null or length(base_username) < 4 then
        base_username := 'user' || substr(md5(random()::text), 1, 6);
      end if;
      
      base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
      if length(base_username) < 4 then
        base_username := 'user' || substr(md5(random()::text), 1, 6);
      elsif length(base_username) > 12 then
        base_username := substr(base_username, 1, 12);
      end if;
      
      norm_name := base_username;
      
      while exists (select 1 from public.user_identities where normalized_name = norm_name) loop
        base_username := substr(base_username, 1, 8) || (floor(random() * 9000 + 1000)::text);
        norm_name := base_username;
      end loop;
      
      seq_val := nextval('public.arinova_user_id_seq');
      str_disc := to_char(seq_val, 'FM0000');
      full_id := base_username || '#' || str_disc;
      
      -- SAFE CONCURRENCY: Catch unique violations from simultaneous requests
      BEGIN
        insert into public.user_identities (
          user_id, username, normalized_name, user_id_number, login_id, status, role
        ) values (
          NEW.user_id, base_username, norm_name, str_disc, full_id, 'ACTIVE', 'user'
        );
      EXCEPTION WHEN unique_violation THEN
        -- A concurrent request already created the identity. Ignore and proceed.
      END;
    end if;
    
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

-- 4. Temporary RPC to allow the E2E script to test ON DELETE CASCADE safely
CREATE OR REPLACE FUNCTION public.e2e_delete_self()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete self from auth.users (will cascade to profiles, user_identities)
  DELETE FROM auth.users WHERE id = uid;
  RETURN true;
END;
$$;
