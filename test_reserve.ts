import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service key for RPC? Actually anon key is fine if RPC has SECURITY DEFINER. Let's try anon key first.
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing supabase env vars")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testReserve() {
  const payload = { username_input: 'test', password_input: 'password123' }
  const { data, error } = await supabase.rpc('reserve_username', payload)
  
  if (error) {
    console.error("RPC ERROR:", error)
  } else {
    console.log("RPC SUCCESS:", data)
  }
}

testReserve()
