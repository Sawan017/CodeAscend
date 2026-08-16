-- ============================================================
-- 1. IDENTITIES TABLE
-- ============================================================

-- Disable function body checking to prevent crashes during replay when 
-- obsolete columns like arinova_id are referenced in these historical functions.
SET check_function_bodies = off;

CREATE TABLE IF NOT EXISTS public.user_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  username text not null,
  normalized_name text not null,
  user_id_number text not null,
  arinova_id text not null,
  status text not null default 'RESERVED',
  expires_at timestamptz,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique (arinova_id),
  unique (normalized_name)
);

-- Safely remove any existing CHECK constraints (including auto-named ones from older migrations)
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (
    SELECT conname 
    FROM pg_constraint 
    WHERE conrelid = 'public.user_identities'::regclass AND contype = 'c'
  ) LOOP
    EXECUTE 'ALTER TABLE public.user_identities DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

-- Update any existing data to match the new strict case-sensitive architecture
UPDATE public.user_identities SET normalized_name = username;

-- Apply explicitly named constraints to guarantee the correct rules
ALTER TABLE public.user_identities
  ADD CONSTRAINT chk_identities_status check (status in ('RESERVED', 'ACTIVE')),
  ADD CONSTRAINT chk_identities_role check (role in ('user', 'moderator', 'co_owner', 'owner', 'official', 'admin')),
  ADD CONSTRAINT chk_identities_username_len check (length(username) >= 4 and length(username) <= 12),
  ADD CONSTRAINT chk_identities_normalized_match check (normalized_name = username),
  ADD CONSTRAINT chk_identities_normalized_fmt check (normalized_name ~ '^[a-zA-Z0-9_]{4,12}$'),
  ADD CONSTRAINT chk_identities_id_fmt check (user_id_number ~ '^[0-9]{4}$'),
  ADD CONSTRAINT chk_identities_id_range check (
    user_id_number::integer > 10 OR 
    role in ('moderator', 'co_owner', 'owner', 'official', 'admin')
  );

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'arinova_id') THEN
    EXECUTE 'ALTER TABLE public.user_identities ADD CONSTRAINT chk_identities_arinova_id check (arinova_id = (''ARINOVA#'' || user_id_number))';
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'arinova_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_user_identities_arinova_id on public.user_identities(arinova_id)';
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_user_identities_normalized_name on public.user_identities(normalized_name);
CREATE INDEX IF NOT EXISTS idx_user_identities_user_id on public.user_identities(user_id);

ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Identities are viewable by everyone" on public.user_identities for select using (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- ============================================================
-- 2. CREATE SEQUENCE & MIGRATE EXISTING USERS
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.arinova_user_id_seq START WITH 11;

DO $$ 
DECLARE
  target_col text;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'arinova_id') THEN
    target_col := 'arinova_id';
  ELSE
    target_col := 'login_id';
  END IF;

  EXECUTE format('
    INSERT INTO public.user_identities (user_id, username, normalized_name, user_id_number, %I, status, role)
    WITH new_users AS (
      SELECT 
        p.user_id,
        (p.data->>''username'') as username,
        (p.data->>''arinova_id'') as orig_arinova_id
      FROM public.profiles p
      WHERE p.key = ''profile'' 
        AND p.data->>''username'' IS NOT NULL
        AND (p.data->>''username'') ~ ''^[a-zA-Z0-9_]{4,12}$''
        AND NOT EXISTS (
          SELECT 1 FROM public.user_identities u WHERE u.user_id = p.user_id
        )
    ),
    assigned_ids AS (
      SELECT 
        user_id,
        username,
        CASE 
          WHEN orig_arinova_id IS NOT NULL AND orig_arinova_id ~ ''#[0-9]{4}$'' THEN
            substring(orig_arinova_id from ''#([0-9]{4})$'')
          ELSE
            to_char(nextval(''public.arinova_user_id_seq''), ''FM0000'')
        END as user_id_number
      FROM new_users
    )
    SELECT 
      user_id,
      username,
      username as normalized_name,
      user_id_number,
      ''ARINOVA#'' || user_id_number as mapped_id,
      ''ACTIVE'' as status,
      ''user'' as role
    FROM assigned_ids;
  ', target_col);
END $$;


-- ============================================================
-- 3. REWRITE RPC FUNCTIONS
-- ============================================================

-- Reserve Username
DROP FUNCTION IF EXISTS public.reserve_username(text);
DROP FUNCTION IF EXISTS public.reserve_username(text, uuid);

CREATE OR REPLACE FUNCTION public.reserve_username(username_input text, auth_user_id uuid DEFAULT null)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  norm_name text;
  rand_disc integer;
  str_disc text;
  full_id text;
  new_id uuid;
BEGIN
  norm_name := username_input;
  
  -- Validation
  if not norm_name ~ '^[a-zA-Z0-9_]{4,12}$' then
    raise exception 'Username must be 4-12 characters.';
  end if;
  
  -- Clean up expired reservations
  delete from public.user_identities where status = 'RESERVED' and expires_at < now();
  
  -- Check if username is already taken
  if exists (select 1 from public.user_identities where normalized_name = norm_name) then
    raise exception 'Username is already taken.';
  end if;
  
  -- Generate next sequence
  rand_disc := nextval('public.arinova_user_id_seq');
  
  if rand_disc > 9999 then
    raise exception 'User ID sequence exhausted.';
  end if;
  
  str_disc := to_char(rand_disc, 'FM0000');
  full_id := 'ARINOVA#' || str_disc;
  
  insert into public.user_identities (
    user_id, username, normalized_name, user_id_number, arinova_id, status, expires_at, role
  ) values (
    auth_user_id, username_input, norm_name, str_disc, full_id, 'RESERVED', now() + interval '15 minutes', 'user'
  ) returning id into new_id;
  
  return json_build_object(
    'id', new_id,
    'arinova_id', full_id,
    'user_id_number', str_disc,
    'username', username_input,
    'expires_at', now() + interval '15 minutes'
  );
END;
$$;


-- Admin Assign Reserved Identity
DROP FUNCTION IF EXISTS public.admin_assign_reserved_identity;
CREATE OR REPLACE FUNCTION public.admin_assign_reserved_identity(
  user_id_input uuid,
  username_input text,
  user_id_number_input text,
  role_input text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  norm_name text;
  full_id text;
BEGIN
  if not user_id_number_input ~ '^[0-9]{4}$' then
    raise exception 'User ID number must be 4 digits';
  end if;
  
  if role_input not in ('moderator', 'co_owner', 'owner', 'official', 'admin') then
    raise exception 'Role must be privileged for admin assignment';
  end if;
  
  norm_name := lower(username_input);
  
  if exists (select 1 from public.user_identities where normalized_name = norm_name) then
    raise exception 'Username is already taken.';
  end if;

  full_id := 'ARINOVA#' || user_id_number_input;
  
  insert into public.user_identities (
    user_id, username, normalized_name, user_id_number, arinova_id, status, expires_at, role
  ) values (
    user_id_input, username_input, norm_name, user_id_number_input, full_id, 'ACTIVE', null, role_input
  );
  
  return true;
END;
$$;


-- Confirm Username
CREATE OR REPLACE FUNCTION public.confirm_username(identity_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  update public.user_identities
  set status = 'ACTIVE', expires_at = null
  where id = identity_id and status = 'RESERVED';
  
  return found;
END;
$$;


-- Resolve Login Email
CREATE OR REPLACE FUNCTION public.resolve_login_email(identifier text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  target_user_id uuid;
  target_email text;
BEGIN
  -- Find the user_id from user_identities (identifier is either username or ARINOVA#XXXX)
  select user_id into target_user_id 
  from public.user_identities 
  where username = identifier 
     or arinova_id = identifier
  limit 1;
     
  if target_user_id is null then
    return null; 
  end if;
  
  -- Query the private auth.users table using the SECURITY DEFINER context
  select email into target_email
  from auth.users 
  where id = target_user_id;
  
  return target_email;
END;
$$;


-- ============================================================
-- 4. GOOGLE AUTH & FALLBACK AUTO-ASSIGNMENT TRIGGER
-- ============================================================
-- If a user signs up via Google OAuth, they never go through `reserve_username`.
-- This trigger listens for their profile creation and safely auto-assigns an identity if they don't have one.
-- It also synchronizes the official username/arinova_id back into the profiles JSON for frontend use.
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
      full_id := 'ARINOVA#' || str_disc;
      
      -- Insert
      insert into public.user_identities (
        user_id, username, normalized_name, user_id_number, arinova_id, status, role
      ) values (
        NEW.user_id, base_username, norm_name, str_disc, full_id, 'ACTIVE', 'user'
      );
    end if;
    
    -- Sync official identity back into the JSON profile for frontend consumption
    select username, arinova_id into base_username, full_id 
    from public.user_identities 
    where user_id = NEW.user_id limit 1;
    
    if base_username is not null then
      NEW.data := NEW.data || jsonb_build_object('username', base_username, 'arinova_id', full_id);
    end if;
    
  end if;
  return NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_assign_identity ON public.profiles;
CREATE TRIGGER trigger_auto_assign_identity
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_identity_on_profile_creation();

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';