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
  // 1. Create a user using atomic signup
  const username = 'testuser' + Math.floor(Math.random() * 10000);
  const password = 'testpassword123';
  
  const payload = { username_input: username, password_input: password };
  const { data: reserveData, error: reserveError } = await supabase.rpc('reserve_username', payload);
  
  if (reserveError) {
      console.log('reserveError:', reserveError);
      return;
  }
  
  console.log('Created user:', reserveData);
  
  // 2. Sign in with the dummy email and password to get a real session
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: reserveData.dummy_email,
      password: password
  });
  
  if (authError) {
      console.log('Auth Error:', authError);
      return;
  }
  
  console.log('Session is:', authData?.session ? 'VALID' : 'NULL');
  
  // 3. Query user_identities as authenticated user
  const { data: identData, error: identError } = await supabase.from('user_identities').select('*').limit(1);
  console.log('user_identities query error:', identError);
  console.log('user_identities data:', identData);
}
run();
