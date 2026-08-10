import { motion } from 'framer-motion'
import { calculateProgressToNextLevel } from '../lib/progression'

type XpProgressBarProps = {
  xp: number
  compact?: boolean
}

export function XpProgressBar({ xp, compact = false }: XpProgressBarProps) {
  const { level, currentXp, requiredXp, progress } = calculateProgressToNextLevel(xp)
  const remaining = requiredXp - currentXp

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
          <span className="muted">Lvl {level}</span>
          <span style={{ color: 'var(--cyan)' }}>{Math.floor(progress)}%</span>
        </div>
        <div className="progress-bar" style={{ height: '4px' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
              boxShadow: 'var(--glow-blue)'
            }} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="panel" style={{ background: 'var(--surface-sunken)', padding: '1.5rem', border: '1px solid var(--border-strong)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <p className="eyebrow">CURRENT LEVEL</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--cyan)', textShadow: 'var(--glow-cyan)' }}>{level}</h2>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="eyebrow">NEXT LEVEL</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', justifyContent: 'flex-end' }}>
            <h3 style={{ margin: 0 }}>{requiredXp}</h3>
            <span className="muted">XP</span>
          </div>
        </div>
      </div>

      <div className="progress-bar" style={{ height: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '0.75rem', overflow: 'visible', position: 'relative' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
            boxShadow: 'var(--glow-cyan)',
            borderRadius: '999px',
            position: 'relative'
          }}
        >
          <div style={{ 
            position: 'absolute', 
            right: 0, 
            top: '50%', 
            transform: 'translate(50%, -50%)', 
            width: '20px', 
            height: '20px', 
            background: '#fff', 
            borderRadius: '50%', 
            boxShadow: '0 0 10px #fff' 
          }} />
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span className="muted">Current: <strong style={{ color: 'var(--text)' }}>{currentXp} XP</strong> ({Math.floor(progress)}%)</span>
        <span style={{ color: 'var(--cyan)' }}>{remaining} XP to go!</span>
      </div>
    </div>
  )
}
