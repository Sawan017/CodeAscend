-- Fix RLS policies to allow all authenticated and anonymous users to view profiles and progression data.
do $$
declare
  t text;
begin
  foreach t in array array['profiles','progression','goals','projects','skills','achievements','badges']
  loop
    -- Grant basic select access
    execute format('grant select on public.%I to anon, authenticated;', t);

    -- Drop the restrictive "own" policy
    execute format('drop policy if exists "Users can view own %I" on public.%I;', t, t);
    
    -- Ensure a public read policy exists
    execute format('drop policy if exists "Everyone can view %I" on public.%I;', t, t);
    execute format('create policy "Everyone can view %I" on public.%I for select using (true);', t, t);
  end loop;
end $$;
