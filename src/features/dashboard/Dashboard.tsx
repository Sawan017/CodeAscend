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
    <motion.div className="dashboard-container" variants={container} initial="hidden" animate="show">
      
      {/* Welcome Section */}
      <motion.div variants={item} className="dashboard-hero">
        <div>
          <h1>Welcome back, {profile.displayName}!</h1>
          <p>Ready to level up your career today?</p>
        </div>
        
        <div className="dashboard-level-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
            <span className="eyebrow">LEVEL {level}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{remaining} XP to next</span>
          </div>
          <div className="progress-bar" style={{ height: '8px', marginBottom: '0.75rem' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--blue), var(--cyan))', boxShadow: 'var(--glow-cyan)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>{currentXp} XP</span>
            <span>{requiredXp} XP</span>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-grid">
        
        {/* Projects Summary */}
        <motion.div variants={item} className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3><Layers3 size={20} color="var(--cyan)" /> Active Projects</h3>
            <button className="icon-button" onClick={() => onNavigate({ view: 'projects' })}><ArrowRight size={18} /></button>
          </div>
          <div className="dashboard-item-list">
            {activeProjects.length > 0 ? activeProjects.map(p => (
              <div key={p.id} className="dashboard-item" onClick={() => onNavigate({ view: 'project_detail', id: p.id })}>
                <h4>{p.name}</h4>
                <div className="progress-bar" style={{ height: '4px' }}><div style={{ width: `${p.progress}%`, background: 'var(--cyan)', height: '100%' }} /></div>
              </div>
            )) : <p className="muted" style={{ margin: 'auto' }}>No active projects.</p>}
          </div>
        </motion.div>

        {/* Goals Summary */}
        <motion.div variants={item} className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3><Target size={20} color="var(--primary)" /> Current Goals</h3>
            <button className="icon-button" onClick={() => onNavigate({ view: 'goals' })}><ArrowRight size={18} /></button>
          </div>
          <div className="dashboard-item-list">
            {activeGoals.length > 0 ? activeGoals.map(g => (
              <div key={g.id} className="dashboard-item" onClick={() => onNavigate({ view: 'goal_detail', id: g.id })}>
                <h4>{g.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>{g.priority} Priority</span>
                  <span>Due {g.deadline}</span>
                </div>
              </div>
            )) : <p className="muted" style={{ margin: 'auto' }}>No active goals.</p>}
          </div>
        </motion.div>

        {/* Skills Summary */}
        <motion.div variants={item} className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3><GraduationCap size={20} color="var(--accent-gamification)" /> Learning Focus</h3>
            <button className="icon-button" onClick={() => onNavigate({ view: 'learning' })}><ArrowRight size={18} /></button>
          </div>
          <div className="dashboard-item-list">
            {activeSkills.length > 0 ? activeSkills.map(s => (
              <div key={s.id} className="dashboard-item" onClick={() => onNavigate({ view: 'skill_detail', id: s.id })}>
                <h4>{s.name}</h4>
                <div className="progress-bar" style={{ height: '4px' }}><div style={{ width: `${s.progress}%`, background: 'var(--accent-gamification)', height: '100%' }} /></div>
              </div>
            )) : <p className="muted" style={{ margin: 'auto' }}>Not learning any new skills.</p>}
          </div>
        </motion.div>

      </div>

      <div className="dashboard-grid">
        
        {/* Network & Activity */}
        <motion.div variants={item} className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3>Social Activity</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
            <div className="dashboard-stat-card" onClick={() => onNavigate({ view: 'friends' })}>
              <Users size={28} color="var(--cyan)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h2>{friendState.relationships.filter(r => r.status === 'accepted').length}</h2>
              <span className="muted">Friends</span>
              {incomingRequestsCount > 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' }}>{incomingRequestsCount} pending</div>}
            </div>
            <div className="dashboard-stat-card" onClick={() => onNavigate({ view: 'chat' })}>
              <MessageSquare size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h2>{chatState.messages.length}</h2>
              <span className="muted">Total Msgs</span>
              {unreadMessagesCount > 0 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--cyan)', color: '#000', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px' }}>{unreadMessagesCount} unread</div>}
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={item} className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3><Trophy size={20} color="var(--gold)" /> Recent Milestones</h3>
            <button className="icon-button" onClick={() => onNavigate({ view: 'achievements' })}><ArrowRight size={18} /></button>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {unlockedBadges.map(b => (
              <div 
                key={b.id} 
                className="dashboard-badge-token"
                onClick={() => onNavigate({ view: 'badge_detail', id: b.id })}
                title={b.title}
              >
                <span>{b.icon}</span>
              </div>
            ))}
            {unlockedBadges.length === 0 && <p className="muted" style={{ margin: 'auto' }}>No badges earned yet.</p>}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
