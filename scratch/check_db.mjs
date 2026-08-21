import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://tbniednyrqjjvnenyyrg.supabase.co', 'sb_publishable_AeBL55Z1T-gswtnf409INw_CV_ONHe8');

async function check() {
  const { data, error } = await supabase.rpc('get_schema');
  console.log("Error:", error);
  console.log("Data:", data);
}

check();
