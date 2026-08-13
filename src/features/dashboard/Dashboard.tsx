import { motion } from 'framer-motion'
import { Target, Layers3, GraduationCap, Users, Trophy, MessageSquare, ArrowRight } from 'lucide-react'
import type { Progression, Project, Goal, Skill, Badge, FriendState, ChatState, UserProfile, Route } from '../../types'
import { calculateProgressToNextLevel } from '../../lib/progression'

type DashboardProps = {
  profile: UserProfile
  progression: Progression
  projects: Project[]
  goals: Goal[]
  skills: Skill[]
  badges: Badge[]
  friendState: FriendState
  chatState: ChatState
  incomingRequestsCount: number
  unreadMessagesCount: number
  onNavigate: (route: Route) => void
}

export function Dashboard({
  profile,
  progression,
  projects,
  goals,
  skills,
  badges,
  friendState,
  chatState,
  incomingRequestsCount,
  unreadMessagesCount,
  onNavigate
}: DashboardProps) {
  const { level, currentXp, requiredXp, progress } = calculateProgressToNextLevel(progression.xp)
  const remaining = requiredXp - currentXp

  const activeProjects = projects.filter(p => !p.completed).slice(0, 3)
  const pendingGoals = goals.filter(g => g.status !== 'COMPLETED').slice(0, 3)
  const activeSkills = skills.filter(s => s.status !== 'MASTERED').slice(0, 3)
  const unlockedBadges = badges.filter(b => b.earned).slice(-4).reverse()

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div className="dashboard-container" variants={container} initial="hidden" animate="show">
      
      {/* Welcome Section */}
      <motion.div variants={item} className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 3rem', background: 'linear-gradient(145deg, rgba(10,13,20,0.8) 0%, rgba(10,13,20,0.4) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', fontWeight: 600, color: '#fff', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Welcome back, <span style={{ color: 'var(--cyan)' }}>{profile.displayName}</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '0.01em' }}>System initialized. Ready to quantify your growth.</p>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', width: '320px', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Level <strong style={{ color: '#fff', fontSize: '1.2rem', marginLeft: '0.5rem' }}>{level}</strong></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>{remaining} XP to Next</span>
          </div>
          <div className="progress-bar" style={{ height: '6px', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ height: '100%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>
            <span>{currentXp} XP</span>
            <span>{requiredXp} XP</span>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Projects Summary */}
        <motion.div variants={item} className="panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}><Layers3 size={18} color="var(--cyan)" /> Active Projects</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => onNavigate({ view: 'projects' })}><ArrowRight size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeProjects.length > 0 ? activeProjects.map(p => (
              <div key={p.id} onClick={() => onNavigate({ view: 'project_detail', id: p.id })} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent', transition: 'border 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{p.name}</h4>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.progress}%`, background: 'var(--cyan)', height: '100%', boxShadow: '0 0 8px var(--cyan)' }} />
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No active projects.</p>}
          </div>
        </motion.div>

        {/* Goals Summary */}
        <motion.div variants={item} className="panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}><Target size={18} color="var(--primary)" /> Current Goals</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => onNavigate({ view: 'goals' })}><ArrowRight size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingGoals.length > 0 ? pendingGoals.map(g => (
              <div key={g.id} onClick={() => onNavigate({ view: 'goals' })} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent', transition: 'border 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{g.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: g.priority === 'High' ? 'var(--danger)' : 'var(--text-muted)' }}>{g.priority} Priority</span>
                  <span>Target: {g.targetDate}</span>
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No pending goals.</p>}
          </div>
        </motion.div>

        {/* Skills Summary */}
        <motion.div variants={item} className="panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}><GraduationCap size={18} color="#a855f7" /> Learning Focus</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => onNavigate({ view: 'learning' })}><ArrowRight size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeSkills.length > 0 ? activeSkills.map(s => (
              <div key={s.id} onClick={() => onNavigate({ view: 'skill_detail', id: s.id })} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent', transition: 'border 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{s.name}</h4>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.progress}%`, background: '#a855f7', height: '100%', boxShadow: '0 0 8px #a855f7' }} />
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>Not learning any new skills.</p>}
          </div>
        </motion.div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Network & Activity */}
        <motion.div variants={item} className="panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>Social Intelligence</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div onClick={() => onNavigate({ view: 'friends' })} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s', position: 'relative' }} onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}} onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}}>
              <Users size={28} color="var(--cyan)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, color: '#fff' }}>{friendState.relationships.filter(r => r.status === 'accepted').length}</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Peers</span>
              {incomingRequestsCount > 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' }}>{incomingRequestsCount} pending</div>}
            </div>
            <div onClick={() => onNavigate({ view: 'chat' })} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s', position: 'relative' }} onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}} onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}}>
              <MessageSquare size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, color: '#fff' }}>{chatState.messages.length}</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Comms Synced</span>
              {unreadMessagesCount > 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--cyan)', color: '#000', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{unreadMessagesCount} unread</div>}
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={item} className="panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}><Trophy size={18} color="var(--gold)" /> Acquired Milestones</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => onNavigate({ view: 'achievements' })}><ArrowRight size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>
            {unlockedBadges.map(b => (
              <div 
                key={b.id} 
                onClick={() => onNavigate({ view: 'badge_detail', id: b.id })}
                title={b.title}
                style={{
                  width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem',
                  border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)' }}
              >
                <span>{b.icon}</span>
              </div>
            ))}
            {unlockedBadges.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%', textAlign: 'center', paddingTop: '2rem' }}>No milestones verified yet.</p>}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
