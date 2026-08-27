import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Leaf, Droplet, Wind, Network, Award, Moon, Sun } from 'lucide-react'
import type { UserProfile, Progression, Project, Goal, Skill, Badge } from '../../types'

// --- Botanical SVGs ---
const LeafIcon = ({ filled = false, size = 14, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "var(--accent-bloom)" : "none"} stroke="var(--accent-primary)" strokeWidth="1" style={style}>
    <path d="M12 2C17 2 21 7 21 12C21 17 12 22 12 22C12 22 3 17 3 12C3 7 7 2 12 2Z" />
    <path d="M12 22V12" strokeDasharray={filled ? "0" : "2 2"} />
  </svg>
)

const FlowerIcon = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--accent-faint)" stroke="var(--accent-primary)" strokeWidth="1" style={style}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    <circle cx="12" cy="12" r="3" fill="var(--accent-bloom)" stroke="none" />
  </svg>
)

const BudIcon = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1" style={style}>
    <path d="M12 4C14 6 16 10 12 16C8 10 10 6 12 4Z" fill="var(--bg-surface-hover)" />
    <path d="M12 16V22" />
  </svg>
)

// Decorative branching background leaf
const BackgroundLeaf = ({ top, left, right, bottom, rotate = 0, scale = 1, opacity = 0.5 }: any) => (
  <div style={{ position: 'absolute', top, left, right, bottom, transform: `rotate(${rotate}deg) scale(${scale})`, pointerEvents: 'none', zIndex: 0, opacity }}>
    <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--accent-faint)" stroke="var(--accent-primary)" strokeWidth="0.5">
      <path d="M12 2C19 2 23 8 23 12C23 16 12 22 12 22C12 22 1 16 1 12C1 8 5 2 12 2Z" />
      <path d="M12 22V12" />
    </svg>
  </div>
)

const OrganicDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '2.5rem', opacity: 0.7 }}>
    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
    <LeafIcon size={12} style={{ margin: '0 8px', opacity: 0.5 }} />
    <div style={{ width: '40px', height: '1px', background: 'var(--accent-primary)', opacity: 0.5 }} />
  </div>
)

// --- Components ---
const ZoneHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1rem', position: 'relative' }}>
    <Icon size={18} color="var(--accent-primary)" strokeWidth={1.5} />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
       <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '0.05em', margin: 0 }}>{title}</h4>
       {subtitle && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem' }}>{subtitle}</span>}
    </div>
  </div>
)

const BotanicalCard = ({ children, borderAccent = 'left' }: { children: React.ReactNode, borderAccent?: 'left' | 'right' }) => (
  <div style={{ 
    padding: '2.5rem', 
    background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)', 
    boxShadow: 'var(--shadow-elevation)', 
    border: '1px solid var(--border-color)', 
    borderRadius: borderAccent === 'left' ? '0 40px 0 0' : '40px 0 0 0', 
    position: 'relative', 
  }}>
    <div style={{ 
      position: 'absolute', 
      top: '-1px', 
      [borderAccent]: '-1px', 
      width: '3px', 
      height: 'calc(100% + 2px)', 
      background: 'var(--accent-primary)',
      opacity: 0.6
    }} />
    <div style={{ position: 'absolute', top: '-10px', [borderAccent]: '20px' }}>
      <LeafIcon size={12} filled={false} style={{ opacity: 0.4 }} />
    </div>
    {children}
  </div>
)

type BotanicalHubProps = {
  profile: UserProfile
  progression: Progression
  projects: Project[]
  goals: Goal[]
  skills: Skill[]
  badges: Badge[]
  onNavigate: (route: any) => void
  friendState?: any
  chatState?: any
  incomingRequestsCount?: number
  unreadMessagesCount?: number
}

export function BotanicalHub({ profile, progression, projects, goals, skills, badges, friendState, chatState, incomingRequestsCount, unreadMessagesCount, onNavigate }: BotanicalHubProps) {
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [color, setColor] = useState<'azure' | 'crimson'>('azure')

  useEffect(() => {
    document.body.dataset.theme = theme
    document.body.dataset.color = color
  }, [theme, color])
  
  const safeProfile = profile || { displayName: 'Seeker', username: 'seeker' }
  const safeProgression = progression || { level: 1, xp: 0 }
  
  // Data processing
  const activeProject = (projects || []).find(p => p.progress > 0 && p.progress < 100)
  const activeGoal = (goals || []).find(g => g.status === 'ACTIVE')
  const activeSkills = (skills || []).filter(s => s.progress > 0 && s.progress < 100).slice(0, 4)
  const recentBadges = [...(badges || [])].filter(b => b.dateEarned).sort((a, b) => new Date(b.dateEarned!).getTime() - new Date(a.dateEarned!).getTime()).slice(0, 4)
  
  const friendCount = friendState?.relationships?.filter((r: any) => r.status === 'accepted').length || 0
  const activeChats = Object.keys(chatState?.lastRead || {}).length

  return createPortal(
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: 'var(--bg-base)', 
      color: 'var(--text-main)',
      overflowY: 'auto'
    }}>
      {/* Botanical Background Elements */}
      <BackgroundLeaf top="-5%" right="-5%" rotate={-45} scale={2} opacity={0.3} />
      <BackgroundLeaf top="40%" left="-10%" rotate={45} scale={1.5} opacity={0.2} />
      <BackgroundLeaf bottom="-10%" right="20%" rotate={-15} scale={1.2} opacity={0.2} />
      
      <div style={{ position: 'fixed', right: '-10%', top: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, var(--accent-faint) 0%, transparent 70%)', opacity: 0.6, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1800px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem 4rem' }}>
        
        {/* HEADER & THEME CONTROLS */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LeafIcon size={24} filled={true} />
            <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.3em', margin: 0, color: 'var(--text-main)' }}>ARINOVA</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
             {/* Palette Toggle */}
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setColor('azure')} style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#526C88', border: color === 'azure' ? '2px solid var(--text-main)' : '2px solid transparent', cursor: 'pointer' }} title="Azure Palette" />
                <button onClick={() => setColor('crimson')} style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#8B4545', border: color === 'crimson' ? '2px solid var(--text-main)' : '2px solid transparent', cursor: 'pointer' }} title="Crimson Palette" />
             </div>
             
             <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
             
             {/* Light/Dark Toggle */}
             <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                {theme === 'light' ? 'Nightfall' : 'Daybreak'}
             </button>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1, marginTop: '4rem', position: 'relative' }}>
          
          {/* THE STEM (Navigation) */}
          <div style={{ width: '220px', position: 'relative', flexShrink: 0 }}>
             <div className="stem" style={{ position: 'absolute', right: '40px', top: '5%', bottom: '10%' }}>
                {[
                  { id: 'dashboard', label: 'Origin', top: '0%' },
                  { id: 'learning', label: 'Skill Tree', top: '20%' },
                  { id: 'projects', label: 'Branches', top: '40%' },
                  { id: 'goals', label: 'Buds', top: '60%' },
                  { id: 'friends', label: 'Network', top: '80%' },
                  { id: 'profile', label: 'Roots', top: '100%' },
                ].map((nav) => (
                  <div key={nav.id} style={{ position: 'absolute', top: nav.top, right: '-3px', width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2rem' }}>
                     <span 
                       onClick={() => onNavigate({ view: nav.id })}
                       style={{ 
                         fontFamily: 'var(--font-display)', 
                         fontSize: '1rem', 
                         color: nav.id === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-muted)',
                         cursor: 'pointer',
                         letterSpacing: '0.1em'
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                       onMouseLeave={(e) => { if (nav.id !== 'dashboard') e.currentTarget.style.color = 'var(--text-muted)' }}
                     >
                       {nav.label}
                     </span>
                     <div style={{ width: '30px', height: '1px', background: nav.id === 'dashboard' ? 'var(--accent-primary)' : 'transparent' }} />
                     <div className="leaf-node" style={{ right: '-3px', background: nav.id === 'dashboard' ? 'var(--accent-bloom)' : 'var(--stem-color)' }} />
                  </div>
                ))}
             </div>
          </div>

          {/* MAIN GARDEN (Content) */}
          <div style={{ flex: 1, paddingLeft: '5rem', paddingRight: '2rem' }}>
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                
                {/* HERO: PLAYER & EXPERIENCE */}
                <div style={{ marginBottom: '6rem', position: 'relative' }}>
                   
                   <p style={{ fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>
                      Cultivating Identity
                   </p>
                   <h2 style={{ fontSize: 'clamp(3rem, 4vw, 5rem)', color: 'var(--text-main)', lineHeight: 1, marginBottom: '2.5rem' }}>
                      {safeProfile.displayName}
                   </h2>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                      <div>
                         <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Growth Stage</p>
                         <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            Level {safeProgression.level} <FlowerIcon size={24} />
                         </h3>
                      </div>
                      
                      <div style={{ flex: 1, maxWidth: '500px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                            <span>Experience Root</span>
                            <span>{safeProgression.xp} / {(safeProgression.level || 1) * 1000} XP</span>
                         </div>
                         <div style={{ height: '1px', width: '100%', background: 'var(--border-color)', position: 'relative' }}>
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${Math.min(100, (safeProgression.xp / ((safeProgression.level || 1) * 1000)) * 100)}%` }} 
                              transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                              style={{ position: 'absolute', left: 0, top: '-0.5px', height: '2px', background: 'var(--accent-bloom)' }} 
                            />
                            {/* Tiny progress bud */}
                            <motion.div 
                              initial={{ left: 0, opacity: 0 }} 
                              animate={{ left: `${Math.min(100, (safeProgression.xp / ((safeProgression.level || 1) * 1000)) * 100)}%`, opacity: 1 }} 
                              transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                              style={{ position: 'absolute', top: '-3px', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-bloom)' }}
                            />
                            <div style={{ position: 'absolute', top: '-8px', right: '-12px', opacity: 0.5 }}>
                              <LeafIcon size={12} />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* ZONE 1: ACTIVE GROWTH */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
                   
                   {/* Projects */}
                   <div>
                      <ZoneHeader icon={Wind} title="Growing Branches" subtitle="Active Projects" />
                      <OrganicDivider />
                      {activeProject ? (
                        <BotanicalCard borderAccent="left">
                           <h5 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{activeProject.name}</h5>
                           <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '2rem' }}>{activeProject.description || 'Nurturing this branch...'}</p>
                           <button onClick={() => onNavigate({view: 'projects'})} className="organic-btn" style={{ fontSize: '0.65rem' }}>Prune & Grow</button>
                        </BotanicalCard>
                      ) : (
                        <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem' }}>No active branches growing.</p>
                      )}
                   </div>

                   {/* Goals */}
                   <div>
                      <ZoneHeader icon={Droplet} title="Developing Buds" subtitle="Current Objectives" />
                      <OrganicDivider />
                      {activeGoal ? (
                        <BotanicalCard borderAccent="right">
                           <h5 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{activeGoal.title}</h5>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                              <BudIcon size={16} />
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bloom expected: {activeGoal.targetDate}</span>
                           </div>
                           <button onClick={() => onNavigate({view: 'goals'})} className="organic-btn" style={{ fontSize: '0.65rem' }}>Nurture</button>
                        </BotanicalCard>
                      ) : (
                        <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem' }}>Awaiting new seeds.</p>
                      )}
                   </div>

                   {/* Learning / Skills */}
                   <div>
                      <ZoneHeader icon={Leaf} title="Cultivation" subtitle="Learning Focus" />
                      <OrganicDivider />
                      <BotanicalCard borderAccent="left">
                         {activeSkills.length > 0 ? (
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                              {activeSkills.map((skill, idx) => {
                                const totalLeaves = 5;
                                const filledLeaves = Math.max(1, Math.round((skill.progress / 100) * totalLeaves));
                                return (
                                  <div key={skill.id || idx}>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '1rem' }}>{skill.canonicalName || skill.name}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{skill.progress}%</span>
                                     </div>
                                     <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'var(--border-color)', zIndex: 0 }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 1, padding: '0 2px' }}>
                                           {Array.from({ length: totalLeaves }).map((_, i) => (
                                              <LeafIcon key={i} filled={i < filledLeaves} />
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                                )
                              })}
                           </div>
                         ) : (
                           <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem' }}>No skills currently blooming.</p>
                         )}
                      </BotanicalCard>
                   </div>
                </div>

                {/* ZONE 2 & 3: CONNECTIONS AND HISTORY */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', marginBottom: '8rem' }}>
                   
                   {/* Connections (Network/Chat) */}
                   <div>
                      <ZoneHeader icon={Network} title="Ecosystem" subtitle="Connections & Communications" />
                      <OrganicDivider />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '3px', height: '40px', background: 'var(--stem-color)', position: 'relative' }}>
                              <LeafIcon size={10} style={{ position: 'absolute', left: '-4px', top: '15px', opacity: 0.5 }} />
                            </div>
                            <div>
                               <div style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>{friendCount}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Established Roots</div>
                            </div>
                            <button onClick={() => onNavigate({view: 'friends'})} className="organic-btn" style={{ padding: '8px 16px', marginLeft: 'auto' }}>View</button>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ width: '3px', height: '40px', background: 'var(--stem-color)', position: 'relative' }}>
                              <LeafIcon size={10} style={{ position: 'absolute', left: '-4px', top: '15px', opacity: 0.5 }} />
                            </div>
                            <div>
                               <div style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                                  {(incomingRequestsCount || 0) + activeChats + (unreadMessagesCount || 0)}
                               </div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Signals</div>
                            </div>
                            <button onClick={() => onNavigate({view: 'chat'})} className="organic-btn" style={{ padding: '8px 16px', marginLeft: 'auto' }}>Communicate</button>
                         </div>
                      </div>
                   </div>

                   {/* Growth History (Achievements) */}
                   <div>
                      <ZoneHeader icon={Award} title="Growth History" subtitle="Recent Milestones" />
                      <OrganicDivider />
                      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                         {/* Vertical Timeline Stem */}
                         <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '1px', background: 'var(--stem-color)' }} />
                         
                         {recentBadges.length > 0 ? (
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                              {recentBadges.map((badge, idx) => (
                                 <div key={badge.id || idx} style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-2.2rem', top: '0', background: 'var(--bg-base)', padding: '4px' }}>
                                       <FlowerIcon size={18} />
                                    </div>
                                    <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>{badge.title}</h5>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blooming recorded: {badge.dateEarned}</p>
                                 </div>
                              ))}
                           </div>
                         ) : (
                           <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem' }}>No historical growth recorded.</p>
                         )}
                      </div>
                   </div>
                </div>

             </motion.div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}
