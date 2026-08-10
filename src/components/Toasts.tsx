import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export type Toast = {
  id: number
  message: string
  type?: 'xp' | 'level' | 'unlock' | 'badge' | 'info'
}

type ToastsProps = {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

export function Toasts({ toasts, onDismiss }: ToastsProps) {
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type ?? 'info'}`}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() => onDismiss(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
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