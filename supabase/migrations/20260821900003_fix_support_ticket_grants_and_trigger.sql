-- Fix Support System Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_officials TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_internal_notes TO authenticated;

-- Fix the ticket number generation trigger to bypass RLS
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_val integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS integer)), 0) + 1
  INTO seq_val
  FROM public.support_tickets
  WHERE ticket_number LIKE 'ARI-%';
  
  NEW.ticket_number := 'ARI-' || LPAD(seq_val::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
