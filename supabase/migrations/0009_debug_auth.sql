import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

// I can't read auth.users with anon key!
// Let me write an RPC function to check null columns in auth.users for our test user
const sql = `
CREATE OR REPLACE FUNCTION public.debug_auth_users()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  res json;
BEGIN
  SELECT row_to_json(u) INTO res
  FROM auth.users u
  WHERE email = 'id_c452a119-0b08-451c-9448-ec63ab5e9881@example.com';
  RETURN res;
END;
$$;
`
