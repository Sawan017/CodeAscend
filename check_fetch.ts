import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function test() {
  const url = `${process.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=password`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': process.env.VITE_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'id_c452a119-0b08-451c-9448-ec63ab5e9881@example.com',
      password: 'password123'
    })
  })
  
  const text = await res.text()
  console.log("Status:", res.status)
  console.log("Body:", text)
}

test()
