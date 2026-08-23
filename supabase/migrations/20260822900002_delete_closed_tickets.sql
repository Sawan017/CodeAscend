-- Add strict delete policy for users to only delete their own closed tickets
DROP POLICY IF EXISTS "Users can delete their own closed tickets" ON public.support_tickets;
CREATE POLICY "Users can delete their own closed tickets" ON public.support_tickets FOR DELETE USING (
  auth.uid() = user_id AND status = 'closed'
);
