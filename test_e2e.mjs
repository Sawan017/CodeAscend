import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseAdmin = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY); // anon key, using rpc to create users

async function run() {
  console.log('--- Creating Users ---');
  const { data: userA } = await supabaseAdmin.rpc('reserve_username', { username_input: 'usera' + Date.now().toString().slice(-4), password_input: 'password123' });
  const { data: userB } = await supabaseAdmin.rpc('reserve_username', { username_input: 'userb' + Date.now().toString().slice(-4), password_input: 'password123' });
  console.log('User A:', userA.login_id);
  console.log('User B:', userB.login_id);
  
  // Login as User A and create profile
  const supabaseA = createClient(supabaseUrl, supabaseKey);
  const { data: authA } = await supabaseA.auth.signInWithPassword({ email: userA.dummy_email, password: 'password123' });
  await supabaseA.from('profiles').insert({ user_id: authA.user.id, key: 'profile', data: { displayName: 'User A Name' } });
  
  // Login as User B and create profile
  const supabaseB = createClient(supabaseUrl, supabaseKey);
  const { data: authB } = await supabaseB.auth.signInWithPassword({ email: userB.dummy_email, password: 'password123' });
  await supabaseB.from('profiles').insert({ user_id: authB.user.id, key: 'profile', data: { displayName: 'User B Name' } });
  
  console.log('\n--- User A Sends Request to User B ---');
  await supabaseA.rpc('send_friend_request', { target_user_id: authB.user.id });
  
  console.log('\n--- User B Fetches Social Network ---');
  // First, User B fetches their social network
  const { data: networkRequests } = await supabaseB.from('friend_requests').select('*').or(`sender_id.eq.${authB.user.id},receiver_id.eq.${authB.user.id}`).eq('status', 'pending');
  const incomingIds = networkRequests.filter(r => r.receiver_id === authB.user.id).map(r => r.sender_id);
  console.log('Incoming IDs:', incomingIds);
  
  console.log('\n--- User B Fetches Public Profiles ---');
  // Then, User B fetches public profiles including incomingIds
  const { data: profiles, error: pError } = await supabaseB.rpc('get_public_profiles', { needed_ids: incomingIds, limit_count: 100 });
  console.log('Profiles returned:', profiles.length);
  const userAProfile = profiles.find(p => p.user_id === authA.user.id);
  if (userAProfile) {
    console.log('✅ SUCCESS! User A profile found:', userAProfile);
  } else {
    console.log('❌ FAILED! User A profile missing.');
  }

  console.log('\n--- User B Accepts Request ---');
  await supabaseB.rpc('accept_friend_request', { target_user_id: authA.user.id });
  
  const { data: networkB } = await supabaseB.from('friendships').select('*').or(`user1_id.eq.${authB.user.id},user2_id.eq.${authB.user.id}`);
  console.log('User B Friends:', networkB.length);

  const { data: networkA } = await supabaseA.from('friendships').select('*').or(`user1_id.eq.${authA.user.id},user2_id.eq.${authA.user.id}`);
  console.log('User A Friends:', networkA.length);
}
run();
