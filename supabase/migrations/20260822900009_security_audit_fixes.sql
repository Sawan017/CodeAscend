-- ==========================================================================
-- SQL INJECTION & SECURITY AUDIT FIXES
-- ==========================================================================
-- Fixes missing search_path on SECURITY DEFINER functions to prevent
-- search path hijacking. Removes/secures test backdoors.
-- ==========================================================================

-- 1. Fix missing search_path on SECURITY DEFINER functions
ALTER FUNCTION public.debug_get_constraints() SET search_path = public;
ALTER FUNCTION public.auto_assign_identity_on_profile_creation() SET search_path = public;
ALTER FUNCTION public.sync_email_from_identity() SET search_path = public;
ALTER FUNCTION public.enforce_app_metadata() SET search_path = public;
ALTER FUNCTION public.search_user_by_login_id(text) SET search_path = public;
ALTER FUNCTION public.send_friend_request(uuid) SET search_path = public;
ALTER FUNCTION public.accept_friend_request(uuid) SET search_path = public;
ALTER FUNCTION public.reject_friend_request(uuid) SET search_path = public;
ALTER FUNCTION public.remove_friend(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_chat_group() SET search_path = public;
ALTER FUNCTION public.get_policies(text) SET search_path = public;

-- 2. Remove / secure backdoor test RPCs
-- Remove grant_admin_access (anyone could make themselves admin)
DROP FUNCTION IF EXISTS public.grant_admin_access();

-- Remove grant_official_access (anyone could make themselves an official)
DROP FUNCTION IF EXISTS public.grant_official_access();

-- Secure debug_user_state to ONLY allow authenticated admins to run it,
-- but since we don't have a strict admin check here, let's just drop it
-- as it leaks emails/auth identities to anon users.
DROP FUNCTION IF EXISTS public.debug_user_state(text);

-- Drop unused dangerous OAuth linking function (frontend uses native supabase.auth.linkIdentity)
DROP FUNCTION IF EXISTS public.link_oauth_account(uuid);
