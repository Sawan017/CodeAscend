-- ============================================================
-- ARINOVA ADMIN SYSTEM MIGRATION
-- ============================================================

-- 1. Update user_identities status constraint to allow BANNED and SUSPENDED
ALTER TABLE public.user_identities DROP CONSTRAINT chk_identities_status;
ALTER TABLE public.user_identities ADD CONSTRAINT chk_identities_status 
  CHECK (status = ANY (ARRAY['RESERVED'::text, 'ACTIVE'::text, 'BANNED'::text, 'SUSPENDED'::text]));

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) not null,
  action text not null,
  target_id uuid, -- Can be a user_id or a ticket_id
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (public.is_admin());
-- System functions insert into audit logs, but admins shouldn't manually insert or delete via REST to maintain integrity.
-- However, if we do RPCs, they run as SECURITY DEFINER. If we do REST inserts, we need a policy.
-- Let's allow admins to insert for now if we use frontend REST, but RPC is better.
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (public.is_admin() AND auth.uid() = admin_id);

-- 3. Profiles RLS update (Allow admins to see and update all profiles)
-- Drop if they exist to avoid duplicate errors, but these are new policies.
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- 4. User Identities RLS update
-- Already has "Identities are viewable by everyone" for SELECT.
CREATE POLICY "Admins can update user identities" ON public.user_identities FOR UPDATE USING (public.is_admin());

-- 5. RPC for sensitive user actions (Suspend / Ban)
CREATE OR REPLACE FUNCTION public.admin_set_user_status(target_user_id uuid, new_status text, reason text)
RETURNS void AS $$
DECLARE
  v_admin_role text;
  v_target_role text;
BEGIN
  -- 1. Verify authorization
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can perform this action';
  END IF;

  -- 2. Prevent self-modification
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Action denied: Cannot modify your own status';
  END IF;

  -- 3. Prevent modifying other admins (unless we implement a strict hierarchy, for now protect admins)
  SELECT role INTO v_target_role FROM public.user_identities WHERE user_id = target_user_id;
  IF v_target_role LIKE '%admin%' THEN
    RAISE EXCEPTION 'Action denied: Cannot modify another admin account';
  END IF;

  -- 4. Update status
  UPDATE public.user_identities SET status = new_status WHERE user_id = target_user_id;

  -- 5. Write audit log
  INSERT INTO public.admin_audit_logs (admin_id, action, target_id, details)
  VALUES (
    auth.uid(), 
    'set_user_status', 
    target_user_id, 
    jsonb_build_object('new_status', new_status, 'reason', reason)
  );

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

