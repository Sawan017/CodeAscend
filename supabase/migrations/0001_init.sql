-- FutureMe database schema
-- This migration creates all tables and enables Row Level Security (RLS).
-- Run this in the Supabase SQL Editor (or via `supabase db push`).

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'profile',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 2. PROGRESSION
-- ============================================================
create table if not exists public.progression (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'progression',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 3. GOALS
-- ============================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'goals',
  data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 4. PROJECTS
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'projects',
  data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 5. SKILLS
-- ============================================================
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'skills',
  data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 6. ACHIEVEMENTS
-- ============================================================
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'achievements',
  data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 7. BADGES
-- ============================================================
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'badges',
  data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- 8. SETTINGS
-- ============================================================
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null default 'settings',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Phase 6
-- ============================================================
-- Enable RLS and create identical policies across all tables.
-- Each user can only SELECT/INSERT/UPDATE/DELETE rows where user_id = auth.uid().

do $$
declare
  t text;
begin
  foreach t in array array['profiles','progression','goals','projects','skills','achievements','badges','settings']
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "Users can view own %I" on public.%I;', t, t);
    execute format('create policy "Users can view own %I" on public.%I for select using (auth.uid() = user_id);', t, t);

    execute format('drop policy if exists "Users can insert own %I" on public.%I;', t, t);
    execute format('create policy "Users can insert own %I" on public.%I for insert with check (auth.uid() = user_id);', t, t);

    execute format('drop policy if exists "Users can update own %I" on public.%I;', t, t);
    execute format('create policy "Users can update own %I" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t, t);

    execute format('drop policy if exists "Users can delete own %I" on public.%I;', t, t);
    execute format('create policy "Users can delete own %I" on public.%I for delete using (auth.uid() = user_id);', t, t);
  end loop;
end $$;

-- ============================================================
-- Updated-timestamp trigger (optional but recommended)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['profiles','progression','goals','projects','skills','achievements','badges','settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();', t);
  end loop;
end $$;