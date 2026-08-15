import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function checkDb() {
  const { data, error } = await supabase.rpc('hello') // Just testing if we can do arbitrary RPC
}

// We need a way to see constraints. Let's create an RPC to query pg_constraint.
// Or we can just read the error directly.
