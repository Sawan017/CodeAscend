CREATE OR REPLACE FUNCTION public.get_policies(table_name text)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_agg(row_to_json(p)) FROM pg_policies p WHERE tablename = table_name;
$$;
GRANT EXECUTE ON FUNCTION public.get_policies(text) TO anon, authenticated;
