-- Create admin table
CREATE TABLE IF NOT EXISTS public.support_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz not null default now()
);

-- Admin check helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.support_admins WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Self-grant for testing (in a real production app, this would be removed or restricted)
CREATE OR REPLACE FUNCTION public.grant_admin_access()
RETURNS void AS $$
BEGIN
  INSERT INTO public.support_admins (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Support Reports
CREATE TABLE IF NOT EXISTS public.support_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  description text NOT NULL,
  attachment_path text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Support Feedback
CREATE TABLE IF NOT EXISTS public.support_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type text NOT NULL,
  rating integer,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'planned', 'implemented', 'rejected')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Enable
ALTER TABLE public.support_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_feedback ENABLE ROW LEVEL SECURITY;

-- Reports RLS
CREATE POLICY "Users can insert own reports" ON public.support_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own reports" ON public.support_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all reports" ON public.support_reports FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update reports" ON public.support_reports FOR UPDATE USING (public.is_admin());

-- Feedback RLS
CREATE POLICY "Users can insert own feedback" ON public.support_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own feedback" ON public.support_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all feedback" ON public.support_feedback FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update feedback" ON public.support_feedback FOR UPDATE USING (public.is_admin());

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_support_reports_timestamp
BEFORE UPDATE ON public.support_reports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trigger_update_support_feedback_timestamp
BEFORE UPDATE ON public.support_feedback
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Support Attachments Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_attachments', 'support_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket RLS
CREATE POLICY "Users can upload attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'support_attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can view attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'support_attachments' AND public.is_admin());

CREATE POLICY "Users can view own attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'support_attachments' AND auth.uid() = owner);

