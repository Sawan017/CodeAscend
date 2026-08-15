import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const url = `${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/get_auth_users_schema`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': process.env.VITE_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json'
    }
  })
  
  const text = await res.text()
  console.log("Schema:", text)
}

run()
