import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tbniednyrqjjvnenyyrg.supabase.co',
  'sb_publishable_AeBL55Z1T-gswtnf409INw_CV_ONHe8'
)

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, data')
    .eq('key', 'chat')
    .limit(10)

  if (error) {
    console.error(error)
    return
  }

  console.log(JSON.stringify(data, null, 2))
}
run()
