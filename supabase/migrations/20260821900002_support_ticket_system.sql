-- 1. Create Officials Table
CREATE TABLE IF NOT EXISTS public.support_officials (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_online boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT false,
  last_seen timestamptz NOT NULL DEFAULT now()
);

-- 2. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  subject text,
  description text NOT NULL,
  screenshot_path text,
  priority text NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Urgent')),
  status text NOT NULL DEFAULT 'ai_assisting' CHECK (status IN ('ai_assisting', 'waiting_for_official', 'official_assigned', 'resolved', 'closed')),
  assigned_official_id uuid REFERENCES public.support_officials(user_id) ON DELETE SET NULL,
  ai_summary text,
  ai_resolution text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'ai', 'official', 'system')),
  message text NOT NULL,
  attachment_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Create Internal Notes Table
CREATE TABLE IF NOT EXISTS public.support_internal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  official_id uuid NOT NULL REFERENCES public.support_officials(user_id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Ticket Number Generation Function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_val integer;
BEGIN
  -- Simple sequential generation using a sequence
  -- (assuming low concurrency for ticket creation, or we can use a dedicated sequence)
  -- For robustness, we'll create a sequence if not exists
  -- Wait, we can't create sequence inside function easily. We will use a sequence created globally.
  -- Actually, let's just query max and add 1
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS integer)), 0) + 1
  INTO seq_val
  FROM public.support_tickets
  WHERE ticket_number LIKE 'ARI-%';
  
  NEW.ticket_number := 'ARI-' || LPAD(seq_val::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_ticket_number
BEFORE INSERT ON public.support_tickets
FOR EACH ROW
WHEN (NEW.ticket_number IS NULL)
EXECUTE FUNCTION public.generate_ticket_number();

-- 6. Updated_at Trigger
CREATE TRIGGER trigger_update_support_tickets_timestamp
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Atomic Ticket Assignment RPC
CREATE OR REPLACE FUNCTION public.take_support_ticket(p_ticket_id uuid)
RETURNS boolean AS $$
DECLARE
  v_assigned_id uuid;
BEGIN
  -- Must be an official
  IF NOT EXISTS (SELECT 1 FROM public.support_officials WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Attempt to claim the ticket
  UPDATE public.support_tickets
  SET assigned_official_id = auth.uid(),
      status = 'official_assigned',
      updated_at = now()
  WHERE id = p_ticket_id
    AND status IN ('waiting_for_official', 'ai_assisting')
    AND assigned_official_id IS NULL
  RETURNING assigned_official_id INTO v_assigned_id;

  IF v_assigned_id = auth.uid() THEN
    -- Mark official as busy
    UPDATE public.support_officials
    SET is_available = false,
        last_seen = now()
    WHERE user_id = auth.uid();
    
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_officials;

-- 9. Row Level Security

ALTER TABLE public.support_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_internal_notes ENABLE ROW LEVEL SECURITY;

-- Helper to check if user is official
CREATE OR REPLACE FUNCTION public.is_official()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.support_officials WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Officials RLS
CREATE POLICY "Public can view online officials" ON public.support_officials FOR SELECT USING (true);
CREATE POLICY "Officials can update their own status" ON public.support_officials FOR UPDATE USING (auth.uid() = user_id);
-- (Admin logic allows full access)
CREATE POLICY "Admins full access to officials" ON public.support_officials USING (public.is_admin());

-- Tickets RLS
CREATE POLICY "Users can create their own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets (limited)" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Officials can view all tickets" ON public.support_tickets FOR SELECT USING (public.is_official() OR public.is_admin());
CREATE POLICY "Officials can update all tickets" ON public.support_tickets FOR UPDATE USING (public.is_official() OR public.is_admin());

-- Messages RLS
CREATE POLICY "Users can insert messages to own tickets" ON public.support_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view messages of own tickets" ON public.support_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND user_id = auth.uid())
);
CREATE POLICY "Officials can insert messages to any ticket" ON public.support_messages FOR INSERT WITH CHECK (public.is_official() OR public.is_admin());
CREATE POLICY "Officials can view all messages" ON public.support_messages FOR SELECT USING (public.is_official() OR public.is_admin());

-- Internal Notes RLS
CREATE POLICY "Officials can view internal notes" ON public.support_internal_notes FOR SELECT USING (public.is_official() OR public.is_admin());
CREATE POLICY "Officials can insert internal notes" ON public.support_internal_notes FOR INSERT WITH CHECK (public.is_official() OR public.is_admin());
CREATE POLICY "Officials can update internal notes" ON public.support_internal_notes FOR UPDATE USING (public.is_official() OR public.is_admin());

-- Storage: support_attachments is already created from previous migration, just ensure rules are good
-- We update the policy to also allow officials to view attachments

CREATE OR REPLACE FUNCTION public.grant_official_access()
RETURNS void AS $$
BEGIN
  INSERT INTO public.support_officials (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

