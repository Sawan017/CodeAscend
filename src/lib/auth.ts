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
    
    const currentLoginId = window.localStorage.getItem('current_login_id')
    const rememberMeMode = window.localStorage.getItem('auth_remember_me') === 'true'

    if (currentLoginId) {
      let rememberedAccounts: string[] = []
      try {
        const stored = window.localStorage.getItem('remembered_accounts')
        if (stored) rememberedAccounts = JSON.parse(stored)
      } catch (e) {
        rememberedAccounts = []
      }

      // BOTH Remember Account and Forget Account keep the ID in the remembered list!
      // "Remove account" is a separate action managed by LoginUI.tsx
      if (!rememberedAccounts.includes(currentLoginId)) {
        rememberedAccounts.push(currentLoginId)
      }

      window.localStorage.setItem('remembered_accounts', JSON.stringify(rememberedAccounts))
    }

    if (forgetAccount) {
      // Force Google account chooser if they use Google login
      window.localStorage.setItem('futureme-force-chooser', 'true')
    }

    // Determine if we should preserve the session for passwordless return
    // (Only if they checked "Remember me" at login AND clicked "Remember account" at sign-out)
    const shouldPreserveSession = !forgetAccount && rememberMeMode

    if (shouldPreserveSession) {
      // OPTION 1: REMEMBER ACCOUNT (Keep legitimate session)
      if (currentLoginId) {
        // Hide the current_login_id from customStorage before signing out.
        // This ensures Supabase only deletes the empty base key, leaving the valid namespaced session intact.
        window.localStorage.removeItem('current_login_id')
      }
      // Local sign out ensures the session is NOT revoked on the server.
      await supabase.auth.signOut({ scope: 'local' })
    } else {
      // OPTION 2 (REMEMBER ID ONLY) or OPTION 3 (DO NOT REMEMBER)
      // Do a proper global sign out to securely invalidate the session on the server.
      // customStorage will automatically clear the local token because current_login_id is still set.
      await supabase.auth.signOut()
      // NOW clear current_login_id
      window.localStorage.removeItem('current_login_id')
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

  const signUpWithEmail = async (email: string, password: string, options?: { captchaToken?: string, dob?: string }) => {
    if (!isSupabaseConfigured() || !supabase) return null
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          captchaToken: options?.captchaToken,
          data: options?.dob ? { dob: options.dob } : undefined
        }
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
