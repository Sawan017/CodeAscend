import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function check() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL as string, process.env.VITE_SUPABASE_ANON_KEY as string)

  const email = `test${Date.now()}@example.com`
  console.log(`Testing standard signUp with ${email}...`)
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123'
  })
  
  if (error) {
    console.error("SignUp Error:", error)
    return
  }
  
  console.log("SignUp Data:", data.user?.id)
}

check()
