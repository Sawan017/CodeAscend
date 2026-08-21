import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Trash2, Bell, MessageSquare, UserPlus, Users, Award, Brain, AtSign } from 'lucide-react'

export type NotificationType = 'message' | 'friend_request' | 'group_activity' | 'mention' | 'achievement' | 'learning'

export type NotificationItem = {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  read: boolean
  created_at: string
  link_type: string | null
  link_id: string | null
}

export function NotificationsPanel({ 
  open, 
  onClose, 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  onClearAll,
  onNavigate 
}: { 
  open: boolean
  onClose: () => void
  notifications: NotificationItem[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClearAll: () => void
  onNavigate: (type: string | null, id: string | null) => void
}) {

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={16} />
      case 'friend_request': return <UserPlus size={16} />
      case 'group_activity': return <Users size={16} />
      case 'mention': return <AtSign size={16} />
      case 'achievement': return <Award size={16} />
      case 'learning': return <Brain size={16} />
      default: return <Bell size={16} />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'message': return 'var(--primary)'
      case 'friend_request': return 'var(--green)'
      case 'group_activity': return 'var(--cyan)'
      case 'mention': return 'var(--gold)'
      case 'achievement': return 'var(--accent-gamification)'
      case 'learning': return 'var(--secondary)'
      default: return 'var(--text-main)'
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'var(--glass-strong)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ width: '400px', maxWidth: '100%', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} color="var(--text-main)" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Notifications</h2>
              </div>
              <button className="icon-button" onClick={onClose} style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <button 
                onClick={onMarkAllRead}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', border: '1px solid rgba(59,130,246,0.2)', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Check size={16} /> Mark all read
              </button>
              <button 
                onClick={onClearAll}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} /> Clear all
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>You have no notifications.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        if (!n.read) onMarkRead(n.id);
                        if (n.link_type) onNavigate(n.link_type, n.link_id);
                      }}
                      style={{ 
                        padding: '1rem', 
                        background: n.read ? 'transparent' : 'rgba(255,255,255,0.03)', 
                        border: '1px solid',
                        borderColor: n.read ? 'transparent' : 'var(--border)',
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '1rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(255,255,255,0.03)'}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${getColor(n.type)}20`, color: getColor(n.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getIcon(n.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                          {n.title}
                        </h4>
                        {n.body && (
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                            {n.body}
                          </p>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', display: 'block' }}>
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                      {!n.read && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.25rem' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
