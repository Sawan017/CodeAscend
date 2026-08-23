import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Trophy, Code, Target, BookOpen, Layers3, MessageSquare, UserPlus, UserMinus, ShieldAlert, BellOff, BellRing, MoreVertical, Mail, Globe, Link } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchAllUserData } from '../lib/api'
import { evaluateDynamicMilestones } from '../lib/progression'
import { Avatar } from './Avatar'
import { MilestonesSection } from './MilestonesSection'
import { sanitizeUrl } from '../utils/url'
import type { UserProfile, Progression, Project, Skill, Goal, Achievement, Badge, FriendRelationship, ChatState } from '../types'

type PublicProfileViewerProps = {
  userId: string | null
  activeUserId?: string
  friendState: { relationships: FriendRelationship[] }
  chatState?: ChatState
  onlineUsers?: string[]
  onClose: () => void
  onSendRequest: (userId: string) => void
  onRemoveFriend: (userId: string) => void
  onMessage: (userId: string) => void
  onToggleBlock?: (userId: string) => void
  onToggleMute?: (userId: string) => void
}

export function PublicProfileViewer({ 
  userId, 
  activeUserId, 
  friendState, 
  chatState,
  onlineUsers = [],
  onClose, 
  onSendRequest, 
  onRemoveFriend, 
  onMessage,
  onToggleBlock,
  onToggleMute
}: PublicProfileViewerProps) {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
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
    setMenuOpen(false)

    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      const res = await fetchAllUserData(userId)
      if (!mounted) return
      
      if (res) {
        let profile = res.profile;
        if (!profile) {
          // If the profile row hasn't been explicitly created yet, try fetching the public identity
          const { fetchPublicProfiles } = await import('../lib/api');
          const pubs = await fetchPublicProfiles([userId]);
          if (pubs && pubs.length > 0) {
            const pub = pubs[0];
            profile = {
              userId: pub.userId,
              displayName: pub.displayName,
              username: pub.username,
              login_id: pub.login_id,
              avatar: pub.avatar,
              level: pub.level,
              xp: 0,
              title: '',
              introduction: '',
              education: '',
              focus: '',
              technologies: [],
              github: '',
              linkedin: '',
              contact: '',
              contactPublic: false
            };
          }
        }
        
        setData({
          profile: profile,
          progression: res.progression,
          projects: res.projects || [],
          skills: res.skills || [],
          goals: res.goals || [],
          achievements: res.achievements || [],
          badges: res.badges || [],
        })
      } else {
        // Force null if nothing returned
        setData(null)
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
  
  const isBlocked = chatState?.blockedUsers?.includes(userId) || false
  const isMuted = chatState?.mutedUsers?.includes(userId) || false
  const isOnline = onlineUsers.includes(userId)

  return (
    <AnimatePresence>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      >
        <motion.div
          style={{ 
            width: '600px', 
            maxWidth: '100%', 
            background: 'var(--surface)', 
            borderRadius: '16px', 
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              Loading Profile...
            </div>
          ) : !data || !data.profile ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <User size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Profile Not Found</h3>
              <p className="muted" style={{ margin: '0 0 2rem 0' }}>This user does not exist or has not set up their profile.</p>
              <button className="primary-btn" onClick={onClose}>Close</button>
            </div>
          ) : (
            <>
              {/* Banner */}
              <div style={{ 
                height: '180px', 
                width: '100%', 
                background: data.profile.banner 
                  ? `url(${data.profile.banner}) center/cover no-repeat` 
                  : 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
                position: 'relative'
              }}>
                <button 
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)'
                  }}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile Header Info */}
              <div style={{ padding: '0 1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', marginTop: '-40px' }}>
                    <div style={{ borderRadius: '50%', border: '6px solid var(--surface)', background: 'var(--surface)' }}>
                      <Avatar src={data.profile.avatar} alt={data.profile.displayName} size={92} isOnline={isOnline} showStatus={true} />
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', position: 'relative' }}>
                    {!isSelf && (
                      <>
                        {isFriend ? (
                          <button className="primary-btn" onClick={() => { onMessage(userId); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                            <MessageSquare size={16} /> Message
                          </button>
                        ) : isPendingOutgoing ? (
                          <button className="secondary-btn" disabled style={{ opacity: 0.7, padding: '0.5rem 1rem' }}>
                            Request Sent
                          </button>
                        ) : (
                          <button className="primary-btn" onClick={() => onSendRequest(userId)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                            <UserPlus size={16} /> Add Friend
                          </button>
                        )}
                        
                        <div style={{ position: 'relative' }}>
                          <button 
                            className="secondary-btn" 
                            style={{ padding: '0.5rem' }} 
                            onClick={() => setMenuOpen(!menuOpen)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          <AnimatePresence>
                            {menuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  marginTop: '0.5rem',
                                  background: 'var(--surface-raised)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '8px',
                                  padding: '0.5rem',
                                  minWidth: '180px',
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                  zIndex: 10,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.25rem'
                                }}
                              >
                                {isFriend && (
                                  <button 
                                    className="menu-item" 
                                    onClick={() => { onRemoveFriend(userId); setMenuOpen(false) }}
                                    style={{ color: '#ef4444' }}
                                  >
                                    <UserMinus size={16} /> Remove Friend
                                  </button>
                                )}
                                {onToggleMute && (
                                  <button 
                                    className="menu-item" 
                                    onClick={() => { onToggleMute(userId); setMenuOpen(false) }}
                                  >
                                    {isMuted ? <><BellRing size={16} /> Unmute</> : <><BellOff size={16} /> Mute</>}
                                  </button>
                                )}
                                {onToggleBlock && (
                                  <button 
                                    className="menu-item" 
                                    onClick={() => { onToggleBlock(userId); setMenuOpen(false) }}
                                    style={{ color: '#ef4444' }}
                                  >
                                    <ShieldAlert size={16} /> {isBlocked ? 'Unblock' : 'Block'}
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Name & Title */}
                <div style={{ marginTop: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem', fontWeight: 700 }}>
                    {data.profile.displayName}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <p className="muted" style={{ margin: 0, fontSize: '1rem' }}>
                      @{data.profile.login_id || data.profile.username}
                    </p>
                    {data.profile.title && (
                      <span className="chip" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                        {data.profile.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="drawer-content" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                      Lvl {data.progression?.level || 1}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>LEVEL</div>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {data.progression?.xp || 0}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>TOTAL XP</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {data.progression?.projectsCompleted || 0}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>PROJECTS</div>
                  </div>
                </div>

                {/* About Section & Links */}
                {(data.profile.bio || (data.profile.contactPublic && data.profile.contact) || data.profile.github || data.profile.linkedin || data.profile.portfolio) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px' }}>
                    {data.profile.bio && (
                      <div>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                          <BookOpen size={16} /> ABOUT ME
                        </h4>
                        <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{data.profile.bio}</p>
                      </div>
                    )}
                    
                    {/* Social/Contact Links */}
                    {((data.profile.contactPublic && data.profile.contact) || data.profile.github || data.profile.linkedin || data.profile.portfolio) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: data.profile.bio ? '0.5rem' : '0' }}>
                        {data.profile.github && (
                          <a href={sanitizeUrl(data.profile.github)} target="_blank" rel="noreferrer" className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <Code size={16} /> GitHub
                          </a>
                        )}
                        {data.profile.linkedin && (
                          <a href={sanitizeUrl(data.profile.linkedin)} target="_blank" rel="noreferrer" className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <Globe size={16} /> LinkedIn
                          </a>
                        )}
                        {data.profile.portfolio && (
                          <a href={sanitizeUrl(data.profile.portfolio)} target="_blank" rel="noreferrer" className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <Link size={16} /> Portfolio
                          </a>
                        )}
                        {data.profile.contactPublic && data.profile.contact && (
                          <a href={sanitizeUrl(`mailto:${data.profile.contact}`)} className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <Mail size={16} /> Email
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Milestones Section */}
                <MilestonesSection dynamicMilestones={evaluateDynamicMilestones(data.progression || { xp: 0, level: 1, projectsCompleted: 0, goalsCompleted: 0, skillsMastered: 0, achievements: 0, badges: 0, streak: 0, longestStreak: 0 }, data.skills)} displayedIds={data.profile.displayedAchievements} maxVisible={12} />

                {/* Badges Section */}
                {data.badges.filter(b => b.earned).length > 0 && (
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                      <Trophy size={16} /> BADGES
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {data.badges.filter(b => b.earned).map(b => (
                        <div key={b.id} className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--surface-raised)' }}>
                          <span style={{ fontSize: '1.2rem' }}>{b.icon}</span> 
                          <span style={{ fontWeight: 500 }}>{b.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grid for Projects & Skills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  
                  {/* Skills */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                      <Code size={16} /> MASTERED SKILLS
                    </h4>
                    {data.skills.filter(s => s.status === 'MASTERED').length === 0 ? (
                      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>No skills mastered yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {data.skills.filter(s => s.status === 'MASTERED').slice(0, 8).map(s => (
                          <span key={s.id} className="chip" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)' }}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                      <Layers3 size={16} /> TOP PROJECTS
                    </h4>
                    {data.projects.filter(p => p.status === 'COMPLETED').length === 0 ? (
                      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>No completed projects.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {data.projects.filter(p => p.status === 'COMPLETED').slice(0, 3).map(p => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: 'var(--surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{p.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                </div>

                {/* Goals */}
                {data.goals.filter(g => g.status === 'COMPLETED').length > 0 && (
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                      <Target size={16} /> RECENT GOALS
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {data.goals.filter(g => g.status === 'COMPLETED').slice(0, 3).map(g => (
                        <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontWeight: 500 }}>{g.title}</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>✓ Completed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
