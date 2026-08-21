import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, BookOpen, Award, CheckCircle } from 'lucide-react'
import type { Skill, SubtopicProgress } from '../../types'
import { resolveSkill, generateSubtopicsForSkill } from '../../data/learningData.ts'
import { allTimeDistributions } from '../../data/timeDistributions/index'
import { LearningSession } from './LearningSession'

type SkillDetailProps = {
  skill: Skill
  onBack: () => void
    onUpdateNotes: (id: string, notes: string) => void
  onStartSession?: (subtopic: SubtopicProgress) => void
  onCloseSession?: () => void
  activeSession?: import('../../types').ActiveSessionState | null
}

export function SkillDetail({
  skill,
  onBack,
  onUpdateNotes,
  onStartSession,
  onCloseSession,
  activeSession
}: SkillDetailProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editNotes, setEditNotes] = useState(skill.notes || '')
  
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicProgress | null>(null)
  const [showBlockDialog, setShowBlockDialog] = useState(false)

  const handleSaveNotes = () => {
    onUpdateNotes?.(skill.id, editNotes)
    setIsEditingNotes(false)
  }

  const handleSubtopicClick = (subtopicTitle: string) => {
    let subtopic = skill.subtopics?.find(s => s.title === subtopicTitle)
    
    if (!subtopic && canonicalSkill) {
      const freshSubtopics = generateSubtopicsForSkill(canonicalSkill)
      subtopic = freshSubtopics.find(s => s.title === subtopicTitle)
    }

    if (subtopic && subtopic.status !== 'Completed') {
      if (activeSession && activeSession.isActive) {
        setShowBlockDialog(true)
        return
      }
      setActiveSubtopic(subtopic)
    }
  }


  const canonicalSkill = resolveSkill(skill.canonicalName || skill.name);
  const curriculum = canonicalSkill?.curriculum || [];
  
  const completedSubtopicsWithAi = (skill.subtopics || [])
    .filter(s => s.status === 'Completed' && s.aiRecommendation && s.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  const latestAiRec = completedSubtopicsWithAi.length > 0 ? completedSubtopicsWithAi[0].aiRecommendation : null

  return (
    <motion.div 
      className="detail-view-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-main)',
        minHeight: '100vh',
        padding: '2.5rem',
        border: '1px solid var(--border-strong)',
        borderRadius: '20px',
        maxWidth: '900px',
        margin: '0 auto'
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '100px',
            transition: 'all 0.2s',
            fontWeight: 500
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--text-main)'; e.currentTarget.style.color = 'var(--bg-surface)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-main)' }}
        >
          <ArrowLeft size={18} /> Return to Skills
        </button>
      </header>

      {latestAiRec && (
        <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', marginBottom: '0.25rem' }}>AI Adaptive Engine</h3>
            <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>Next recommended difficulty: <strong>{latestAiRec.difficulty}</strong></p>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{latestAiRec.reason}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '4rem' }}>
        <div style={{ 
          width: '100px', height: '100px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--cyan) 0%, #0055ff 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)'
        }}>
          {skill.status === 'MASTERED' ? <Award size={50} color="#fff" /> : <BookOpen size={50} color="#fff" />}
        </div>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 800 }}>{skill.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ 
              padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600,
              background: skill.status === 'MASTERED' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 204, 0, 0.2)',
              color: skill.status === 'MASTERED' ? '#34c759' : '#ffcc00'
            }}>
              {skill.status}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Started: {skill.started}</span>
            {skill.completed && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>• Completed: {skill.completed}</span>}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-strong)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Mastery Progress</h3>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cyan)' }}>{skill.progress}%</span>
        </div>
        <div style={{ width: '100%', height: '16px', background: 'var(--border-strong)', borderRadius: '8px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${skill.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--cyan) 0%, #0055ff 100%)', borderRadius: '8px' }}
          />
        </div>
      </div>

      {curriculum.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '4px', height: '24px', background: 'var(--cyan)', borderRadius: '2px' }} />
            Subtopics
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '1rem',
            // Custom scrollbar styling via inline style is tricky, but basic auto overflow works.
          }}>
            {curriculum.map((group, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-strong)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--cyan)', fontWeight: 600 }}>{group.domain}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {group.topics.map((topic, tIdx) => {
                    const userProgress = skill.subtopics?.find(s => s.title === topic.title)
                    const isCompleted = userProgress?.status === 'Completed'
                    const aiRec = userProgress?.aiRecommendation
                    
                    return (
                    <div key={tIdx} 
                      onClick={() => handleSubtopicClick(topic.title)}
                      style={{ 
                      padding: '1rem', 
                      background: isCompleted ? 'rgba(52, 199, 89, 0.05)' : 'rgba(255,255,255,0.03)', 
                      borderRadius: '8px', 
                      border: isCompleted ? '1px solid rgba(52, 199, 89, 0.3)' : '1px solid var(--border-strong)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      cursor: isCompleted ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: 1
                    }}
                    onMouseOver={(e) => { 
                      if (!isCompleted) {
                        e.currentTarget.style.borderColor = 'var(--cyan)'
                        e.currentTarget.style.background = 'rgba(0, 255, 255, 0.05)'
                      }
                    }}
                    onMouseOut={(e) => { 
                      if (!isCompleted) {
                        e.currentTarget.style.borderColor = 'var(--border-strong)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      }
                    }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isCompleted ? '#34c759' : 'var(--text-main)' }}>
                          {topic.title}
                        </span>
                        {isCompleted && <CheckCircle size={16} color="#34c759" />}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {aiRec
                          ? `AI Adjusted: ${aiRec.difficulty}`
                          : `Difficulty: ${allTimeDistributions[skill.id]?.[topic.title]?.intentionalDifficulty || 'Normal'}`
                        }
                      </span>
                    </div>
                  )})}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '4px', height: '24px', background: 'var(--cyan)', borderRadius: '2px' }} />
              Notes & Learnings
            </div>
            {!isEditingNotes && (
              <button 
                onClick={() => setIsEditingNotes(true)}
                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--cyan)', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer' }}
              >
                Edit
              </button>
            )}
          </h3>
          {isEditingNotes ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <textarea 
                value={editNotes} 
                onChange={e => setEditNotes(e.target.value)}
                style={{ background: 'var(--bg-surface-sunken)', color: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-strong)', minHeight: '150px', fontSize: '1.1rem', width: '100%' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSaveNotes} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Save Notes</button>
                <button onClick={() => setIsEditingNotes(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-strong)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem', background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-strong)' }}>
              {skill.notes || 'No specific notes recorded for this skill yet.'}
            </p>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '4px', height: '24px', background: 'var(--cyan)', borderRadius: '2px' }} />
            Applied Projects
          </h3>
          {skill.relatedProjects && skill.relatedProjects.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
              {skill.relatedProjects.map((proj, idx) => (
                <li key={idx} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-strong)', fontWeight: 500 }}>
                  {proj}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not applied to any specific projects yet.</p>
          )}
        </div>
      </div>

      

      {activeSubtopic && (() => {
        const currentSubtopic = activeSubtopic;
        if (!currentSubtopic) return null;
        
        const dist = allTimeDistributions[skill.id]?.[currentSubtopic.title];
        const aiDiff = currentSubtopic.aiRecommendation?.difficulty;
        const trueDifficulty: 'Easy' | 'Normal' | 'Hard' =
          (aiDiff === 'Easy' || aiDiff === 'Normal' || aiDiff === 'Hard')
            ? aiDiff
            : (dist?.intentionalDifficulty || currentSubtopic.difficulty || 'Normal') as 'Easy' | 'Normal' | 'Hard';
        const tMins = dist?.teachingMinutes ?? 60;
        const sMins = dist?.solvingBaselineMinutes?.[trueDifficulty] ?? 25;
        const XP_BASE: Record<string, number> = { Easy: 60,  Normal: 150, Hard: 320 };
        const XP_MULT: Record<string, number> = { Easy: 3.5, Normal: 5.5, Hard: 9.0 };
        const dynamicXP = Math.round(
          (XP_BASE[trueDifficulty] ?? 150) + sMins * (XP_MULT[trueDifficulty] ?? 5.5)
        );
        
        return (
          <LearningSession
            subtopic={{ ...currentSubtopic, difficulty: trueDifficulty, baseXP: dynamicXP }}
            teachingMinutes={tMins}
            solvingBaselineMinutes={sMins}
            onClose={() => {
              setActiveSubtopic(null)
              if (onCloseSession) onCloseSession()
            }}
            onStart={() => {
              setActiveSubtopic(null)
              if (onStartSession) onStartSession(currentSubtopic)
            }}
            aiRecommendation={currentSubtopic.aiRecommendation}
          />
        )
      })()}
      {showBlockDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--bg-panel)', padding: '2rem', borderRadius: '16px', maxWidth: '400px', border: '1px solid var(--border-strong)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#ff453a' }}>Session Already Active</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
              You already have an active learning session. Complete or cancel the current task before starting another.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBlockDialog(false)} style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}



