import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Trash2, CheckCircle, Target, Clock, AlertCircle } from 'lucide-react'
import type { Goal } from '../../types'

type GoalDetailProps = {
  goal: Goal
  onBack: () => void
  onMarkComplete?: (goalId: string) => void
  onDeleteGoal?: (goalId: string) => void
  onUpdateGoal?: (goal: Goal) => void
}

export function GoalDetail({
  goal,
  onBack,
  onMarkComplete,
  onDeleteGoal,
  onUpdateGoal
}: GoalDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(goal.title)
  const [editDesc, setEditDesc] = useState(goal.description)
  const [editPriority, setEditPriority] = useState(goal.priority)
  const [editTargetDate, setEditTargetDate] = useState(goal.targetDate)

  const handleSave = () => {
    onUpdateGoal?.({
      ...goal,
      title: editTitle,
      description: editDesc,
      priority: editPriority,
      targetDate: editTargetDate
    })
    setIsEditing(false)
  }

  return (
    <motion.div 
      className="detail-view-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-main)',
        minHeight: '100vh',
        padding: '2rem',
        border: '1px solid var(--border-strong)',
        borderRadius: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            fontWeight: 500
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateX(-4px)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)' }}
        >
          <ArrowLeft size={24} /> Back to Goals
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
        {onUpdateGoal && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '0.5rem 1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        )}
        
        {onDeleteGoal && (
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${goal.title}? This action cannot be undone.`)) {
                onDeleteGoal(goal.id)
              }
            }}
            style={{
              background: 'rgba(255, 59, 48, 0.1)',
              color: '#ff3b30',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              padding: '0.5rem 1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'}
          >
            <Trash2 size={18} /> Delete Goal
          </button>
        )}
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(90, 200, 250, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
              border: '2px solid var(--cyan)'
            }}
          >
            <Target size={40} color="var(--cyan)" />
          </motion.div>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '2rem' }} />
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px', minHeight: '100px' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select value={editPriority} onChange={e => setEditPriority(e.target.value as import('../../types').GoalPriority)} style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px' }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input type="date" value={editTargetDate} onChange={e => setEditTargetDate(e.target.value)} style={{ padding: '0.5rem', background: 'var(--bg-surface-sunken)', color: 'white', border: '1px solid var(--border-strong)', borderRadius: '8px' }} />
              </div>
              <button onClick={handleSave} style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>Save Changes</button>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {goal.title}
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {goal.description}
              </p>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Priority', value: goal.priority, icon: AlertCircle, color: goal.priority === 'High' ? '#ff3b30' : 'var(--text-main)' },
            { label: 'Target Date', value: goal.targetDate, icon: Clock, color: 'var(--text-main)' }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <stat.icon size={32} color={stat.color} />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: stat.color }}>{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-strong)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Status Overview</h3>
              <p style={{ color: 'var(--text-muted)' }}>Status: <span style={{ color: '#ffcc00', fontWeight: 600 }}>{goal.status}</span></p>
            </div>
          </div>

          {goal.milestones && goal.milestones.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Milestones</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                {goal.milestones.map((ms, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>{idx + 1}</div>
                    <span style={{ fontSize: '1.1rem' }}>{ms}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {onMarkComplete && goal.status !== 'COMPLETED' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                onMarkComplete(goal.id)
                onBack()
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem',
                background: 'linear-gradient(135deg, #34c759 0%, #30b04f 100%)', color: '#fff',
                border: 'none', borderRadius: '100px', fontSize: '1.1rem', fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 8px 20px rgba(52, 199, 89, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(52, 199, 89, 0.4)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(52, 199, 89, 0.3)' }}
            >
              <CheckCircle size={24} /> Mark as Done
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
