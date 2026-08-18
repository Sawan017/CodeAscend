-- Create external_projects table to track imported integrations idempotently
CREATE TABLE public.external_projects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    provider text not null,
    external_id text not null,
    status text not null default 'in_progress',
    xp_awarded int not null default 0,
    metadata jsonb not null default '{}'::jsonb,
    last_synced_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, provider, external_id)
);

ALTER TABLE public.external_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own external_projects" ON public.external_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own external_projects" ON public.external_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own external_projects" ON public.external_projects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own external_projects" ON public.external_projects FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.external_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
