import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function check() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!)

  console.log('Testing resolve_login_email for test5#2467...')
  const { data: resolvedEmail, error: rpcError } = await supabase.rpc('resolve_login_email', { identifier: 'test5#2467' })
  
  if (rpcError) {
    console.error("RPC Error:", rpcError)
    return
  }
  
  console.log("Resolved Email:", resolvedEmail)
  
  if (!resolvedEmail) {
    console.log("No email found.")
    return
  }
  
  console.log('Testing signInWithPassword...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
    email: resolvedEmail, 
    password: 'password123' // Fake password to see if we get Invalid Credentials or Schema Error
  })
  
  if (authError) {
    console.error("Auth Error:", authError)
  } else {
    console.log("Auth Data:", authData)
  }
}

check()
