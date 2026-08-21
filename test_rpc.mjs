import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: auth, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'id_ee40020f-bb0b-459f-a54a-042f675e8643@example.com', // User B from earlier
    password: 'password123'
  });
  
  if (loginErr) {
    console.log('Login failed', loginErr.message);
    return;
  }
  
  console.log('Logged in as User B');
  
  const { data, error } = await supabase.rpc('get_public_profiles', { limit_count: 5 });
  console.log('RPC Error:', error);
  console.log('Profiles length:', data?.length);
  if (data?.length) {
    console.log('Sample profile:', data[0]);
  }
}
run();
