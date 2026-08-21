import { createClient } from '@supabase/supabase-js'

const url = 'https://tbniednyrqjjvnenyyrg.supabase.co'
const key = 'sb_publishable_AeBL55Z1T-gswtnf409INw_CV_ONHe8'
const supabase = createClient(url, key)

async function test() {
  const { data, error } = await supabase.from('profiles').select('*').limit(5)
  console.log('Profiles data:', data)
  console.log('Error:', error)
}

test()
