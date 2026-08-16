-- ============================================================
-- 1. IDENTITIES TABLE
-- ============================================================
create table if not exists public.user_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  normalized_name text not null,
  discriminator text not null,
  full_username text not null,
  status text not null default 'RESERVED' check (status in ('RESERVED', 'ACTIVE')),
  expires_at timestamptz,
  role text not null default 'user' check (role in ('user', 'moderator', 'co_owner', 'owner', 'official', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique (full_username),
  
  check (length(display_name) >= 4 and length(display_name) <= 12),
  check (normalized_name = lower(display_name)),
  check (normalized_name ~ '^[a-z]{4,12}$'),
  check (discriminator ~ '^[0-9]{4}$'),
  check (
    discriminator::integer > 10 OR 
    role in ('moderator', 'co_owner', 'owner', 'official', 'admin')
  ),
  check (
    full_username = (normalized_name || '#' || discriminator)
  )
);

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_identities' AND column_name = 'full_username') THEN
    EXECUTE 'create index if not exists idx_user_identities_full_username on public.user_identities(full_username)';
  END IF;
END $$;
create index if not exists idx_user_identities_normalized_name on public.user_identities(normalized_name);
create index if not exists idx_user_identities_user_id on public.user_identities(user_id);

-- Enable RLS
alter table public.user_identities enable row level security;

-- Policies
drop policy if exists "Identities are viewable by everyone" on public.user_identities;
create policy "Identities are viewable by everyone" on public.user_identities for select using (true);

-- Insert/Update are NOT allowed directly by users to enforce strict constraints.
-- All writes must go through the SECURITY DEFINER RPC functions.

-- Updated at trigger
drop trigger if exists set_updated_at on public.user_identities;
create trigger set_updated_at before update on public.user_identities for each row execute function public.set_updated_at();

-- ============================================================
-- 2. SECURE RPC FUNCTIONS
-- ============================================================

-- Function to reserve a username
create or replace function public.reserve_username(display_name_input text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  norm_name text;
  rand_disc integer;
  str_disc text;
  full_user text;
  new_id uuid;
  max_attempts integer := 100;
  attempts integer := 0;
begin
  norm_name := lower(display_name_input);
  
  -- Basic validation
  if not norm_name ~ '^[a-z]{4,12}$' then
    raise exception 'Name must be 4-12 letters only.';
  end if;
  
  -- Clean up expired reservations first (optional but good for freeing space)
  delete from public.user_identities where status = 'RESERVED' and expires_at < now();
  
  loop
    attempts := attempts + 1;
    if attempts > max_attempts then
      raise exception 'Failed to generate a unique discriminator after % attempts.', max_attempts;
    end if;
    
    -- Generate random discriminator strictly between 0011 and 9999
    rand_disc := floor(random() * (9999 - 11 + 1)) + 11;
    str_disc := to_char(rand_disc, 'FM0000');
    full_user := norm_name || '#' || str_disc;
    
    begin
      insert into public.user_identities (
        display_name, normalized_name, discriminator, full_username, status, expires_at, role
      ) values (
        display_name_input, norm_name, str_disc, full_user, 'RESERVED', now() + interval '15 minutes', 'user'
      ) returning id into new_id;
      
      -- If successful, break out of loop
      exit;
    exception when unique_violation then
      -- Loop again if it collides
    end;
  end loop;
  
  return json_build_object(
    'id', new_id,
    'full_username', full_user,
    'discriminator', str_disc,
    'display_name', display_name_input,
    'expires_at', now() + interval '15 minutes'
  );
end;
$$;


-- Function to confirm a reservation (linking it to an auth user)
create or replace function public.confirm_username(identity_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  res public.user_identities;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  
  select * into res from public.user_identities where id = identity_id and status = 'RESERVED';
  
  if res is null then
    raise exception 'Reservation not found or already active';
  end if;
  
  if res.expires_at < now() then
    -- Delete the expired reservation so someone else can claim it
    delete from public.user_identities where id = identity_id;
    raise exception 'Reservation expired';
  end if;
  
  update public.user_identities 
  set user_id = uid, status = 'ACTIVE', expires_at = null 
  where id = identity_id;
  
  return true;
end;
$$;


-- Admin function to explicitly assign a reserved code/identity
-- This is strictly checked (in a real prod app, you might check if caller has admin role)
-- For this prototype, we'll assume it's only called via Supabase Dashboard/Service Role Key.
create or replace function public.admin_assign_reserved_identity(
  user_id_input uuid,
  display_name_input text,
  discriminator_input text,
  role_input text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  norm_name text;
  full_user text;
begin
  -- Validate discriminator length and role
  if not discriminator_input ~ '^[0-9]{4}$' then
    raise exception 'Discriminator must be 4 digits';
  end if;
  
  if role_input not in ('moderator', 'co_owner', 'owner', 'official', 'admin') then
    raise exception 'Role must be privileged for admin assignment';
  end if;
  
  norm_name := lower(display_name_input);
  full_user := norm_name || '#' || discriminator_input;
  
  insert into public.user_identities (
    user_id, display_name, normalized_name, discriminator, full_username, status, expires_at, role
  ) values (
    user_id_input, display_name_input, norm_name, discriminator_input, full_user, 'ACTIVE', null, role_input
  );
  
  return true;
end;
$$;

-- Function to cleanup expired manually
create or replace function public.cleanup_expired_reservations()
returns integer
language plpgsql
security definer
as $$
declare
  deleted_count integer;
begin
  with deleted as (
    delete from public.user_identities 
    where status = 'RESERVED' and expires_at < now()
    returning id
  )
  select count(*) into deleted_count from deleted;
  
  return deleted_count;
end;
$$;
