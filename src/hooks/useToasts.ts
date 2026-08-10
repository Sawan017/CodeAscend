import { useEffect, useState } from 'react'

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
  const [counter, setCounter] = useState(0)

  const push = (message: string, type: Toast['type'] = 'info', duration = 3200) => {
    const id = counter + 1
    setCounter(id)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  useEffect(() => {
    return () => setToasts([])
  }, [])

  return { toasts, push, dismiss }
}
