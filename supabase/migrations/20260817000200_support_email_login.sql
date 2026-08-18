-- ============================================================
-- SUPPORT EMAIL LOGIN (RPC UPDATE)
-- ============================================================

CREATE OR REPLACE FUNCTION public.resolve_login_email(identifier text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  target_email text;
BEGIN
  -- 1. Try resolving using user_identities (login_id or username)
  select user_id into target_user_id 
  from public.user_identities 
  where login_id = identifier or username = identifier
  limit 1;
  
  if target_user_id is not null then
    select email into target_email from auth.users where id = target_user_id limit 1;
    return target_email;
  end if;

  -- 2. If not found, and it looks like an email, try resolving via auth.users directly
  if identifier like '%@%' then
    select id into target_user_id from auth.users where email = identifier limit 1;
    
    if target_user_id is not null then
      -- Verify the user has a permanent account (a row in user_identities)
      if exists (select 1 from public.user_identities where user_id = target_user_id) then
        return identifier; -- Returns the email itself, confirming it's valid
      end if;
    end if;
  end if;

  return null;
END;
$$;

-- Ensure execute permissions
GRANT EXECUTE ON FUNCTION public.resolve_login_email(text) TO authenticated, anon;
GRANT SELECT ON public.user_identities TO anon, authenticated;

GRANT SELECT ON public.user_identities TO anon, authenticated;
