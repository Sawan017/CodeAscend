-- Fix service_role permissions for support tables
GRANT ALL ON public.support_tickets TO service_role;
GRANT ALL ON public.support_messages TO service_role;
GRANT ALL ON public.support_internal_notes TO service_role;
