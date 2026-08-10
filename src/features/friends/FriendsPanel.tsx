import { motion } from 'framer-motion'
import { User, Check, X, MessageSquare, UserMinus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FriendRelationship } from '../../types'
import { fetchPublicProfiles } from '../../lib/api'

type PublicUser = {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
}

type FriendsPanelProps = {
  friendState: { relationships: FriendRelationship[] }
  incomingRequests: string[]
  onAccept: (userId: string) => void
  onReject: (userId: string) => void
  onRemove: (userId: string) => void
  onOpenProfile: (userId: string) => void
  onMessage: (userId: string) => void
}

export function FriendsPanel({ friendState, incomingRequests, onAccept, onReject, onRemove, onOpenProfile, onMessage }: FriendsPanelProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  const [publicProfiles, setPublicProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const profiles = await fetchPublicProfiles()
      if (!mounted) return
      setPublicProfiles(profiles)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const acceptedIds = friendState.relationships.filter(r => r.status === 'accepted').map(r => r.userId)
  const pendingOutgoingIds = friendState.relationships.filter(r => r.status === 'pending_outgoing').map(r => r.userId)

  const friends = publicProfiles.filter(p => acceptedIds.includes(p.userId))
  const incoming = publicProfiles.filter(p => incomingRequests.includes(p.userId))
  const outgoing = publicProfiles.filter(p => pendingOutgoingIds.includes(p.userId))

  return (
    <div className="section-shell">
      <div className="card-heading" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">SOCIAL NETWORK</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`secondary-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
            style={activeTab === 'friends' ? { background: 'var(--primary)', color: '#000', borderColor: 'var(--primary)' } : {}}
          >
            My Friends ({friends.length})
          </button>
          <button 
            className={`secondary-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
            style={activeTab === 'requests' ? { background: 'var(--primary)', color: '#000', borderColor: 'var(--primary)' } : {}}
          >
            Requests {incoming.length > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '0 6px', fontSize: '0.75rem', marginLeft: '4px' }}>{incoming.length}</span>}
          </button>
        </div>
      </div>

      <div className="panel" style={{ minHeight: '400px' }}>
        {loading ? (
          <p className="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading network...</p>
        ) : activeTab === 'friends' ? (
          <div>
            {friends.length === 0 ? (
              <p className="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>You haven't added any friends yet. Use the search bar to find developers!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {friends.map(friend => (
                  <motion.div key={friend.userId} whileHover={{ y: -2 }} className="panel" style={{ background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                    <div className="avatar-badge" style={{ width: '48px', height: '48px', flexShrink: 0, cursor: 'pointer' }} onClick={() => onOpenProfile(friend.userId)}>
                      {friend.avatar ? <img src={friend.avatar} alt={friend.displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={24} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => onOpenProfile(friend.userId)}>{friend.displayName}</h4>
                      <p className="muted" style={{ margin: '0', fontSize: '0.85rem' }}>@{friend.username} • Lvl {friend.level}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-button" onClick={() => onMessage(friend.userId)} aria-label="Message" title="Message">
                        <MessageSquare size={16} />
                      </button>
                      <button className="icon-button" onClick={() => onRemove(friend.userId)} aria-label="Remove friend" title="Remove Friend" style={{ color: '#ef4444' }}>
                        <UserMinus size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Incoming Requests ({incoming.length})</h4>
              {incoming.length === 0 ? (
                <p className="muted">No incoming friend requests.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {incoming.map(req => (
                    <motion.div key={req.userId} whileHover={{ y: -2 }} className="panel" style={{ background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                      <div className="avatar-badge" style={{ width: '48px', height: '48px', flexShrink: 0, cursor: 'pointer' }} onClick={() => onOpenProfile(req.userId)}>
                        {req.avatar ? <img src={req.avatar} alt={req.displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={24} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => onOpenProfile(req.userId)}>{req.displayName}</h4>
                        <p className="muted" style={{ margin: '0', fontSize: '0.85rem' }}>@{req.username} • Lvl {req.level}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="icon-button" onClick={() => onAccept(req.userId)} aria-label="Accept" title="Accept Request" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                          <Check size={16} />
                        </button>
                        <button className="icon-button" onClick={() => onReject(req.userId)} aria-label="Reject" title="Reject Request" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem' }}>Sent Requests ({outgoing.length})</h4>
              {outgoing.length === 0 ? (
                <p className="muted">No pending sent requests.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {outgoing.map(req => (
                    <motion.div key={req.userId} whileHover={{ y: -2 }} className="panel" style={{ background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', opacity: 0.7 }}>
                      <div className="avatar-badge" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                        {req.avatar ? <img src={req.avatar} alt={req.displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={20} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.displayName}</h4>
                        <p className="muted" style={{ margin: '0', fontSize: '0.85rem' }}>Pending...</p>
                      </div>
                      <button className="secondary-btn" onClick={() => onRemove(req.userId)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        Cancel
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
