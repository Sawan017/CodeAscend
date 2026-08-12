import { motion } from 'framer-motion'
import { X, Play, BrainCircuit, Target } from 'lucide-react'
import type { SubtopicProgress, AIRecommendation } from '../../types'

type LearningSessionProps = {
  subtopic: SubtopicProgress
  baselineTime: number // in minutes
  onClose: () => void
  onStart: () => void
  aiRecommendation?: AIRecommendation
}

export function LearningSession({ subtopic, baselineTime, onClose, onStart, aiRecommendation }: LearningSessionProps) {
  const displayDifficulty = aiRecommendation ? aiRecommendation.difficulty : subtopic.difficulty || 'Normal'
  const baseXP = subtopic.baseXP || 50

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
          borderRadius: '24px', padding: '2.5rem', maxWidth: '500px', width: '90%',
          position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{subtopic.title}</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-main)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Difficulty: {displayDifficulty}</span>
          <span style={{ color: 'var(--cyan)', background: 'rgba(0,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Base XP: {baseXP}</span>
        </div>

        {aiRecommendation && (
          <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <BrainCircuit size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, color: '#34d399', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>AI Adjusted Engine</p>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>{aiRecommendation.reason}</p>
            </div>
          </div>
        )}

        <div style={{ 
          background: 'var(--bg-surface-sunken)', border: '1px solid var(--border)', 
          borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Target size={18} color="var(--cyan)" />
            <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Baseline Target: {baselineTime} mins</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            This baseline is designed for a newbie pace. <strong>It is NOT a deadline.</strong> You can take as long as you need to finish the task without penalty.
          </p>

          <h5 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>XP Rewards</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span>Complete under {Math.floor(baselineTime * 0.5)} mins (Fast)</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>{Math.floor(baseXP * 1.5)} XP</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span>Complete under {baselineTime} mins (Target)</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{Math.floor(baseXP * 1.2)} XP</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Complete over {baselineTime} mins (Normal)</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{baseXP} XP</span>
            </li>
          </ul>
        </div>

        <button 
          onClick={onStart}
          style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.05rem', transition: 'all 0.2s' }}
        >
          <Play size={18} /> Start Task
        </button>
      </motion.div>
    </div>
  )
}
