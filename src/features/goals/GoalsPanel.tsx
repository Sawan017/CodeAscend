import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Goal, GoalPriority, ActiveSessionState } from '../../types'
import { CustomSelect } from '../../components/CustomSelect'
import { CustomDatePicker } from '../../components/CustomDatePicker'


type GoalsPanelProps = {
  goals: Goal[]
  onCompleteGoal: (id: string) => void
  onAddGoal: (goal: Goal) => void
  onRemoveGoal: (id: string) => void

  activeSession?: ActiveSessionState | null
  activeSessionElapsed?: number
  onOpenActiveSession?: () => void
  onCompleteActiveSession?: () => void
  onCancelActiveSession?: () => void
}

function createId() {
  return `goal-${Date.now()}`
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function GoalsPanel({
  goals,
  onCompleteGoal,
  onAddGoal,
  onRemoveGoal,

  activeSession,
  activeSessionElapsed,
  onCompleteActiveSession,
  onCancelActiveSession
}: GoalsPanelProps) {

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Learning')
  const [priority, setPriority] = useState<GoalPriority>('Medium')
  const [targetDate, setTargetDate] = useState('')

  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const submitGoal = () => {
    if (!title.trim()) return
    onAddGoal({
      id: createId(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      targetDate: targetDate || '2027-12-31',
      milestones: [],
      status: 'ACTIVE',
      notes: '',
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setTitle('')
    setDescription('')
    setCategory('Learning')
    setPriority('Medium')
    setTargetDate('')
    setShowForm(false)

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <div className="section-shell split-shell">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="card-heading">
          <p className="eyebrow">GOALS</p>
          <button className="icon-button" onClick={() => setShowForm((v) => !v)} aria-label="Add goal"><Plus size={16} /></button>
        </div>
        {showForm && (
          <div className="goal-form">
            <input className="text-input" placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }} />
            <input className="text-input" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', marginTop: '1rem' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <CustomSelect 
                label="Category"
                value={category} 
                onChange={setCategory}
                options={[
                  { value: 'Learning', label: 'Learning' },
                  { value: 'Projects', label: 'Projects' },
                  { value: 'Career', label: 'Career' },
                  { value: 'Health', label: 'Health' }
                ]}
              />
              <CustomSelect 
                label="Priority"
                value={priority} 
                onChange={(val) => setPriority(val as GoalPriority)}
                options={[
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' }
                ]}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Date</label>
              <CustomDatePicker value={targetDate} onChange={setTargetDate} />
            </div>

            <div className="action-row" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="secondary-btn" onClick={submitGoal}>Save goal</button>
              <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <motion.div 
          className="goal-list"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {[...goals].sort((a, b) => {
            // First sort by target date
            const dateA = a.targetDate || '9999-12-31'
            const dateB = b.targetDate || '9999-12-31'
            if (dateA !== dateB) return dateA.localeCompare(dateB)
            
            // Second sort by priority
            const priorityWeight = { High: 1, Medium: 2, Low: 3 }
            const weightA = priorityWeight[a.priority as GoalPriority] || 2
            const weightB = priorityWeight[b.priority as GoalPriority] || 2
            return weightA - weightB
          }).map((goal) => (
            <motion.div 
              key={goal.id} 
              variants={item}
              className="goal-card"
              style={{ cursor: 'default', display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '0.75rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <strong style={{ fontSize: '1.1rem' }}>{goal.title}</strong>
                <button className="icon-button" style={{ padding: '4px', opacity: 0.6 }} onClick={() => onRemoveGoal(goal.id)} aria-label={`Delete ${goal.title}`}><Trash2 size={16} /></button>
              </div>
              {goal.description && <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{goal.description}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {goal.category && <span>Category: {goal.category}</span>}
                <span>Target Date: {goal.targetDate}</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <button className="secondary-btn" onClick={() => onCompleteGoal(goal.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Mark as Done</button>
              </div>
            </motion.div>
          ))}
          {goals.length === 0 && <p className="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>No goals found. Create one above.</p>}
        </motion.div>
        </div>
        
        <motion.div className="panel detail-panel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <p className="eyebrow">ACTIVE TARGET</p>
          
          {activeSession ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.25rem' }}>{activeSession.subtopic.title}</h3>
                {activeSession.subtopic.domain && <p className="copy">{activeSession.subtopic.domain}</p>}
                
                <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  <p style={{ margin: '0.25rem 0' }}>{activeSession.subtopic.category || 'Learning'}</p>
                  {activeSession.subtopic.difficulty && (
                    <p style={{ margin: '0.25rem 0' }}>Difficulty: <strong style={{ color: 'var(--text-main)' }}>{activeSession.subtopic.difficulty}</strong></p>
                  )}
                  <p style={{ margin: '0.25rem 0' }}>Baseline: <strong style={{ color: 'var(--text-main)' }}>{activeSession.baselineTime} min</strong></p>
                </div>

                {(() => {
                  const baselineSeconds = activeSession.baselineTime * 60;
                  const baseXP = activeSession.subtopic.baseXP || 50;
                  const elapsed = activeSessionElapsed ?? 0;
                  
                  const tiers = [
                    { name: 'PRIME', xp: Math.floor(baseXP * 1.5), limit: baselineSeconds * 0.5 },
                    { name: 'FOCUSED', xp: Math.floor(baseXP * 1.2), limit: baselineSeconds },
                    { name: 'EXTENDED', xp: baseXP, limit: baselineSeconds * 1.5 }
                  ];

                  return (
                    <div style={{ marginTop: '1.5rem' }}>
                      <p className="eyebrow" style={{ marginBottom: '1rem' }}>REWARD TIERS</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {tiers.map((tier, idx) => {
                          const isActive = elapsed <= tier.limit;
                          const prevLimit = idx === 0 ? 0 : tiers[idx - 1].limit;
                          const minStr = Math.floor(prevLimit / 60);
                          const maxStr = Math.floor(tier.limit / 60);
                          
                          return (
                            <div 
                              key={tier.name}
                              style={{ 
                                padding: '1rem 0.5rem', 
                                background: isActive ? 'var(--bg-surface)' : 'rgba(0,0,0,0.1)',
                                border: `1px solid ${isActive ? 'var(--cyan)' : 'var(--border)'}`,
                                borderRadius: '8px',
                                textAlign: 'center',
                                opacity: isActive ? 1 : 0.4,
                                transition: 'all 0.5s ease',
                                boxShadow: isActive ? 'var(--glow-cyan)' : 'none'
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                {isActive ? '✦ ' : '· '}{tier.name}
                              </div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isActive ? 'var(--cyan)' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                +{tier.xp} XP
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {minStr}–{maxStr} min
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>TIME ELAPSED</p>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'monospace' }}>
                    {formatTime(activeSessionElapsed ?? 0)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="primary-btn" onClick={onCompleteActiveSession} style={{ padding: '1rem' }}>Complete Task</button>
                <button className="secondary-btn" onClick={() => setShowCancelDialog(true)} style={{ color: '#ff453a', borderColor: 'rgba(255, 69, 58, 0.3)' }}>Cancel Task</button>
              </div>
            </div>
          ) : (
            <p className="muted" style={{ marginTop: '1rem' }}>No active target. Start a learning subtopic to see it here.</p>
          )}
        </motion.div>
      </div>

      {showCancelDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--bg-panel)', padding: '2rem', borderRadius: '16px', maxWidth: '400px', border: '1px solid var(--border-strong)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#ff453a' }}>Cancel this learning task?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
              Your current active session will be discarded. No XP will be awarded.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowCancelDialog(false)} 
                style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-main)', borderRadius: '8px', border: '1px solid var(--border-strong)', cursor: 'pointer', fontWeight: 600 }}
              >
                Keep Learning
              </button>
              <button 
                onClick={() => {
                  setShowCancelDialog(false)
                  onCancelActiveSession?.()
                }} 
                style={{ padding: '0.75rem 1.5rem', background: '#ff453a', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel Task
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}