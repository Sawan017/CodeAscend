import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function check() {
  const { data, error } = await supabase.rpc('resolve_login_email', { identifier: 'test#0027' })
  console.log("resolve_login_email Error:", error)
  console.log("resolve_login_email Data:", data)
}
check()
