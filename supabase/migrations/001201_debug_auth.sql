-- ============================================================
-- DEBUG AUTH USERS SCHEMA MIGRATION
-- ============================================================

CREATE OR REPLACE FUNCTION public.debug_auth_users_schema()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  constraint_info json;
  users_info json;
BEGIN
  -- Get the constraint definition for users_phone_key
  SELECT json_agg(row_to_json(c)) INTO constraint_info
  FROM (
    SELECT conname, pg_get_constraintdef(c.oid) AS definition
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE t.relname = 'users' AND n.nspname = 'auth'
  ) c;

  -- Get a summary of the phone column values in auth.users
  SELECT json_build_object(
    'null_phones', (SELECT count(*) FROM auth.users WHERE phone IS NULL),
    'empty_phones', (SELECT count(*) FROM auth.users WHERE phone = ''),
    'null_tokens', (SELECT count(*) FROM auth.users WHERE confirmation_token IS NULL)
  ) INTO users_info;

  RETURN json_build_object(
    'constraints', constraint_info,
    'users_data', users_info
  );
END;
$$;
