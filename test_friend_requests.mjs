import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Create admin client for direct DB checks
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

async function testFriendSystem() {
  console.log('--- Setting up test users ---');
  // We'll just use the RPC to create two users
  const { data: userA } = await supabaseAdmin.rpc('reserve_username', { username_input: 'userA' + Date.now().toString().slice(-4), password_input: 'password123' });
  const { data: userB } = await supabaseAdmin.rpc('reserve_username', { username_input: 'userB' + Date.now().toString().slice(-4), password_input: 'password123' });
  
  if (!userA || !userB) {
    console.log('Failed to create test users');
    return;
  }
  
  console.log(`User A: ${userA.login_id} (dummy email: ${userA.dummy_email})`);
  console.log(`User B: ${userB.login_id} (dummy email: ${userB.dummy_email})`);
  
  // Login as User A
  const supabaseA = createClient(supabaseUrl, supabaseKey);
  const { data: authA, error: errA } = await supabaseA.auth.signInWithPassword({
    email: userA.dummy_email,
    password: 'password123'
  });
  if (errA) return console.log('User A login failed', errA.message);
  
  // Search for User B to get their auth.users.id
  const { data: searchB } = await supabaseA.rpc('search_user_by_login_id', { query_id: userB.login_id });
  const targetUserId = searchB.userId;
  
  console.log('\n--- User A sends Friend Request ---');
  const { error: sendErr } = await supabaseA.rpc('send_friend_request', { target_user_id: targetUserId });
  console.log(sendErr ? `❌ Failed: ${sendErr.message}` : `✅ Request sent to ${targetUserId}`);

  console.log('\n--- Direct DB Query ---');
  const { data: requests, error: dbErr } = await supabaseAdmin.from('friend_requests').select('*');
  console.log(dbErr ? `❌ DB Query Failed: ${dbErr.message}` : `Row in friend_requests:\n${JSON.stringify(requests.filter(r => r.sender_id === authA.user.id), null, 2)}`);

  console.log('\n--- User B logs in and runs exact UI query ---');
  const supabaseB = createClient(supabaseUrl, supabaseKey);
  await supabaseB.auth.signInWithPassword({
    email: userB.dummy_email,
    password: 'password123'
  });
  
  const userIdB = targetUserId;
  const { data: uiRequests, error: rError } = await supabaseB
    .from('friend_requests')
    .select('*')
    .or(`sender_id.eq.${userIdB},receiver_id.eq.${userIdB}`)
    .eq('status', 'pending');
    
  console.log(rError ? `❌ User B UI query failed: ${rError.message}` : `User B received ${uiRequests?.length || 0} requests:\n${JSON.stringify(uiRequests, null, 2)}`);
}

testFriendSystem();
