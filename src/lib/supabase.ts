import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// If credentials are missing or demo mode is explicitly enabled, we run in local-only mode.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !demoMode)

// Custom storage wrapper for "Remember Me" and multi-account persistence
const getStorageKey = (baseKey: string) => {
  const currentLoginId = window.localStorage.getItem('current_login_id')
  return currentLoginId ? `${baseKey}-${currentLoginId}` : baseKey
}

const customStorage = {
  getItem: (key: string) => {
    const k = getStorageKey(key)
    return window.localStorage.getItem(k) || window.sessionStorage.getItem(k)
  },
  setItem: (key: string, value: string) => {
    const k = getStorageKey(key)
    // PKCE code verifiers MUST survive cross-tab navigations (e.g., clicking an email link)
    if (key.includes('-code-verifier') || window.localStorage.getItem('auth_remember_me') === 'true') {
       window.localStorage.setItem(k, value)
       window.sessionStorage.removeItem(k)
    } else {
       window.sessionStorage.setItem(k, value)
       window.localStorage.removeItem(k)
    }
  },
  removeItem: (key: string) => {
    const k = getStorageKey(key)
    window.localStorage.removeItem(k)
    window.sessionStorage.removeItem(k)
  }
}

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: customStorage,
        persistSession: true
      }
    })
  : null

export function isSupabaseConfigured() {
  return supabase !== null
}
