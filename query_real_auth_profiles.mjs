import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if(k && v) env[k.trim()] = v.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const username = 'testuser' + Math.floor(Math.random() * 10000);
  const password = 'testpassword123';
  
  const payload = { username_input: username, password_input: password };
  const { data: reserveData, error: reserveError } = await supabase.rpc('reserve_username', payload);
  
  await supabase.auth.signInWithPassword({
      email: reserveData.dummy_email,
      password: password
  });
  
  const { data: profData, error: profError } = await supabase.from('profiles').select('*').limit(1);
  console.log('profiles query error:', profError);
  console.log('profiles data:', profData);
}
run();
