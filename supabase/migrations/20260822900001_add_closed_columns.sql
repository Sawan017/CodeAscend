ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS closed_at timestamptz;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS closed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Users can insert messages to own tickets" ON public.support_messages;
CREATE POLICY "Users can insert messages to own tickets" ON public.support_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_tickets 
    WHERE id = ticket_id 
      AND user_id = auth.uid() 
      AND status != 'closed'
  )
);
