import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Trophy, Code, Target, BookOpen, Layers3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchAllUserData } from '../lib/api'
import type { UserProfile, Progression, Project, Skill, Goal, Achievement, Badge, FriendRelationship } from '../types'

type PublicProfileViewerProps = {
  userId: string | null
  activeUserId?: string
  friendState: { relationships: FriendRelationship[] }
  onClose: () => void
  onSendRequest: (userId: string) => void
  onRemoveFriend: (userId: string) => void
  onMessage: (userId: string) => void
}

export function PublicProfileViewer({ userId, activeUserId, friendState, onClose, onSendRequest, onRemoveFriend, onMessage }: PublicProfileViewerProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    profile: UserProfile | null
    progression: Progression | null
    projects: Project[]
    skills: Skill[]
    goals: Goal[]
    achievements: Achievement[]
    badges: Badge[]
  } | null>(null)

  useEffect(() => {
    if (!userId) {
      return
    }

    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      const res = await fetchAllUserData(userId)
      if (!mounted) return
      if (res) {
        setData({
          profile: res.profile,
          progression: res.progression,
          projects: res.projects || [],
          skills: res.skills || [],
          goals: res.goals || [],
          achievements: res.achievements || [],
          badges: res.badges || [],
        })
      }
      setLoading(false)
    }
    fetchData()
    return () => { mounted = false }
  }, [userId])

  if (!userId) return null

  const isSelf = activeUserId === userId
  const relationship = friendState.relationships.find(r => r.userId === userId)
  const isFriend = relationship?.status === 'accepted'
  const isPendingOutgoing = relationship?.status === 'pending_outgoing'

  return (
    <AnimatePresence>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ zIndex: 100 }}
      />
      <motion.div
        className="drawer-panel"
        style={{ width: '600px', maxWidth: '100%', right: '50%', transform: 'translateX(50%)', position: 'fixed', padding: '2rem', zIndex: 101, top: '2rem', bottom: '2rem', borderRadius: '12px' }}
        initial={{ y: '50px', opacity: 0, x: '50%' }}
        animate={{ y: 0, opacity: 1, x: '50%' }}
        exit={{ y: '50px', opacity: 0, x: '50%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">DEVELOPER PROFILE</p>
            <h3>Read-Only View</h3>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close profile">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', paddingRight: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div>
          ) : !data || !data.profile ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Profile not found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="avatar-badge" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {data.profile.avatar ? (
                    <img src={data.profile.avatar} alt={data.profile.displayName || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{data.profile.displayName}</h2>
                  <p className="muted" style={{ margin: '0.25rem 0' }}>@{data.profile.login_id || data.profile.arinova_id || data.profile.username}</p>
                  {data.profile.title && <div className="chip" style={{ marginTop: '0.5rem' }}>{data.profile.title}</div>}
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>Level {data.progression?.level || 1}</div>
                  <div className="muted">{data.progression?.xp || 0} XP</div>
                  <div style={{ marginTop: '1rem' }}>
                    {!isSelf && (
                      isFriend ? (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="primary-btn" onClick={() => { onMessage(userId); onClose() }} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Message
                          </button>
                          <button className="secondary-btn" onClick={() => onRemoveFriend(userId)} style={{ padding: '0.5rem 1rem', color: '#ef4444' }}>
                            Remove
                          </button>
                        </div>
                      ) : isPendingOutgoing ? (
                        <button className="secondary-btn" disabled style={{ padding: '0.5rem 1rem', opacity: 0.7 }}>
                          Request Sent
                        </button>
                      ) : (
                        <button className="primary-btn" onClick={() => onSendRequest(userId)} style={{ padding: '0.5rem 1rem' }}>
                          Add Friend
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {data.profile.bio && (
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><BookOpen size={16} /> About</h4>
                  <p className="copy">{data.profile.bio}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="panel" style={{ background: 'var(--surface-sunken)', padding: '1.5rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', marginTop: 0 }}><Layers3 size={16} /> Projects</h4>
                  {data.projects.filter(p => p.status === 'COMPLETED').length === 0 ? (
                    <p className="muted">No completed projects.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {data.projects.filter(p => p.status === 'COMPLETED').slice(0, 3).map(p => (
                        <div key={p.id} className="chip-row">
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="panel" style={{ background: 'var(--surface-sunken)', padding: '1.5rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', marginTop: 0 }}><Code size={16} /> Skills</h4>
                  {data.skills.filter(s => s.status === 'MASTERED').length === 0 ? (
                    <p className="muted">No mastered skills.</p>
                  ) : (
                    <div className="chip-row">
                      {data.skills.filter(s => s.status === 'MASTERED').slice(0, 5).map(s => (
                        <span key={s.id} className="chip">{s.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Trophy size={16} /> Badges</h4>
                <div className="chip-row">
                  {data.badges.filter(b => b.earned).length === 0 ? (
                    <p className="muted">No badges earned.</p>
                  ) : (
                    data.badges.filter(b => b.earned).map(b => (
                      <div key={b.id} className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{b.icon}</span> {b.title}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Target size={16} /> Goals</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {data.goals.filter(g => g.status === 'COMPLETED').length === 0 ? (
                    <p className="muted">No completed goals.</p>
                  ) : (
                    data.goals.filter(g => g.status === 'COMPLETED').map(g => (
                      <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--surface-sunken)', borderRadius: '4px' }}>
                        <span>{g.title}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>✓ Completed</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
