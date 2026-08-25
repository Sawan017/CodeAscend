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
  if (!isSupabaseConfigured() || !supabase) return null

  const { data: { session } } = await supabase.auth.getSession()
  const isOwner = session?.user?.id === userId
  
  let profile: UserProfile | null = null

  if (isOwner) {
    profile = await fetchRow<UserProfile>(TABLES.profile, userId, 'profile')
  } else {
    const { data: publicProfile, error } = await supabase.rpc('get_public_profile', { p_user_id: userId })
    if (error || !publicProfile) return null
    profile = publicProfile as UserProfile
  }

  if (!profile && !isOwner) return null

  // Double check in case of RLS bypass/edge cases
  const isPublic = profile?.isPublic === true
  if (!isPublic && !isOwner) {
    return null
  }

  const [progression, goals, projects, skills, achievements, badges, settings, friends, chat] = await Promise.all([
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
    login_id: row.login_id,
    profileVisibility: row.profile_visibility || 'public',
    allowFriendRequests: row.allow_friend_requests !== false
  })) || []
}

/**
 * Fetch a specific user's public profile by username.
 */
export async function fetchPublicProfileByUsername(username: string): Promise<{ userId: string; username: string; displayName: string; avatar?: string; level: number; xp: number; bio?: string; title?: string; login_id?: string } | null> {
  if (!isSupabaseConfigured() || !supabase) return null

  const { data, error } = await supabase.rpc('get_public_profile_by_username', { p_username: username })

  if (error) {
    console.error('Failed to fetch profile by username:', error.message)
    return null
  }

  return data as any || null
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

export async function reserveUsername(username: string, password_input: string, terms_version: string = "1.0", privacy_version: string = "1.0") {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const payload: any = { username_input: username, password_input: password_input, terms_version, privacy_version }
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

export async function resolveAuthEmail(identifier: string, password?: string) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }
  
  // Secure server-side resolution that requires the password to prevent enumeration
  const { data, error } = await supabase.rpc('resolve_login_id_secure', { 
    identifier, 
    pass: password || '' 
  })
  
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
  
  // Prevent PostgREST filter AST injection
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
      return { relationships: [], incomingRequests: [] };
  }

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

// --- External Integrations ---

export async function fetchExternalProjects(userId: string) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('external_projects')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching external projects:', error)
    return []
  }
  return data
}

export async function upsertExternalProject(record: Partial<import('../types').ExternalProjectRecord>) {
  if (!supabase) throw new Error('Supabase not configured')
  if (!record.user_id || !record.provider || !record.external_id) {
    throw new Error('Missing required fields for external project')
  }

  // Fetch existing to preserve fields like xp_awarded if not explicitly provided
  const { data: existing } = await supabase
    .from('external_projects')
    .select('*')
    .eq('user_id', record.user_id)
    .eq('provider', record.provider)
    .eq('external_id', record.external_id)
    .single()

  const { data, error } = await supabase
    .from('external_projects')
    .upsert({
      user_id: record.user_id,
      provider: record.provider,
      external_id: record.external_id,
      status: record.status || existing?.status || 'in_progress',
      xp_awarded: record.xp_awarded !== undefined ? record.xp_awarded : (existing?.xp_awarded || 0),
      metadata: record.metadata || existing?.metadata || {},
      last_synced_at: new Date().toISOString(),
      is_deleted: false
    }, {
      onConflict: 'user_id,provider,external_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting external project:', error)
    throw error
  }
  return data
}
