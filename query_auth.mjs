import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if(k && v) env[k.trim()] = v.trim();
});

// Use service_role key to bypass RLS and test if we can query it
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    global: {
        headers: {
            Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`
        }
    }
});

async function run() {
  const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test_anon_auth@internal.arinova.com',
      password: 'testpassword123'
  });
  
  if (authError) {
      console.log('Signup error:', authError);
  } else {
      console.log('Signed in as authenticated user');
  }

  const { data, error } = await supabase.from('user_identities').select('*').limit(1);
  console.log('user_identities:', JSON.stringify(data, null, 2));
  if (error) console.log('error:', error);
}
run();
