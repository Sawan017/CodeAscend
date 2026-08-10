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
  const activeGoals = goals.filter(g => g.status !== 'COMPLETED').slice(0, 3)
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
    <motion.div className="dashboard-container" variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Section */}
      <motion.div variants={item} className="panel hero-panel" style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.1), transparent)', border: '1px solid var(--cyan)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Welcome back, {profile.displayName}!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Ready to level up your career today?</p>
          </div>
          
          <div style={{ background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', minWidth: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <span className="eyebrow">LEVEL {level}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{remaining} XP to next level</span>
            </div>
            <div className="progress-bar" style={{ height: '8px', marginBottom: '0.5rem' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--blue), var(--cyan))', boxShadow: 'var(--glow-cyan)' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>{currentXp} XP</span>
              <span>{requiredXp} XP</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Projects Summary */}
        <motion.div variants={item} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers3 size={20} color="var(--cyan)" />
              <h3 style={{ margin: 0 }}>Active Projects</h3>
            </div>
            <button className="icon-button" onClick={() => onNavigate({ view: 'projects' })}><ArrowRight size={16} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {activeProjects.length > 0 ? activeProjects.map(p => (
              <div key={p.id} className="dashboard-list-item" onClick={() => onNavigate({ view: 'project_detail', id: p.id })} style={{ cursor: 'pointer', padding: '1rem', background: 'var(--surface-sunken)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{p.name}</h4>
                  <div className="progress-bar" style={{ height: '4px' }}><div style={{ width: `${p.progress}%`, background: 'var(--cyan)', height: '100%' }} /></div>
                </div>
              </div>
            )) : <p className="muted" style={{ margin: 'auto' }}>No active projects.</p>}
          </div>
        </motion.div>

        {/* Goals Summary */}
        <motion.div variants={item} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Current Goals</h3>
            </div>
            <button className="icon-button" onClick={() => onNavigate({ view: 'goals' })}><ArrowRight size={16} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {activeGoals.length > 0 ? activeGoals.map(g => (
              <div key={g.id} className="dashboard-list-item" onClick={() => onNavigate({ view: 'goal_detail', id: g.id })} style={{ cursor: 'pointer', padding: '1rem', background: 'var(--surface-sunken)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{g.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{g.priority} Priority</span>
                    <span>Due {g.deadline}</span>
                  </div>
                </div>
              </div>
            )) : <p className="muted" style={{ margin: 'auto' }}>No active goals.</p>}
          </div>
        </motion.div>

        {/* Skills Summary */}
        <motion.div variants={item} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--purple)" />
              <h3 style={{ margin: 0 }}>Learning Focus</h3>
            </div>
            <button className="icon-button" onClick={() => onNavigate({ view: 'learning' })}><ArrowRight size={16} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {activeSkills.length > 0 ? activeSkills.map(s => (
              <div key={s.id} className="dashboard-list-item" onClick={() => onNavigate({ view: 'skill_detail', id: s.id })} style={{ cursor: 'pointer', padding: '1rem', background: 'var(--surface-sunken)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{s.name}</h4>
                  <div className="progress-bar" style={{ height: '4px' }}><div style={{ width: `${s.progress}%`, background: 'var(--purple)', height: '100%' }} /></div>
                </div>
              </div>
            )) : <p className="muted" style={{ margin: 'auto' }}>Not learning any new skills.</p>}
          </div>
        </motion.div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Network & Activity */}
        <motion.div variants={item} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Social Activity</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div 
              className="dashboard-stat-card" 
              onClick={() => onNavigate({ view: 'friends' })}
              style={{ cursor: 'pointer', padding: '1.5rem', background: 'var(--surface-sunken)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', position: 'relative' }}
            >
              <Users size={24} color="var(--text)" style={{ margin: '0 auto 0.5rem auto' }} />
              <h2 style={{ margin: '0 0 0.25rem 0' }}>{friendState.relationships.filter(r => r.status === 'accepted').length}</h2>
              <span className="muted">Friends</span>
              {incomingRequestsCount > 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}>{incomingRequestsCount} pending</div>}
            </div>
            <div 
              className="dashboard-stat-card" 
              onClick={() => onNavigate({ view: 'chat' })}
              style={{ cursor: 'pointer', padding: '1.5rem', background: 'var(--surface-sunken)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', position: 'relative' }}
            >
              <MessageSquare size={24} color="var(--text)" style={{ margin: '0 auto 0.5rem auto' }} />
              <h2 style={{ margin: '0 0 0.25rem 0' }}>{chatState.messages.length}</h2>
              <span className="muted">Total Msgs</span>
              {unreadMessagesCount > 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--cyan)', color: '#000', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}>{unreadMessagesCount} unread</div>}
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={item} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} color="#FDB931" />
              <h3 style={{ margin: 0 }}>Recent Milestones</h3>
            </div>
            <button className="icon-button" onClick={() => onNavigate({ view: 'achievements' })}><ArrowRight size={16} /></button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {unlockedBadges.map(b => (
              <div 
                key={b.id} 
                onClick={() => onNavigate({ view: 'badge_detail', id: b.id })}
                style={{ 
                  cursor: 'pointer', minWidth: '80px', height: '80px', 
                  background: 'var(--surface-sunken)', borderRadius: '16px', 
                  border: '1px solid var(--border)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--glow-cyan)'
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>{b.icon}</span>
              </div>
            ))}
            {unlockedBadges.length === 0 && <p className="muted" style={{ margin: 'auto' }}>No badges earned yet.</p>}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
