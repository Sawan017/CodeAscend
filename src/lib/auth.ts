import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabase'
import { clearStorage } from '../utils/storage'
export type AuthUser = {
  id: string
  email?: string
  name?: string
  avatarUrl?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured())
  const [isNewUser, setIsNewUser] = useState(false)


  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }

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
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
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
      } else {
        setUser(null)
        setIsNewUser(false)
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    
    const forceChooser = window.localStorage.getItem('futureme-force-chooser') === 'true'
    window.localStorage.removeItem('futureme-force-chooser')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: forceChooser ? { prompt: 'select_account' } : undefined,
        },
      })
      if (error) throw error
    } catch (err) {
      console.error('Google sign-in failed:', err)
      setLoading(false)
    }
  }

  const signOut = async (forgetAccount: boolean = false) => {
    if (!isSupabaseConfigured() || !supabase) return
    
    clearStorage()

    if (forgetAccount) {
      window.localStorage.setItem('futureme-force-chooser', 'true')
    }
    
    await supabase.auth.signOut()
    setUser(null)
    setIsNewUser(false)
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Email sign-in failed:', err)
      setLoading(false)
      throw err
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Email sign-up failed:', err)
      setLoading(false)
      throw err
    }
  }

  return { user, loading, isNewUser, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, isConfigured: isSupabaseConfigured() }
}
