-- ============================================================
-- CHECK AUTH IDENTITIES SCHEMA
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_table_schema(t_schema text, t_name text)
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
    WHERE table_schema = t_schema AND table_name = t_name
  ) c;

  RETURN schema_info;
END;
$$;
