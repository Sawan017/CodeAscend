import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, UserPlus, Check, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FriendState } from '../types'
import { Avatar } from './Avatar'
import { searchDeveloperByLoginId } from '../lib/api'

type UserSearchProps = {
  open: boolean
  onClose: () => void
  onSelectUser: (userId: string) => void
  activeUserId?: string
  friendState?: FriendState
  onSendRequest?: (userId: string) => void
}

export function UserSearch({ open, onClose, onSelectUser, activeUserId, friendState, onSendRequest }: UserSearchProps) {
  const [query, setQuery] = useState('')
  const [profiles, setProfiles] = useState<Array<{ userId: string; username: string; displayName: string; avatar?: string; level: number; login_id?: string; xp: number }>>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setProfiles([])
      setErrorMsg(null)
    }
  }, [open])

  async function handleSearch() {
    setErrorMsg(null)
    if (!query.trim()) {
      setProfiles([])
      return
    }

    setLoading(true)
    const profile = await searchDeveloperByLoginId(query.trim())
    if (profile) {
      setProfiles([profile])
    } else {
      setProfiles([])
      setErrorMsg('Developer not found')
    }
    setLoading(false)
  }

  function getRelationshipStatus(userId: string) {
    if (!friendState) return 'none'
    const rel = friendState.relationships.find(r => r.userId === userId)
    if (!rel) return 'none'
    return rel.status // 'accepted', 'pending_outgoing', 'pending_incoming'
  }

  function renderActionButton(profile: any) {
    if (profile.userId === activeUserId) {
      return <button className="secondary-btn" disabled>You cannot add yourself</button>
    }
    
    const status = getRelationshipStatus(profile.userId)
    
    if (status === 'accepted') {
      return <button className="secondary-btn" disabled style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}><Check size={16} /> Already Friends</button>
    }
    
    if (status === 'pending_outgoing') {
      return <button className="secondary-btn" disabled><Clock size={16} /> Request Sent</button>
    }

    if (status === 'pending_incoming') {
      return <button className="primary-btn" onClick={() => onSelectUser(profile.userId)}>Review Request</button>
    }

    return (
      <button className="primary-btn" onClick={() => onSendRequest && onSendRequest(profile.userId)}>
        <UserPlus size={16} /> Add Friend
      </button>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="user-search-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">DISCOVER</p>
                <h3>Find Developers</h3>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close search">
                <X size={18} />
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search exact User ID (e.g. test#1234)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="secondary-btn" onClick={handleSearch} disabled={loading}>
                <Search size={16} />
              </button>
            </div>

            <div className="user-list">
              {loading ? (
                <p className="muted">Searching...</p>
              ) : errorMsg ? (
                <p className="muted" style={{ color: 'var(--danger, #ef4444)' }}>{errorMsg}</p>
              ) : profiles.length === 0 ? (
                <p className="muted">Enter a permanent User ID to search.</p>
              ) : (
                profiles.map((profile) => (
                  <motion.div
                    key={profile.userId}
                    className="user-card"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div onClick={() => onSelectUser(profile.userId)} style={{ cursor: 'pointer' }}>
                        <Avatar src={profile.avatar} alt={profile.displayName} size={40} />
                      </div>
                      <div className="user-info">
                        <h4 onClick={() => onSelectUser(profile.userId)} style={{ cursor: 'pointer' }}>{profile.displayName}</h4>
                        <p className="muted">@{profile.login_id} Level {profile.level}</p>
                      </div>
                    </div>
                    <div>
                      {renderActionButton(profile)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
