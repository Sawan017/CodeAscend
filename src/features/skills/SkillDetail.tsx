import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, BookOpen, Award, CheckCircle } from 'lucide-react'
import type { Skill } from '../../types'
import { resolveSkill } from '../../data/learningData'

type SkillDetailProps = {
  skill: Skill
  onBack: () => void
  onMarkMastered?: (skillId: string) => void
  onUpdateNotes?: (skillId: string, notes: string) => void
}

export function SkillDetail({
  skill,
  onBack,
  onMarkMastered,
  onUpdateNotes
}: SkillDetailProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editNotes, setEditNotes] = useState(skill.notes || '')

  const handleSaveNotes = () => {
    onUpdateNotes?.(skill.id, editNotes)
    setIsEditingNotes(false)
  }

  const canonicalSkill = resolveSkill(skill.id);
  const curriculum = canonicalSkill?.curriculum || [];

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
                  {group.topics.map((topic, tIdx) => (
                    <div key={tIdx} style={{ 
                      padding: '1rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-strong)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.background = 'rgba(0, 255, 255, 0.05)' }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{topic.title}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{topic.complexity} • {topic.size}</span>
                    </div>
                  ))}
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
            {onUpdateNotes && !isEditingNotes && (
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

      {onMarkMastered && skill.status !== 'MASTERED' && (
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => onMarkMastered(skill.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem',
              background: 'transparent', color: 'var(--cyan)',
              border: '2px solid var(--cyan)', borderRadius: '100px', fontSize: '1.1rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--cyan)'; e.currentTarget.style.color = '#000' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cyan)' }}
          >
            <CheckCircle size={20} /> Mark as Mastered
          </button>
        </div>
      )}
    </motion.div>
  )
}
