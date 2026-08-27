import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Rocket, Folder, BookOpen, Target, Award, MessageSquare, User, Hexagon, Activity } from 'lucide-react'
import type { UserProfile, Progression, Project, Goal, Skill, Badge } from '../../types'

type PrototypeHubProps = {
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

export function PrototypeHub({ profile, progression, projects, goals, skills, badges, onNavigate }: PrototypeHubProps) {
  const activeProject = (projects || []).find(p => p.progress > 0 && p.progress < 100)
  const activeGoal = (goals || []).find(g => g.status === 'ACTIVE')
  const recentBadges = [...(badges || [])].filter(b => b.dateEarned).sort((a, b) => new Date(b.dateEarned!).getTime() - new Date(a.dateEarned!).getTime()).slice(0, 3)
  const safeSkills = skills || []
  const safeProgression = progression || { xp: 0, level: 1, nextLevelXP: 1000 }
  const safeProfile = profile || { displayName: 'User', username: 'User' }

  return createPortal(
    <div style={{ 
      background: '#050505', 
      color: '#e5e5e5', 
      position: 'fixed', 
      inset: 0, 
      zIndex: 9999, 
      overflowY: 'auto', 
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 68, 0, 0.05) 0%, transparent 70%), linear-gradient(0deg, #050505 0%, #050505 100%)'
    }}>
      {/* Grid Pattern Overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP COMMAND BAR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem', marginBottom: '4rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <Hexagon size={24} color="#ff4400" fill="rgba(255,68,0,0.1)" />
             <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff' }}>
               Arinova<span style={{ color: '#ff4400' }}>_OS</span>
             </span>
           </div>
           <div style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
             <span style={{ color: '#666' }}>SYNC: <span style={{ color: '#fff' }}>{new Date().toLocaleDateString()}</span></span>
             <span style={{ color: '#666' }}>STATUS: <span style={{ color: '#ff4400' }}>ONLINE</span></span>
           </div>
        </header>

        {/* MAIN SPATIAL CANVAS */}
        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '4rem', alignItems: 'center', paddingBottom: '8rem' }}>
           
           {/* LEFT COLUMN: Current Trajectory */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#ff4400' }}>
                    <Activity size={18} />
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Current Trajectory</span>
                 </div>
                 {activeGoal ? (
                   <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem' }}>
                     <h3 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#fff', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>{activeGoal.title}</h3>
                     <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>{activeGoal.description || 'No parameters defined.'}</p>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.7rem', color: '#ff4400', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TGT: {activeGoal.targetDate}</span>
                       <button onClick={() => onNavigate({view: 'goals'})} style={{ background: '#ff4400', color: '#000', border: 'none', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>Engage</button>
                     </div>
                   </div>
                 ) : (
                   <div style={{ color: '#444', fontSize: '0.9rem', borderLeft: '2px solid #222', paddingLeft: '1rem' }}>Awaiting new objectives.</div>
                 )}
              </motion.div>

              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#666' }}>
                    <Folder size={18} />
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Active Build</span>
                 </div>
                 {activeProject ? (
                   <div>
                     <h3 style={{ fontSize: '1.15rem', fontWeight: 400, color: '#fff', margin: '0 0 1rem 0' }}>{activeProject.name}</h3>
                     <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '2px', background: '#fff', width: `${activeProject.progress}%`, marginTop: '-0.5px' }} />
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                       <span>Progress</span>
                       <span style={{ color: '#fff' }}>{activeProject.progress}%</span>
                     </div>
                   </div>
                 ) : (
                   <div style={{ color: '#444', fontSize: '0.9rem', borderLeft: '2px solid #222', paddingLeft: '1rem' }}>No builds in progress.</div>
                 )}
              </motion.div>
           </div>

           {/* CENTER COLUMN: The Core (Identity & Level) */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                 <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>Welcome Back</div>
                 <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', margin: '0 0 4rem 0' }}>
                   {safeProfile.displayName || safeProfile.username}
                 </h1>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} style={{ position: 'relative' }}>
                 {/* Decorative rings */}
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '320px', height: '320px', borderRadius: '50%', border: '1px dashed rgba(255,68,0,0.2)', pointerEvents: 'none' }} />
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '240px', height: '240px', background: '#050505', border: '1px solid rgba(255,68,0,0.5)', borderRadius: '50%', position: 'relative', zIndex: 2, boxShadow: '0 0 60px rgba(255,68,0,0.1), inset 0 0 40px rgba(255,68,0,0.05)' }}>
                    <span style={{ fontSize: '0.7rem', color: '#ff4400', textTransform: 'uppercase', letterSpacing: '0.3em', position: 'absolute', top: '2rem' }}>Rank</span>
                    <span style={{ fontSize: '7rem', fontWeight: 300, fontFamily: 'monospace', color: '#fff', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>{safeProgression.level}</span>
                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.2em', position: 'absolute', bottom: '2.5rem' }}>{safeProgression.xp} / {(safeProgression.level || 1) * 1000} XP</span>
                 </div>
              </motion.div>
           </div>

           {/* RIGHT COLUMN: Intel & Records */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'flex-end', textAlign: 'right' }}>
              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.5rem', color: '#666' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Acquired Intel</span>
                    <BookOpen size={18} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                    {safeSkills.filter(s => s.progress === 100).slice(0, 3).map(skill => (
                      <div key={skill.id} style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {skill.canonicalName || skill.name}
                        <div style={{ width: '4px', height: '4px', background: '#ff4400', borderRadius: '50%' }} />
                      </div>
                    ))}
                    {safeSkills.filter(s => s.progress === 100).length === 0 && (
                      <div style={{ color: '#444', fontSize: '0.9rem' }}>No verified skills yet.</div>
                    )}
                 </div>
              </motion.div>

              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.5rem', color: '#666' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Recent Records</span>
                    <Award size={18} />
                 </div>
                 <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    {recentBadges.map(badge => (
                      <div key={badge.id} style={{ width: '64px', height: '64px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer' }} title={badge.title}>
                        <Award size={24} color={badge.rarity === "Common" ? '#ff4400' : '#fff'} />
                      </div>
                    ))}
                    {recentBadges.length === 0 && (
                      <div style={{ color: '#444', fontSize: '0.9rem' }}>No records unlocked.</div>
                    )}
                 </div>
              </motion.div>
           </div>

        </main>

        {/* BOTTOM COMMAND DOCK */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }} style={{ position: 'fixed', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
           <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)', padding: '0.75rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
             {[
               { id: 'dashboard', icon: Rocket, label: 'Core' },
               { id: 'projects', icon: Folder, label: 'Builds' },
               { id: 'learning', icon: BookOpen, label: 'Intel' },
               { id: 'goals', icon: Target, label: 'Targets' },
               { id: 'achievements', icon: Award, label: 'Records' },
               { id: 'friends', icon: MessageSquare, label: 'Comms' },
               { id: 'profile', icon: User, label: 'Identity' },
             ].map(nav => (
               <button 
                 key={nav.id} 
                 onClick={() => {
                    if (nav.id !== 'dashboard') {
                      onNavigate({view: nav.id});
                    }
                 }} 
                 style={{ 
                   background: nav.id === 'dashboard' ? 'rgba(255,68,0,0.1)' : 'transparent', 
                   border: 'none', 
                   color: nav.id === 'dashboard' ? '#ff4400' : '#888', 
                   cursor: 'pointer', 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '0.5rem', 
                   padding: '0.75rem 1.5rem',
                   borderRadius: '100px',
                   transition: 'all 0.2s',
                   outline: 'none'
                 }}
                 onMouseEnter={(e) => { if(nav.id !== 'dashboard') { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                 onMouseLeave={(e) => { if(nav.id !== 'dashboard') { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent' } }}
               >
                  <nav.icon size={18} />
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>{nav.label}</span>
               </button>
             ))}
           </div>
        </motion.div>

      </div>
    </div>,
    document.body
  )
}
