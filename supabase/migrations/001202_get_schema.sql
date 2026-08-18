-- ============================================================
-- GET AUTH USERS SCHEMA MIGRATION
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_auth_users_schema()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  schema_info json;
BEGIN
  SELECT json_agg(row_to_json(c)) INTO schema_info
  FROM (
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) c;

  RETURN schema_info;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_users_schema() TO anon, authenticated, service_role;
