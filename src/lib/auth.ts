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
  const [isRecoveringPassword, setIsRecoveringPasswordState] = useState(
    typeof window !== 'undefined' && window.sessionStorage.getItem('isRecoveringPassword') === 'true'
  )

  const setIsRecoveringPassword = (val: boolean) => {
    setIsRecoveringPasswordState(val)
    if (typeof window !== 'undefined') {
      if (val) window.sessionStorage.setItem('isRecoveringPassword', 'true')
      else window.sessionStorage.removeItem('isRecoveringPassword')
    }
  }


  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }

    // Restore session on mount
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      
      if (session?.provider_token) {
        window.sessionStorage.setItem('github_provider_token', session.provider_token)
      }

      const getValidEmail = (email?: string) => {
        if (!email) return undefined;
        if (email.includes('@example.com') || email.startsWith('id_') || email.includes('...temp...')) return undefined;
        return email;
      };

      if (session?.user) {
        const validEmail = getValidEmail(session.user.email);
        const authUser = {
          id: session.user.id,
          email: validEmail,
          name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? validEmail ?? 'Player',
          avatarUrl: session.user.user_metadata?.avatar_url,
        }
        setUser(authUser)
      }
       
      setLoading(false)
    })

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth Trace] Global onAuthStateChange:', event, 'Session:', session?.user?.id)
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true)
      }
      
      // Capture provider_token securely into sessionStorage so we can use it for GitHub API
      if (session?.provider_token) {
        window.sessionStorage.setItem('github_provider_token', session.provider_token)
        console.log('[Auth Trace] Saved provider_token from onAuthStateChange')
      }

      const getValidEmail = (email?: string) => {
        if (!email) return undefined;
        if (email.includes('@example.com') || email.startsWith('id_') || email.includes('...temp...')) return undefined;
        return email;
      };

      if (session?.user) {
        const validEmail = getValidEmail(session.user.email);
        const authUser = {
          id: session.user.id,
          email: validEmail,
          name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? validEmail ?? 'Player',
          avatarUrl: session.user.user_metadata?.avatar_url,
        }
        setUser(authUser)
      } else {
        setUser(null)
        setIsNewUser(false)
      }
       
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
    window.sessionStorage.removeItem('github_provider_token')
  }

  const signInWithEmail = async (email: string, password: string, options?: { captchaToken?: string }) => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: options?.captchaToken ? { captchaToken: options.captchaToken } : undefined
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Email sign-in failed:', err)
      setLoading(false)
      throw err
    }
  }

  const signUpWithEmail = async (email: string, password: string, options?: { captchaToken?: string }) => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: options?.captchaToken ? { captchaToken: options.captchaToken } : undefined
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Email sign-up failed:', err)
      setLoading(false)
      throw err
    }
  }

  const resetPassword = async (email: string, options?: { captchaToken?: string }) => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
        captchaToken: options?.captchaToken
      })
      if (error) throw error
    } catch (err) {
      console.error('Password reset failed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured() || !supabase) return null
    try {
      const { data, error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      
      // Successfully updated password.
      // We can also clear the recovery flag immediately so they can proceed.
      // But we should let the UI render the success state first.
      return data
    } catch (err) {
      console.error('Password update failed:', err)
      throw err
    }
  }

  return { 
    user, 
    loading, 
    isNewUser, 
    isRecoveringPassword,
    setIsRecoveringPassword,
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signOut, 
    resetPassword,
    updatePassword,
    isConfigured: isSupabaseConfigured() 
  }
}
