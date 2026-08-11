import { useEffect, useState, useRef, useCallback } from 'react'

export type Toast = {
  id: number
  message: string
  type?: 'xp' | 'level' | 'unlock' | 'badge' | 'info'
}

/**
 * Hook to manage a list of toasts with auto-dismiss.
 */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const push = useCallback((message: string, type: Toast['type'] = 'info', duration = 3200) => {
    counter.current += 1
    const id = counter.current
    setToasts((prev) => {
      // Keep only last 5 toasts to avoid endless stacking
      const next = [...prev, { id, message, type }]
      if (next.length > 5) return next.slice(next.length - 5)
      return next
    })
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    return () => setToasts([])
  }, [])

  return { toasts, push, dismiss }
}
