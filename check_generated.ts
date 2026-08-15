import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function check() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!)

  // Can we fetch this via an existing RPC? No.
  // Can we use the VITE_SUPABASE_ANON_KEY to fetch anything? No.
}

check()
