CREATE OR REPLACE FUNCTION public.cleanup_old_support_tickets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete tickets that have been closed for more than 90 days
  DELETE FROM public.support_tickets 
  WHERE status = 'closed' 
  AND closed_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Note: In Supabase, you can schedule this using pg_cron:
-- select cron.schedule('cleanup_tickets', '0 0 * * *', 'SELECT public.cleanup_old_support_tickets()');
