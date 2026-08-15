import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function check() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!)

  const username = 'testuser123'
  const password = 'password123'
  
  console.log(`Reserving username ${username}...`)
  const { data: reserveData, error: reserveError } = await supabase.rpc('reserve_username', { 
    username_input: username,
    password_input: password
  })
  
  if (reserveError) {
    console.error("Reserve Error:", reserveError)
    return
  }
  
  console.log("Reserve Data:", reserveData)
  
  console.log('Testing signInWithPassword for newly created user...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
    email: reserveData.dummy_email, 
    password: password
  })
  
  if (authError) {
    console.error("Auth Error:", authError)
  } else {
    console.log("Login Successful! Auth Data:", authData.user?.id)
  }
}

check()
