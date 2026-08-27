import { AnimatePresence, motion } from 'framer-motion'
import type { Toast } from '../hooks/useToasts'

type ToastsProps = {
  toasts: Toast[]
  onDismiss: (id: number) => void
  hasActiveSession?: boolean
}

export function Toasts({ toasts, onDismiss, hasActiveSession }: ToastsProps) {
  return (
    <div 
      className="toast-stack" 
      style={hasActiveSession ? { top: '150px' } : undefined}
    >
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
