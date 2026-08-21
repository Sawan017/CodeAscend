import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseAdmin = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('--- Creating Users ---');
  const { data: userA } = await supabaseAdmin.rpc('reserve_username', { username_input: 'usera' + Date.now().toString().slice(-4), password_input: 'password123' });
  const { data: userB } = await supabaseAdmin.rpc('reserve_username', { username_input: 'userb' + Date.now().toString().slice(-4), password_input: 'password123' });
  
  const supabaseA = createClient(supabaseUrl, supabaseKey);
  const { data: authA } = await supabaseA.auth.signInWithPassword({ email: userA.dummy_email, password: 'password123' });
  await supabaseA.from('profiles').insert({ user_id: authA.user.id, key: 'profile', data: { displayName: 'User A Name' } });
  
  const supabaseB = createClient(supabaseUrl, supabaseKey);
  const { data: authB } = await supabaseB.auth.signInWithPassword({ email: userB.dummy_email, password: 'password123' });
  await supabaseB.from('profiles').insert({ user_id: authB.user.id, key: 'profile', data: { displayName: 'User B Name' } });

  console.log('\n--- Establishing Friendship ---');
  await supabaseA.rpc('send_friend_request', { target_user_id: authB.user.id });
  await supabaseB.rpc('accept_friend_request', { target_user_id: authA.user.id });
  
  console.log('\n--- User A Sends Message ---');
  // Local chat state simulation for User A
  const msg = {
    id: 'msg-1234',
    conversationId: 'conv-1234',
    senderId: authA.user.id,
    receiverId: authB.user.id,
    content: 'Hello User B!',
    timestamp: new Date().toISOString()
  };
  
  const chatStateA = {
    messages: [msg],
    lastRead: {}
  };
  
  // App.tsx saves this to profiles under key = 'chat'
  await supabaseA.from('profiles').upsert({
    user_id: authA.user.id,
    key: 'chat',
    data: chatStateA,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id, key' });
  
  console.log('\n--- User B Fetches Incoming Messages ---');
  // fetchIncomingMessages calls the RPC
  const { data: incomingMessages, error } = await supabaseB.rpc('get_incoming_messages');
  if (error) console.error('Error:', error);
  
  console.log('Incoming messages:', incomingMessages?.length);
  if (incomingMessages?.length > 0) {
    console.log('✅ SUCCESS! Message received:', incomingMessages[0]);
  } else {
    console.log('❌ FAILED! No messages received.');
  }
}
run();
