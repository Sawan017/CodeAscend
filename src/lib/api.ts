import type { Achievement, Badge, FriendState, Goal, Progression, Project, Settings, Skill, UserProfile } from '../types'
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

  const [profile, progression, goals, projects, skills, achievements, badges, settings, friends] = await Promise.all([
    fetchRow<UserProfile>(TABLES.profile, userId, 'profile'),
    fetchRow<Progression>(TABLES.progression, userId, 'progression'),
    fetchRow<Goal[]>(TABLES.goals, userId, 'goals'),
    fetchRow<Project[]>(TABLES.projects, userId, 'projects'),
    fetchRow<Skill[]>(TABLES.skills, userId, 'skills'),
    fetchRow<Achievement[]>(TABLES.achievements, userId, 'achievements'),
    fetchRow<Badge[]>(TABLES.badges, userId, 'badges'),
    fetchRow<Settings>(TABLES.settings, userId, 'settings'),
    fetchRow<FriendState>(TABLES.profile, userId, 'friends'),
  ])

  return { profile, progression, goals, projects, skills, achievements, badges, settings, friends }
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
 * Check if a username is available (not already taken by another user).
 * Returns true if available, false if taken.
 */
export async function checkUsernameAvailability(username: string, excludeUserId?: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return true
  if (!username || username.trim().length === 0) return false

  const trimmedUsername = username.trim().toLowerCase()
  
  const { data, error } = await supabase
    .from(TABLES.profile)
    .select('user_id, data')
    .neq('user_id', excludeUserId || '00000000-0000-0000-0000-000000000000')

  if (error) {
    console.error('Username availability check failed:', error.message)
    return true // Allow on error to not block users
  }

  const taken = data?.some((row) => {
    const profileData = row.data as UserProfile
    return profileData.username?.toLowerCase() === trimmedUsername
  })

  return !taken
}

/**
 * Fetch all public profiles for user discovery.
 * Returns array of public profile data.
 */
export async function fetchPublicProfiles(): Promise<Array<{ userId: string; username: string; displayName: string; avatar?: string; level: number }>> {
  if (!isSupabaseConfigured() || !supabase) return []

  const { data, error } = await supabase
    .from(TABLES.profile)
    .select('user_id, data')
    .limit(100)

  if (error) {
    console.error('Failed to fetch public profiles:', error.message)
    return []
  }

  return data?.map((row) => {
    const profileData = row.data as UserProfile
    return {
      userId: row.user_id,
      username: profileData.username || 'unknown',
      displayName: profileData.displayName || profileData.username || 'Unknown',
      avatar: profileData.avatar,
      level: profileData.level || 1,
    }
  }) || []
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

