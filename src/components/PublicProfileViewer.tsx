import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Trophy, Code, Target, BookOpen, Layers3, MessageSquare, UserPlus, UserMinus, ShieldAlert, BellOff, BellRing, MoreVertical, Mail, Globe, Link, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchAllUserData } from '../lib/api'
import { evaluateDynamicMilestones, calculateLevel } from '../lib/progression'
import { Avatar } from './Avatar'
import { MilestonesSection } from './MilestonesSection'
import { sanitizeUrl } from '../utils/url'
import type { UserProfile, Progression, Project, Skill, Goal, Achievement, Badge, FriendRelationship, ChatState } from '../types'

type PublicProfileViewerProps = {
  incomingRequests?: string[]
  onAcceptRequest?: (userId: string) => void
  onRejectRequest?: (userId: string) => void
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
  incomingRequests = [],
  onAcceptRequest,
  onRejectRequest, 
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
    privacySettings: { allowFriendRequests: boolean }
    isLockedView: boolean
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
      
      let profile = res?.profile || null;
      let privacySettings = { allowFriendRequests: true };
      let isLockedView = false;
      
      if (!profile) {
        const { fetchPublicProfiles } = await import('../lib/api')
        const pubs = await fetchPublicProfiles([userId])
        if (pubs && pubs.length > 0) {
          const pub = pubs[0] as any;
          privacySettings = {
            allowFriendRequests: pub.allowFriendRequests !== false
          };
          // The profile fetch failed, meaning we don't have permission (not public, not friend)
          isLockedView = pub.profileVisibility !== 'public';
          
          profile = {
            userId: pub.userId,
            displayName: pub.displayName,
            username: pub.username,
            login_id: pub.login_id,
            avatar: pub.avatar,
            level: pub.level || 1,
            xp: pub.xp || 0,
            isPublic: pub.profileVisibility === 'public',
            title: pub.profileVisibility === 'public' ? 'Profile' : 'Private Profile',
            introduction: pub.profileVisibility === 'public' ? '' : 'This user has limited their profile visibility.',
            education: '',
            focus: '',
            technologies: [],
            github: '',
            linkedin: '',
            contact: '',
            contactPublic: false
          };
          setData({
            profile,
            privacySettings,
            isLockedView,
            progression: null,
            projects: [],
            skills: [],
            goals: [],
            achievements: [],
            badges: [],
          })
        } else {
          setData(null)
        }
      } else {
        if ((profile as any)._privacySettings) {
           privacySettings = {
             allowFriendRequests: (profile as any)._privacySettings.allowFriendRequests !== false
           };
        }
        setData({
          profile: profile,
          privacySettings,
          isLockedView: false,
          progression: res?.progression || null,
          projects: res?.projects || [],
          skills: res?.skills || [],
          goals: res?.goals || [],
          achievements: res?.achievements || [],
          badges: res?.badges || [],
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
  const isPendingIncoming = incomingRequests.includes(userId)
  
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
        style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      >
        <motion.div
          style={{ 
            width: '600px', 
            maxWidth: '100%', 
            background: 'var(--surface)', 
            borderRadius: '16px', 
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
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
              <User size={48} color="'var(--text-muted)'" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Profile Not Found</h3>
              <p className="muted" style={{ margin: '0 0 2rem 0' }}>This user does not exist or has not set up their profile.</p>
              <button className="primary-btn" onClick={onClose}>Close</button>
            </div>
          ) : data.isLockedView ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '12px', position: 'relative' }}>
              <button 
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--surface-sunken)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Private Profile</h3>
              <p className="muted" style={{ margin: '0 0 2rem 0' }}>This user's profile is private.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {!isSelf && (
                  isFriend ? (
                    <button className="secondary-btn" disabled style={{ opacity: 0.7, padding: '0.5rem 1rem' }}>
                      Friends
                    </button>
                  ) : relationship?.status === 'pending_outgoing' ? (
                    <button className="secondary-btn" disabled style={{ opacity: 0.7, padding: '0.5rem 1rem' }}>
                      Request Sent
                    </button>
                  ) : data.privacySettings?.allowFriendRequests ? (
                    <button className="primary-btn" onClick={() => onSendRequest(userId)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                      <UserPlus size={16} /> Add Friend
                    </button>
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Banner */}
              <div style={{ 
                height: '240px', 
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
                    backdropFilter: 'none'
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
                        ) : data.privacySettings?.allowFriendRequests ? (
                          <button className="primary-btn" onClick={() => onSendRequest(userId)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                            <UserPlus size={16} /> Add Friend
                          </button>
                        ) : null}
                        
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
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                  zIndex: 10,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.25rem'
                                }}
                              >
                                                               <button 
                                    className="menu-item" 
                                    onClick={() => {
                                      const idToCopy = data?.profile?.login_id || data?.profile?.username;
                                      if (idToCopy) navigator.clipboard.writeText(idToCopy);
                                      setMenuOpen(false);
                                    }}
                                  >
                                    <Copy size={16} /> Copy ARINOVA ID
                                  </button>
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
                      Lvl {data.progression ? calculateLevel(data.progression.xp) : (data.profile?.level || 1)}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>LEVEL</div>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {data.skills ? data.skills.filter(s => s.progress >= 50).length : 0}
                    </div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>SKILLS LEARNED</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {data.projects?.length || 0}
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
                {(() => {
                  const dynamic = evaluateDynamicMilestones(data.progression || { xp: 0, level: 1, projectsCompleted: 0, goalsCompleted: 0, skillsMastered: 0, achievements: 0, badges: 0, streak: 0, longestStreak: 0 }, data.skills);
                  const standard = (data.achievements || []).map(a => ({
                    id: a.id,
                    title: a.title,
                    description: a.description,
                    category: 'Special' as const,
                    icon: a.icon === '???' ? 'Award' : (a.icon || 'Award'),
                    targetValue: 1,
                    progressValue: a.unlocked ? 1 : 0,
                    isUnlocked: a.unlocked,
                    tier: 'bronze' as const
                  }));
                  const combined = [...dynamic, ...standard];
                  return <MilestonesSection dynamicMilestones={combined} displayedIds={data.profile.displayedAchievements} maxVisible={12} />;
                })()}

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
                      <Code size={16} /> DISPLAYED SKILLS
                    </h4>
                    {(() => {
                      let displayableSkills = (data.profile.displayedSkills || [])
                        .map(id => (data.skills || []).find(s => s.id === id))
                        .filter(s => s && s.progress >= 50) as typeof data.skills;
                      
                      if (displayableSkills.length === 0 && data.skills?.length > 0) {
                        displayableSkills = [...data.skills].sort((a, b) => b.progress - a.progress).filter(s => s.progress >= 20).slice(0, 3);
                      }

                      if (displayableSkills.length === 0) {
                        return <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>No skills to display.</p>
                      }

                      return (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {displayableSkills.map(s => {
                            const isMastered = s.progress >= 100 || s.status === 'MASTERED'
                            return (
                              <span key={s.id} className="chip" style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border)' }}>
                                {s.name}
                                {isMastered && <span style={{ marginLeft: '6px', background: '#10b981', color: '#000', padding: '1px 5px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>M</span>}
                              </span>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--text-muted)' }}>
                      <Layers3 size={16} /> TOP PROJECTS
                    </h4>
                    {(() => {
                      let displayableProjects = data.projects.filter(p => p.status === 'COMPLETED');
                      if (displayableProjects.length === 0 && data.projects.length > 0) {
                        displayableProjects = data.projects;
                      }
                      
                      if (displayableProjects.length === 0) {
                        return <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>No projects yet.</p>;
                      }
                      
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {displayableProjects.slice(0, 3).map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', background: 'var(--surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                              <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{p.name}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
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
