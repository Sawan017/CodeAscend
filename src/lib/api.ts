import type { Achievement, Badge, ChatState, FriendState, Goal, Progression, Project, Settings, Skill, UserProfile } from '../types'
import { isSupabaseConfigured, supabase } from './supabase'

/**
 * All tables follow the pattern: (user_id, data JSONB).
 * Each row is a single document per user, keyed by the data collection name.
 */

const TABLES = {
  profile: 'profiles',
  progression: 'progression',
  goals: 'goals',
  projects: 'projects',
  skills: 'skills',
  achievements: 'achievements',
  badges: 'badges',
  settings: 'settings',
} as const

type TableName = typeof TABLES[keyof typeof TABLES]

async function upsertRow(table: TableName, userId: string, key: string, data: unknown) {
  if (!isSupabaseConfigured() || !supabase) return false
  const { error } = await supabase
    .from(table)
    .upsert({ user_id: userId, key, data }, { onConflict: 'user_id,key' })
  if (error) {
    console.error(`Supabase upsert failed for ${table}/${key}:`, error.message)
    return false
  }
  return true
}

async function fetchRow<T>(table: TableName, userId: string, key: string): Promise<T | null> {
  if (!isSupabaseConfigured() || !supabase) return null
  const { data, error } = await supabase
    .from(table)
    .select('data')
    .eq('user_id', userId)
    .eq('key', key)
    .maybeSingle()
  if (error) {
    console.error(`Supabase fetch failed for ${table}/${key}:`, error.message)
    return null
  }
  return (data?.data as T) ?? null
}

export async function fetchAllUserData(userId: string) {
  if (!isSupabaseConfigured()) return null

  const [profile, progression, goals, projects, skills, achievements, badges, settings, friends, chat] = await Promise.all([
    fetchRow<UserProfile>(TABLES.profile, userId, 'profile'),
    fetchRow<Progression>(TABLES.progression, userId, 'progression'),
    fetchRow<Goal[]>(TABLES.goals, userId, 'goals'),
    fetchRow<Project[]>(TABLES.projects, userId, 'projects'),
    fetchRow<Skill[]>(TABLES.skills, userId, 'skills'),
    fetchRow<Achievement[]>(TABLES.achievements, userId, 'achievements'),
    fetchRow<Badge[]>(TABLES.badges, userId, 'badges'),
    fetchRow<Settings>(TABLES.settings, userId, 'settings'),
    fetchRow<FriendState>(TABLES.profile, userId, 'friends'),
    fetchRow<ChatState>(TABLES.profile, userId, 'chat'),
  ])

  return { profile, progression, goals, projects, skills, achievements, badges, settings, friends, chat }
}

export async function saveProfile(userId: string, profile: UserProfile) {
  return upsertRow(TABLES.profile, userId, 'profile', profile)
}

export async function saveFriendsState(userId: string, state: FriendState) {
  return upsertRow(TABLES.profile, userId, 'friends', state)
}

export async function saveProgressionData(userId: string, progression: Progression) {
  return upsertRow(TABLES.progression, userId, 'progression', progression)
}

export async function saveGoals(userId: string, goals: Goal[]) {
  return upsertRow(TABLES.goals, userId, 'goals', goals)
}

export async function saveProjects(userId: string, projects: Project[]) {
  return upsertRow(TABLES.projects, userId, 'projects', projects)
}

export async function saveSkills(userId: string, skills: Skill[]) {
  return upsertRow(TABLES.skills, userId, 'skills', skills)
}

export async function saveAchievements(userId: string, achievements: Achievement[]) {
  return upsertRow(TABLES.achievements, userId, 'achievements', achievements)
}

export async function saveBadges(userId: string, badges: Badge[]) {
  return upsertRow(TABLES.badges, userId, 'badges', badges)
}

export async function saveSettings(userId: string, settings: Settings) {
  return upsertRow(TABLES.settings, userId, 'settings', settings)
}



/**
 * Fetch all public profiles for user discovery.
 * Returns array of public profile data.
 */
export async function fetchPublicProfiles(neededIds?: string[]): Promise<Array<{ userId: string; username: string; displayName: string; avatar?: string; level: number; login_id?: string }>> {
  if (!isSupabaseConfigured() || !supabase) return []

  const { data: profiles, error: pError } = await supabase
    .rpc('get_public_profiles', { 
      needed_ids: neededIds?.length ? neededIds : null,
      limit_count: 100 
    })

  if (pError) {
    console.error('Failed to fetch public profiles:', pError.message)
    return []
  }

  return profiles?.map((row: any) => ({
    userId: row.user_id,
    username: row.display_name || 'Unknown',
    displayName: row.display_name || 'Unknown',
    avatar: row.avatar,
    level: row.level || 1,
    login_id: row.login_id
  })) || []
}

/**
 * Fetch a specific user's public profile by username.
 */
export async function fetchPublicProfileByUsername(username: string): Promise<{ userId: string; username: string; displayName: string; avatar?: string; level: number; xp: number; bio?: string; title?: string } | null> {
  if (!isSupabaseConfigured() || !supabase) return null

  const { data, error } = await supabase
    .from(TABLES.profile)
    .select('user_id, data')
    .limit(100)

  if (error) {
    console.error('Failed to fetch profile:', error.message)
    return null
  }

  const profile = data?.find((row) => {
    const profileData = row.data as UserProfile
    return profileData.username?.toLowerCase() === username.toLowerCase()
  })

  if (!profile) return null

  const profileData = profile.data as UserProfile
  return {
    userId: profile.user_id,
    username: profileData.username,
    displayName: profileData.displayName,
    avatar: profileData.avatar,
    level: profileData.level || 1,
    xp: profileData.xp || 0,
    bio: profileData.bio,
    title: profileData.title,
  }
}

export async function fetchIncomingFriendRequests(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !supabase) return []

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, data")
    .eq("key", "friends")

  if (error) {
    console.error("Failed to fetch incoming requests:", error.message)
    return []
  }

  const incomingRequests: string[] = []
  for (const row of data || []) {
    const friendData = row.data as import("../types").FriendState
    if (friendData && friendData.relationships) {
      const hasOutgoing = friendData.relationships.find(
        (r) => r.userId === userId && r.status === "pending_outgoing"
      )
      if (hasOutgoing) {
        incomingRequests.push(row.user_id)
      }
    }
  }

  return incomingRequests
}


export async function saveChatState(userId: string, state: import("../types").ChatState) {
  const stateToSave = {
    ...state,
    messages: (state.messages || []).filter(m => !m.isFailed)
  }
  return upsertRow("profiles", userId, "chat", stateToSave)
}

export async function fetchIncomingMessages(_userId: string): Promise<import("../types").ChatMessage[]> {
  if (!isSupabaseConfigured() || !supabase) return []
  const { data, error } = await supabase.rpc('get_incoming_messages')
  
  if (error) {
    console.error("Failed to fetch incoming messages:", error.message)
    return []
  }
  
  return (data || []) as import("../types").ChatMessage[]
}

/**
 * Communicates with the Supabase Edge Function to get an AI recommendation based on performance history.
 */
export async function analyzeUserPerformance(performanceHistory: any[]): Promise<{ content: any; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { content: null, error: 'Supabase is not configured' }
  }

  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { performanceHistory }
    })

    if (error) {
      console.error('Error invoking AI edge function:', error)
      return { content: null, error: error.message || 'Failed to call AI backend' }
    }

    if (data?.error) {
      return { content: null, error: data.error }
    }

    return { content: data?.content || null }
  } catch (err: any) {
    console.error('Unexpected error calling AI backend:', err)
    return { content: null, error: err.message || 'Unexpected error' }
  }
}

// ============================================================================
// IDENTITY SYSTEM RPC CALLS
// ============================================================================

/**
 * Look up the permanent login_id (e.g. "test2#0431") for a given auth user UUID.
 * This is used when the user logs in via Google OAuth or session restore,
 * where current_login_id may not be set in localStorage.
 * Returns null if no user_identities row exists (genuinely new user).
 */
export async function lookupLoginIdByAuthUserId(authUserId: string): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) return null
  const { data, error } = await supabase
    .from('user_identities')
    .select('login_id')
    .eq('user_id', authUserId)
    .limit(1)
    .single()
  if (error || !data) return null
  return data.login_id as string
}

export async function reserveUsername(username: string, password_input: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const payload: any = { username_input: username, password_input: password_input }
  const { data, error } = await supabase.rpc('reserve_username', payload)
  if (error) {
    throw new Error(error.message)
  }
  return data as { id: string; login_id: string; user_id_number: string; username: string; dummy_email: string }
}

export async function confirmUsername(identityId: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { error } = await supabase.rpc('confirm_username', { identity_id: identityId })
  if (error) {
    throw new Error(error.message)
  }
  return true
}

export async function resolveAuthEmail(identifier: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data, error } = await supabase.rpc('resolve_login_email', { identifier })
  if (error) {
    throw new Error(error.message)
  }
  return data as string | null
}
// ============================================================================
// SOCIAL NETWORK (FRIENDS & REQUESTS)
// ============================================================================

export async function searchDeveloperByLoginId(loginId: string) {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase.rpc('search_user_by_login_id', { query_id: loginId });
  if (error) {
    console.error('Failed to search developer:', error.message);
    return null;
  }
  return data as { userId: string; login_id: string; username: string; displayName: string; avatar?: string; level: number; xp: number } | null;
}

export async function sendFriendRequest(targetUserId: string) {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('send_friend_request', { target_user_id: targetUserId });
  if (error) throw new Error(error.message);
}

export async function acceptFriendRequest(requestId: string) {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('accept_friend_request', { request_id: requestId });
  if (error) throw new Error(error.message);
}

export async function rejectFriendRequest(requestId: string) {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('reject_friend_request', { request_id: requestId });
  if (error) throw new Error(error.message);
}

export async function removeFriend(targetUserId: string) {
  if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('remove_friend', { target_user_id: targetUserId });
  if (error) throw new Error(error.message);
}

export async function fetchSocialNetwork(userId: string): Promise<{ relationships: import('../types').FriendRelationship[], incomingRequests: any[] }> {
  if (!isSupabaseConfigured() || !supabase) return { relationships: [], incomingRequests: [] };
  
  const relationships: import('../types').FriendRelationship[] = [];
  const incomingRequests: any[] = [];
  
  // Fetch Friendships
  const { data: friendships, error: fError } = await supabase
    .from('friendships')
    .select('*')
    .or(`user_id1.eq.${userId},user_id2.eq.${userId}`);
    
  if (!fError && friendships) {
    friendships.forEach(f => {
      relationships.push({
        userId: f.user_id1 === userId ? f.user_id2 : f.user_id1,
        status: 'accepted',
        createdAt: f.created_at
      });
    });
  }

  // Fetch Friend Requests
  const { data: requests, error: rError } = await supabase
    .from('friend_requests')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'pending');
    
  if (!rError && requests) {
    requests.forEach(r => {
      if (r.sender_id === userId) {
        relationships.push({
          userId: r.receiver_id,
          status: 'pending_outgoing',
          createdAt: r.created_at
        });
      } else {
        relationships.push({
          userId: r.sender_id,
          status: 'pending_incoming',
          createdAt: r.created_at
        });
        incomingRequests.push(r);
      }
    });
  }
  
  return { relationships, incomingRequests };
}

export async function sendChatMessage(receiverId: string, msgId: string, content: string, timestamp: string) {
  if (!isSupabaseConfigured() || !supabase) return null
  const { data, error } = await supabase.rpc('send_chat_message', { 
    p_receiver_id: receiverId, 
    p_msg_id: msgId, 
    p_content: content, 
    p_timestamp: timestamp 
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}
