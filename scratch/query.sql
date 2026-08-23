SELECT 
    n.nspname AS schema_name, 
    p.proname AS function_name, 
    pg_get_function_identity_arguments(p.oid) AS arguments,
    p.proconfig AS config
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE p.prosecdef = true 
  AND n.nspname = 'public';
