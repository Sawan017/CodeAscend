-- Drop the legacy vulnerable resolve_login_email RPC to prevent email enumeration
DROP FUNCTION IF EXISTS public.resolve_login_email(text);
