import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  onConfirm,
  onCancel
}: {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return createPortal(
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', margin: '1rem' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.2rem' }}>{title}</h3>
        <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', background: danger ? '#ef4444' : 'var(--cyan)', color: danger ? '#fff' : '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
