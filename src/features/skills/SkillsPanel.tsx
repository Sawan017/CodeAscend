import { motion } from 'framer-motion'
import type { Skill, SkillNode } from '../../types'

type SkillsPanelProps = {
  skillTree: SkillNode[]
  skills: Skill[]
  selectedSkillId: string
  onSelectSkill: (id: string) => void
  onMasterSkill: (id: string) => void
  onIncrementSkill: (id: string) => void
}

export function SkillsPanel({ skillTree, skills, selectedSkillId, onSelectSkill, onMasterSkill, onIncrementSkill }: SkillsPanelProps) {
  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? skills[0]

  return (
    <div className="section-shell split-shell">
      <div className="panel">
        <p className="eyebrow">LEARNING</p>
        <div className="constellation-list">
          {skillTree.map((node) => (
            <div key={node.id} className="constellation-node">
              <button className={`constellation-button ${selectedSkillId === node.skillId ? 'active' : ''}`} onClick={() => onSelectSkill(node.skillId ?? '')}>
                <span>{node.title}</span>
                <small>{skills.find((skill) => skill.id === node.skillId)?.status}</small>
              </button>
              <div className="constellation-children">{node.children.map((child) => <span key={child.id}>{child.title}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
      <motion.div className="panel detail-panel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="eyebrow">SKILL CONSTELLATION</p>
        <h3>{selectedSkill?.name}</h3>
        <p className="copy">{selectedSkill?.notes}</p>
        <div className="xp-shell">
          <div className="xp-row"><span>Progress</span><strong>{selectedSkill?.progress}%</strong></div>
          <div className="progress-bar"><div style={{ width: `${selectedSkill?.progress ?? 0}%` }} /></div>
        </div>
        <div className="meta-row"><span>Status: {selectedSkill?.status}</span><span>Started: {selectedSkill?.started}</span></div>
        <div className="action-row">
          {selectedSkill?.status !== 'MASTERED' ? (
            <>
              <button className="secondary-btn" onClick={() => onIncrementSkill(selectedSkill?.id ?? '')}>Log practice (+10%)</button>
              <button className="secondary-btn" onClick={() => onMasterSkill(selectedSkill?.id ?? '')}>Mark as mastered</button>
            </>
          ) : (
            <button className="secondary-btn" onClick={() => onMasterSkill(selectedSkill?.id ?? '')}>Move back to learning</button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
