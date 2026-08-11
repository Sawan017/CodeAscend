import { useEffect, useRef } from 'react'
import type { AuthUser } from '../lib/auth'

/**
 * A hook that safely persists data to Supabase ONLY when the data changes
 * AFTER initial remote hydration is complete.
 * 
 * This prevents the dangerous pattern where the application loads an initial
 * empty state and accidentally overwrites existing remote data before the
 * real data has finished loading.
 */
export function usePersist<T>(
  data: T,
  user: AuthUser | null,
  isHydrated: boolean,
  saveFn: (userId: string, data: T) => Promise<unknown>
) {
  const isFirstHydration = useRef(true)
  const lastSavedData = useRef<T>(data)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!user) {
      isFirstHydration.current = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      return
    }

    if (!isHydrated) return

    if (isFirstHydration.current) {
      isFirstHydration.current = false
      lastSavedData.current = data
      return
    }

    if (data !== lastSavedData.current) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      
      timeoutRef.current = setTimeout(() => {
        saveFn(user.id, data)
        lastSavedData.current = data
      }, 500)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [data, user, isHydrated, saveFn])
}
