-- Create a temporary RPC to fetch constraints
CREATE OR REPLACE FUNCTION public.debug_get_constraints()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  res json;
BEGIN
  SELECT json_agg(row_to_json(c)) INTO res
  FROM (
    SELECT conname, contype, pg_get_constraintdef(oid) as def
    FROM pg_constraint 
    WHERE conrelid = 'public.user_identities'::regclass
  ) c;
  RETURN res;
END;
$$;
