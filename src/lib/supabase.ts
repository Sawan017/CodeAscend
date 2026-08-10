import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// If credentials are missing or demo mode is explicitly enabled, we run in local-only mode.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !demoMode)

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export function isSupabaseConfigured() {
  return supabase !== null
}