import { motion } from 'framer-motion'
import { Plus, Edit2, Check, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Skill, SubtopicProgress, SubtopicDifficulty } from '../../types'
import { resolveSkill, formatEstimatedTime, DIFFICULTY_MULTIPLIERS } from '../../data/learningData'

type SkillsPanelProps = {
  skills: Skill[]
  selectedSkillId: string
  onSelectSkill: (id: string) => void
  onAddSkill?: (skill: Skill) => void
  onRemoveSkill?: (id: string) => void
  onUpdateSkillNotes?: (id: string, notes: string) => void
  onStartSubtopic?: (skillId: string, subtopicId: string, difficulty: SubtopicDifficulty, time: number, xp: number) => void
  onCompleteSubtopic?: (skillId: string, subtopicId: string) => void
}

export function SkillsPanel({
  skills,
  selectedSkillId,
  onSelectSkill,
  onAddSkill,
  onRemoveSkill,
  onUpdateSkillNotes,
  onStartSubtopic,
  onCompleteSubtopic,
}: SkillsPanelProps) {
  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? skills[0]
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesInput, setNotesInput] = useState('')
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  
  // Subtopic modal state
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicProgress | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<SubtopicDifficulty>('Normal')
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({})

  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => ({ ...prev, [domain]: !prev[domain] }))
  }

  const handleCreateSkill = () => {
    if (!name.trim()) return
    const resolved = resolveSkill(name.trim())
    const newSkill: Skill = {
      id: resolved.id,
      name: resolved.canonicalName,
      canonicalName: resolved.canonicalName,
      type: resolved.type,
      progress: 0,
      status: 'LEARNING',
      started: new Date().toISOString().slice(0, 10),
      completed: '',
      relatedProjects: [],
      notes: notes.trim() || 'Focusing on core principles and practice exercises.',
    }
    onAddSkill?.(newSkill)
    setName('')
    setNotes('')
    setShowForm(false)
  }

  const handleSaveNotes = () => {
    if (selectedSkill) {
      onUpdateSkillNotes?.(selectedSkill.id, notesInput)
    }
    setIsEditingNotes(false)
  }

  const startEditNotes = () => {
    setNotesInput(selectedSkill?.notes || '')
    setIsEditingNotes(true)
  }

  const handleStartSubtopic = () => {
    if (!activeSubtopic || !selectedSkill || !onStartSubtopic) return
    const mults = DIFFICULTY_MULTIPLIERS[selectedDifficulty]
    const time = Math.round((activeSubtopic.baseTime || 20) * mults.time)
    const xp = Math.round((activeSubtopic.baseXP || 30) * mults.xp)
    onStartSubtopic(selectedSkill.id, activeSubtopic.id, selectedDifficulty, time, xp)
    setActiveSubtopic(null)
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
    <div className="section-shell split-shell">
      <div className="panel">
        <div className="card-heading">
          <p className="eyebrow">LEARNING</p>
          {onAddSkill && (
            <button className="icon-button" onClick={() => setShowForm((v) => !v)} aria-label="Add skill">
              <Plus size={16} />
            </button>
          )}
        </div>

        {showForm && (
          <div className="goal-form" style={{ marginBottom: '1rem' }}>
            <input placeholder="Skill Name (e.g. Docker, GraphQL)" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Notes / Learning Objective" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="action-row">
              <button className="secondary-btn" onClick={handleCreateSkill}>Save skill</button>
              <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {skills.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '12px', marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Start your learning journey</h3>
            <p className="copy" style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Add something you're learning and build your path. Choose a skill, explore its subtopics, and track your progress.
            </p>
            {onAddSkill && (
              <button className="primary-btn" onClick={() => setShowForm((v) => !v)} style={{ margin: '0 auto' }}>
                <Plus size={16} /> Add your first skill
              </button>
            )}
          </div>
        ) : (
          <motion.div 
            className="constellation-list"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {skills.map((skill) => {
              return (
                <motion.div key={skill.id} variants={item} className="constellation-node">
                  <button
                    className={`constellation-button ${selectedSkillId === skill.id ? 'active' : ''}`}
                    onClick={() => onSelectSkill(skill.id)}
                  >
                    <span>{skill.name}</span>
                    <small>{skill.status}</small>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {activeSubtopic && selectedSkill && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="panel detail-panel" style={{ minWidth: '350px', background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>Start {activeSubtopic.title}</h3>
            <p className="eyebrow" style={{ color: 'var(--cyan)', marginBottom: '1.5rem' }}>Complexity: {activeSubtopic.complexity.toUpperCase()}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['Easy', 'Normal', 'Hard'] as SubtopicDifficulty[]).map(diff => {
                const mults = DIFFICULTY_MULTIPLIERS[diff]
                const time = Math.round((activeSubtopic.baseTime || 20) * mults.time)
                const xp = Math.round((activeSubtopic.baseXP || 30) * mults.xp)
                const isSelected = selectedDifficulty === diff
                return (
                  <button 
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className="goal-form"
                    style={{ 
                      textAlign: 'left', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--cyan)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(0, 255, 255, 0.05)' : 'transparent',
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', color: isSelected ? 'var(--cyan)' : 'var(--text-main)', marginBottom: '0.25rem' }}>{diff}</strong>
                      <span className="muted" style={{ fontSize: '0.85rem' }}>{formatEstimatedTime(time)}</span>
                    </div>
                    <strong style={{ color: 'var(--accent-gamification)' }}>+{xp} XP</strong>
                  </button>
                )
              })}
            </div>
            
            <div className="action-row" style={{ justifyContent: 'flex-end' }}>
              <button className="secondary-btn" onClick={() => setActiveSubtopic(null)}>Cancel</button>
              <button className="primary-btn" onClick={handleStartSubtopic}>Start Learning</button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedSkill && (
        <motion.div className="panel detail-panel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p className="eyebrow" style={{ margin: 0 }}>SKILL CONSTELLATION</p>
            {onRemoveSkill && (
              <button 
                className="icon-button" 
                onClick={() => setShowRemoveConfirm(true)} 
                aria-label="Remove skill"
                style={{ color: 'var(--danger, #ff453a)' }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <h3>{selectedSkill.name}</h3>

          {showRemoveConfirm && (
            <div className="goal-form" style={{ margin: '1rem 0', borderColor: 'var(--danger, #ff453a)' }}>
              <p style={{ color: 'var(--danger, #ff453a)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Remove {selectedSkill.name} from Learning?
              </p>
              <p className="copy" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                This will remove this subject and its learning progress.
              </p>
              <div className="action-row">
                <button 
                  className="secondary-btn" 
                  onClick={() => {
                    onRemoveSkill?.(selectedSkill.id)
                    setShowRemoveConfirm(false)
                  }}
                  style={{ color: 'var(--danger, #ff453a)', borderColor: 'var(--danger, #ff453a)' }}
                >
                  Remove
                </button>
                <button className="secondary-btn" onClick={() => setShowRemoveConfirm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {isEditingNotes ? (
            <div className="goal-form" style={{ margin: '0.5rem 0' }}>
              <textarea value={notesInput} onChange={(e) => setNotesInput(e.target.value)} />
              <button className="secondary-btn" onClick={handleSaveNotes}><Check size={14} /> Save notes</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
              <p className="copy" style={{ flex: 1 }}>{selectedSkill.notes}</p>
              {onUpdateSkillNotes && (
                <button className="icon-button" onClick={startEditNotes} aria-label="Edit notes">
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          )}

          <div className="xp-shell">
            <div className="xp-row">
              <span>Progress</span>
              <strong>{selectedSkill.progress}%</strong>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${selectedSkill.progress}%` }} />
            </div>
          </div>
          <div className="meta-row" style={{ marginBottom: '1.5rem' }}>
            <span>Status: {selectedSkill.status}</span>
            <span>Started: {selectedSkill.started}</span>
          </div>

          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>ROADMAP</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(() => {
              if (!selectedSkill.subtopics || selectedSkill.subtopics.length === 0) {
                return <p className="muted" style={{ fontSize: '0.875rem' }}>No subtopics available.</p>
              }

              const grouped = selectedSkill.subtopics.reduce((acc, topic) => {
                const domain = topic.domain || 'General'
                if (!acc[domain]) acc[domain] = []
                acc[domain].push(topic)
                return acc
              }, {} as Record<string, SubtopicProgress[]>)

              return Object.entries(grouped).map(([domain, topics]) => {
                const completedCount = topics.filter(t => t.status === 'Completed').length
                const totalCount = topics.length
                const isExpanded = expandedDomains[domain]

                return (
                  <div key={domain} className="goal-form" style={{ padding: '0', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                    <button 
                      onClick={() => toggleDomain(domain)}
                      style={{ 
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer',
                        textAlign: 'left', color: 'var(--text-main)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isExpanded ? <ChevronDown size={16} className="muted" /> : <ChevronRight size={16} className="muted" />}
                        <strong style={{ fontSize: '1rem' }}>{domain}</strong>
                      </div>
                      <span className="muted" style={{ fontSize: '0.875rem' }}>{completedCount} / {totalCount}</span>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {topics.map(topic => {
                          const isCompleted = topic.status === 'Completed'
                          const isLearning = topic.status === 'Learning'
                          const isNotStarted = topic.status === 'Not Started'
                          
                          return (
                            <div key={topic.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ 
                                  width: '16px', height: '16px', borderRadius: '50%', 
                                  border: isCompleted ? 'none' : '1px solid var(--border-strong)',
                                  background: isCompleted ? 'var(--cyan)' : (isLearning ? 'var(--accent-gamification)' : 'transparent'),
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  {isCompleted && <Check size={10} color="#000" />}
                                </div>
                                <div>
                                  <span style={{ color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>{topic.title}</span>
                                  <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                    {isNotStarted ? `${topic.size || 'Medium'} Topic (${topic.complexity})` : 
                                     isLearning ? `Learning (${topic.difficulty}) • ${formatEstimatedTime(topic.estimatedTime || 20)}` : 
                                     `Completed • +${topic.xpReward} XP`}
                                  </div>
                                </div>
                              </div>
                              
                              {isNotStarted && (
                                <button className="secondary-btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => { setActiveSubtopic(topic); setSelectedDifficulty('Normal'); }}>Start</button>
                              )}
                              {isLearning && (
                                <button className="primary-btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onCompleteSubtopic?.(selectedSkill.id, topic.id)}>Complete</button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </motion.div>
      )}
    </div>
  )
}

