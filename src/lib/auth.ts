import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabase'
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
    
    // Manage multi-account "remembered accounts" logic
    const currentLoginId = window.localStorage.getItem('current_login_id')
    if (currentLoginId) {
      let rememberedAccounts: string[] = []
      try {
        const stored = window.localStorage.getItem('remembered_accounts')
        if (stored) rememberedAccounts = JSON.parse(stored)
      } catch (e) {
        // Reset if malformed
        rememberedAccounts = []
      }

      if (forgetAccount) {
        // Forget account: remove current from the list
        rememberedAccounts = rememberedAccounts.filter(id => id !== currentLoginId)
      } else {
        // Remember account: add current to the list if not already there
        if (!rememberedAccounts.includes(currentLoginId)) {
          rememberedAccounts.push(currentLoginId)
        }
      }

      window.localStorage.setItem('remembered_accounts', JSON.stringify(rememberedAccounts))
      
      // Clear current_login_id BEFORE we call signOut!
      // This is vital because customStorage dynamically uses current_login_id for the storage key.
      // If we clear it first, the BASE key (which is empty) is passed to customStorage.removeItem.
      // This preserves the actual user's session natively in localStorage!
      window.localStorage.removeItem('current_login_id')
    }

    if (forgetAccount) {
      // Force Google account chooser if they use Google login
      window.localStorage.setItem('futureme-force-chooser', 'true')
      // Global sign out - this revokes the session on the server.
      // Note: Because we cleared current_login_id above, customStorage won't remove the specific key locally here.
      // But we must manually remove the local session from our custom storage bucket.
      if (currentLoginId) {
        const baseKey = 'sb-' + new URL(import.meta.env.VITE_SUPABASE_URL || '').hostname.split('.')[0] + '-auth-token'
        window.localStorage.removeItem(`${baseKey}-${currentLoginId}`)
        window.sessionStorage.removeItem(`${baseKey}-${currentLoginId}`)
      }
      await supabase.auth.signOut()
    } else {
      // Local sign out (clears Supabase's in-memory session)
      await supabase.auth.signOut({ scope: 'local' })
    }
    
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
