import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabase'
import { saveProfile, saveProgressionData, saveSettings } from './api'
import type { Progression, Settings, UserProfile } from '../types'

export type AuthUser = {
  id: string
  email?: string
  name?: string
  avatarUrl?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    // Restore session on mount
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (session?.user) {
        const authUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? session.user.email ?? 'Player',
          avatarUrl: session.user.user_metadata?.avatar_url,
        }
        setUser(authUser)
        createProfileIfMissing(authUser)
      }
    })

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? session.user.email ?? 'Player',
          avatarUrl: session.user.user_metadata?.avatar_url,
        }
        setUser(authUser)
        createProfileIfMissing(authUser)
      } else {
        setUser(null)
        setIsNewUser(false)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  /**
   * Create a default profile and progression for new users.
   */
  async function createProfileIfMissing(authUser: AuthUser) {
    if (!isSupabaseConfigured() || !supabase || !authUser.id) return

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('data')
      .eq('user_id', authUser.id)
      .eq('key', 'profile')
      .maybeSingle()

    if (existingProfile?.data) {
      // Profile exists, no need to create
      return
    }

    // Create new profile for first-time user
    const emailPrefix = authUser.email?.split('@')[0] || 'player'
    const defaultUsername = emailPrefix.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20) || 'player'
    const displayName = authUser.name || emailPrefix

    const newProfile: UserProfile = {
      username: defaultUsername,
      displayName: displayName,
      avatar: authUser.avatarUrl || '',
      bio: '',
      title: 'Developer',
      introduction: 'Building skills. Building projects. Building my future.',
      education: '',
      focus: '',
      technologies: [],
      github: '',
      linkedin: '',
      contact: authUser.email || '',
      contactPublic: false,
      level: 1,
      xp: 0,
    }

    const newProgression: Progression = {
      xp: 0,
      level: 1,
      projectsCompleted: 0,
      goalsCompleted: 0,
      skillsMastered: 0,
      achievements: 0,
      badges: 0,
      streak: 0,
      longestStreak: 0,
    }

    const newSettings: Settings = {
      animationIntensity: 'high',
      reducedMotion: false,
      soundEffects: false,
      theme: 'dark',
      streakTracking: true,
    }

    // Save all initial data
    await Promise.all([
      saveProfile(authUser.id, newProfile),
      saveProgressionData(authUser.id, newProgression),
      saveSettings(authUser.id, newSettings),
    ])

    setIsNewUser(true)
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (err) {
      console.error('Google sign-in failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured() || !supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setIsNewUser(false)
  }

  return { user, loading, isNewUser, signInWithGoogle, signOut, isConfigured: isSupabaseConfigured() }
}
