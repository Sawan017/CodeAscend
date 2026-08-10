import { motion } from 'framer-motion'
import { Plus, Edit2, Check } from 'lucide-react'
import { useState } from 'react'
import type { Skill, SkillNode } from '../../types'

type SkillsPanelProps = {
  skillTree: SkillNode[]
  skills: Skill[]
  selectedSkillId: string
  onSelectSkill: (id: string) => void
  onMasterSkill: (id: string) => void
  onIncrementSkill: (id: string) => void
  onAddSkill?: (skill: Skill) => void
  onUpdateSkillNotes?: (id: string, notes: string) => void
}

export function SkillsPanel({
  skillTree,
  skills,
  selectedSkillId,
  onSelectSkill,
  onMasterSkill,
  onIncrementSkill,
  onAddSkill,
  onUpdateSkillNotes,
}: SkillsPanelProps) {
  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? skills[0]
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesInput, setNotesInput] = useState('')

  const handleCreateSkill = () => {
    if (!name.trim()) return
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    const newSkill: Skill = {
      id,
      name: name.trim(),
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

        <div className="constellation-list">
          {skills.map((skill) => {
            const treeNode = skillTree.find((t) => t.skillId === skill.id)
            return (
              <div key={skill.id} className="constellation-node">
                <button
                  className={`constellation-button ${selectedSkillId === skill.id ? 'active' : ''}`}
                  onClick={() => onSelectSkill(skill.id)}
                >
                  <span>{skill.name}</span>
                  <small>{skill.status}</small>
                </button>
                {treeNode && treeNode.children.length > 0 && (
                  <div className="constellation-children">
                    {treeNode.children.map((child) => (
                      <span key={child.id}>{child.title}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedSkill && (
        <motion.div className="panel detail-panel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <p className="eyebrow">SKILL CONSTELLATION</p>
          <h3>{selectedSkill.name}</h3>

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
          <div className="meta-row">
            <span>Status: {selectedSkill.status}</span>
            <span>Started: {selectedSkill.started}</span>
          </div>
          <div className="action-row">
            {selectedSkill.status !== 'MASTERED' ? (
              <>
                <button className="secondary-btn" onClick={() => onIncrementSkill(selectedSkill.id)}>Log practice (+10%)</button>
                <button className="secondary-btn" onClick={() => onMasterSkill(selectedSkill.id)}>Mark as mastered</button>
              </>
            ) : (
              <button className="secondary-btn" onClick={() => onMasterSkill(selectedSkill.id)}>Move back to learning</button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

