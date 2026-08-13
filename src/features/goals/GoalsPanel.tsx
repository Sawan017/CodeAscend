import { motion } from 'framer-motion'
import { Plus, Trash2, Target } from 'lucide-react'
import { useState } from 'react'
import type { Goal, GoalPriority, ActiveSessionState } from '../../types'
import { CustomSelect } from '../../components/CustomSelect'
import { CustomDatePicker } from '../../components/CustomDatePicker'
import { KnowledgeCheckModal } from '../../components/KnowledgeCheckModal'
import { calculateMinimumVerificationTime } from '../../lib/progression'



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

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  

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
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'rgba(10,13,20,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Strategic Objectives</p>
          <button style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: 'var(--cyan)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setShowForm((v) => !v)} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(6,182,212,0.3)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; e.currentTarget.style.boxShadow = 'none' }} aria-label="Add goal"><Plus size={16} /></button>
        </div>
        {showForm && (
          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
            <input placeholder="Objective designation..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input placeholder="Parameters (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', marginTop: '1rem', transition: 'all 0.2s', outline: 'none' }} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <CustomSelect 
                label="Sector"
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

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Date</label>
              <CustomDatePicker value={targetDate} onChange={setTargetDate} />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }} onClick={() => setShowForm(false)} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Cancel</button>
              <button style={{ padding: '0.75rem 1.5rem', background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255,255,255,0.1)' }} onClick={submitGoal} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>Initialize Objective</button>
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
                <strong style={{ fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.01em' }}>{goal.title}</strong>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s', padding: '4px' }} onClick={() => onRemoveGoal(goal.id)} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} aria-label={`Delete ${goal.title}`}><Trash2 size={16} /></button>
              </div>
              {goal.description && <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{goal.description}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {goal.category && <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Sector: {goal.category}</span>}
                <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Target: {goal.targetDate}</span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button className="secondary-btn" onClick={() => onCompleteGoal(goal.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Mark Completed</button>
              </div>
            </motion.div>
          ))}
          {goals.length === 0 && <p className="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>No goals found. Create one above.</p>}
        </motion.div>
        </div>
        
        <motion.div className="panel" style={{ padding: '1.5rem', background: 'rgba(3,4,7,0.7)', border: '1px solid rgba(255,255,255,0.08)' }} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--cyan)', margin: '0 0 1.5rem 0', textTransform: 'uppercase' }}>Active Target</p>
          
          {activeSession ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{activeSession.subtopic.title}</h3>
                {activeSession.subtopic.domain && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{activeSession.subtopic.domain}</p>}
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sector</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{activeSession.subtopic.category || 'Learning'}</strong>
                  </div>
                  {activeSession.subtopic.difficulty && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class</span>
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{activeSession.subtopic.difficulty}</strong>
                    </div>
                  )}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Time</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{activeSession.baselineTime} min</strong>
                  </div>
                </div>

                {(() => {
                  const teachingSeconds = (activeSession.teachingMinutes || 60) * 60;
                  const solvingSeconds = (activeSession.solvingBaselineMinutes || 25) * 60;
                  const baseXP = activeSession.subtopic.baseXP || 88;
                  const elapsed = activeSessionElapsed ?? 0;

                  const tiers = [
                    { name: 'PRIME',    xp: Math.floor(baseXP * 2.5),  limit: teachingSeconds + (solvingSeconds * 0.5), hasLimit: true  },
                    { name: 'FOCUSED',  xp: Math.floor(baseXP * 1.75), limit: teachingSeconds + solvingSeconds,          hasLimit: true  },
                    { name: 'EXTENDED', xp: baseXP,                     limit: Infinity,                                  hasLimit: false }
                  ];

                  return (
                    <>
                      <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Reward Thresholds</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                          {tiers.map((tier, idx) => {
                            const isActive = elapsed <= tier.limit;
                            const prevLimit = idx === 0 ? 0 : tiers[idx - 1].limit;
                            const minStr = Math.floor(prevLimit / 60);
                            const timeLabel = tier.hasLimit ? `${minStr}–${Math.floor(tier.limit / 60)}m` : `${minStr}m+`;

                            return (
                              <div
                                key={tier.name}
                                style={{
                                  padding: '1rem 0.5rem',
                                  background: isActive ? 'linear-gradient(180deg, rgba(6,182,212,0.1) 0%, rgba(6,182,212,0.02) 100%)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${isActive ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`,
                                  borderRadius: '12px',
                                  textAlign: 'center',
                                  opacity: isActive ? 1 : 0.4,
                                  transition: 'all 0.5s ease',
                                  boxShadow: isActive ? '0 0 15px rgba(6,182,212,0.1)' : 'none'
                                }}
                              >
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: isActive ? '#fff' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                  {tier.name}
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isActive ? 'var(--cyan)' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                  +{tier.xp}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                  {timeLabel}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Time Elapsed</p>
                  <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', textShadow: '0 0 20px var(--cyan)', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(activeSessionElapsed ?? 0)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(() => {
                  const teachingSeconds = (activeSession.teachingMinutes || 60) * 60;
                  const solvingSeconds = (activeSession.solvingBaselineMinutes || 25) * 60;
                  const primeSeconds = teachingSeconds + (solvingSeconds * 0.5);
                  const minVerificationTime = calculateMinimumVerificationTime(primeSeconds);
                  const effectiveElapsed = activeSessionElapsed ?? 0;
                  const canComplete = effectiveElapsed >= minVerificationTime;

                  if (canComplete) {
                    return (
                      <button className="primary-btn" onClick={() => setShowKnowledgeCheck(true)} style={{ padding: '1rem' }}>Complete Task</button>
                    )
                  } else {
                    const remaining = minVerificationTime - effectiveElapsed;
                    return (
                      <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verification sequence locked. Continue immersion for <strong>{Math.ceil(remaining/60)}</strong> min.</p>
                      </div>
                    )
                  }
                })()}
                <button style={{ padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onClick={() => setShowCancelDialog(true)} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-muted)' }}>Abort Sequence</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px', opacity: 0.5 }}>
              <Target size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No active target. Initialize a learning sequence from the Knowledge Base.</p>
            </div>
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

      {showKnowledgeCheck && activeSession && (
        <KnowledgeCheckModal 
          activeSession={activeSession} 
          onPass={() => {
            setShowKnowledgeCheck(false)
            onCompleteActiveSession?.()
          }}
          onCancel={() => setShowKnowledgeCheck(false)}
        />
      )}
    </div>
  )
}