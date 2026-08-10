import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Goal, GoalDifficulty, GoalPriority } from '../../types'
import { daysUntilDeadline, isGoalOverdue, XP_REWARDS } from '../../lib/progression'

type GoalsPanelProps = {
  goals: Goal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
  onCompleteGoal: (id: string) => void
  onAddGoal: (goal: Goal) => void
  onRemoveGoal: (id: string) => void
}

function createId() {
  return `goal-${Date.now()}`
}

export function GoalsPanel({ goals, selectedGoalId, onSelectGoal, onCompleteGoal, onAddGoal, onRemoveGoal }: GoalsPanelProps) {
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? goals[0]
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Learning')
  const [priority, setPriority] = useState<GoalPriority>('Medium')
  const [difficulty, setDifficulty] = useState<GoalDifficulty>('Normal')
  const [deadline, setDeadline] = useState('')

  const submitGoal = () => {
    if (!title.trim()) return
    onAddGoal({
      id: createId(),
      title: title.trim(),
      description: description.trim() || 'A new quest on the journey.',
      category,
      progress: 0,
      priority,
      difficulty,
      xpReward: difficulty === 'Easy' ? XP_REWARDS.goalEasy : difficulty === 'Normal' ? XP_REWARDS.goalMedium : difficulty === 'Hard' ? XP_REWARDS.goalHard : difficulty === 'Expert' ? XP_REWARDS.goalHard : XP_REWARDS.goalHard,
      deadline: deadline || '2027-12-31',
      milestones: [],
      status: 'ACTIVE',
      relatedProject: '',
      notes: '',
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setTitle('')
    setDescription('')
    setCategory('Learning')
    setPriority('Medium')
    setDifficulty('Normal')
    setDeadline('')
    setShowForm(false)
  }

  const deadlineInfo = selectedGoal ? daysUntilDeadline(selectedGoal) : null
  const overdue = selectedGoal ? isGoalOverdue(selectedGoal) : false

  return (
    <div className="section-shell split-shell">
      <div className="panel">
        <div className="card-heading">
          <p className="eyebrow">GOALS</p>
          <button className="icon-button" onClick={() => setShowForm((v) => !v)} aria-label="Add goal"><Plus size={16} /></button>
        </div>
        {showForm && (
          <div className="goal-form">
            <input placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="form-row">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Learning</option>
                <option>Projects</option>
                <option>Career</option>
                <option>Health</option>
              </select>
              <select value={priority} onChange={(e) => setPriority(e.target.value as GoalPriority)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as GoalDifficulty)}>
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <div className="action-row">
              <button className="secondary-btn" onClick={submitGoal}>Save goal</button>
              <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="goal-list">
          {goals.map((goal) => (
            <div key={goal.id} className={`goal-card ${selectedGoalId === goal.id ? 'active' : ''}`}>
              <button className="goal-card-main" onClick={() => onSelectGoal(goal.id)}>
                <div className="goal-head"><strong>{goal.title}</strong><span>{goal.priority} · {goal.difficulty}</span></div>
                <div className="progress-bar"><div style={{ width: `${goal.progress}%` }} /></div>
                <small className="muted">{goal.status === 'COMPLETED' ? `Completed ${goal.completedDate ?? ''}` : `XP: ${goal.xpReward}`}</small>
              </button>
              <button className="goal-delete" onClick={() => onRemoveGoal(goal.id)} aria-label={`Delete ${goal.title}`}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <motion.div className="panel detail-panel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
        <p className="eyebrow">ACTIVE TARGET</p>
        <h3>{selectedGoal?.title}</h3>
        <p className="copy">{selectedGoal?.description}</p>
        <div className="meta-row">
          <span>Category: {selectedGoal?.category}</span>
          <span>Priority: {selectedGoal?.priority}</span>
        </div>
        <div className="meta-row">
          <span>Difficulty: {selectedGoal?.difficulty}</span>
          <span>XP: {selectedGoal?.xpReward}</span>
        </div>
        <div className="meta-row">
          <span>Deadline: {selectedGoal?.deadline}</span>
          {selectedGoal?.status !== 'COMPLETED' && deadlineInfo !== null && (
            <span className={overdue ? 'overdue' : 'on-time'}>
              {overdue ? `${Math.abs(deadlineInfo)}d overdue` : `${deadlineInfo}d left`}
            </span>
          )}
        </div>
        {selectedGoal?.status === 'COMPLETED' ? (
          <button className="secondary-btn" disabled>Completed ✓</button>
        ) : (
          <button className="secondary-btn" onClick={() => onCompleteGoal(selectedGoal?.id ?? '')}>Complete goal</button>
        )}
      </motion.div>
    </div>
  )
}