import { motion } from 'framer-motion'
import { ArrowRight, LogIn } from 'lucide-react'
import type { Progression } from '../../types'

import { useAuth } from '../../lib/auth'

type AuthShellProps = {
  onEnter: () => void
  progression: Progression
}

export function AuthShell({ onEnter, progression }: AuthShellProps) {
  const { signInWithGoogle, loading, isConfigured } = useAuth()

  return (
    <motion.main key="landing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.8 }} className="landing">
      <motion.div className="landing-card" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, duration: 0.75 }}>
        <p className="eyebrow">FUTUREME / developer chronicle</p>
        <h1>FutureMe</h1>
        <p className="landing-copy" style={{ fontStyle: 'italic', opacity: 0.9 }}>"Build your skills. Complete your quests. Shape your future."</p>
        <div className="hero-actions">
          {isConfigured ? (
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={signInWithGoogle} disabled={loading}>
              {loading ? 'Signing in...' : <><LogIn size={16} /> Continue with Google</>}
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={onEnter}>
              Enter my journey <ArrowRight size={16} />
            </motion.button>
          )}
          <div className="badge-pill">Immersive. Personal. Evolving.</div>
        </div>
        <div className="hero-stats">
          <div><strong>{String(progression.skillsMastered || 0).padStart(2, '0')}</strong><span>Skills</span></div>
          <div><strong>{String(progression.projectsCompleted || 0).padStart(2, '0')}</strong><span>Projects</span></div>
          <div><strong>{String(progression.goalsCompleted || 0).padStart(2, '0')}</strong><span>Domains</span></div>
          <div><strong>100%</strong><span>Momentum</span></div>
        </div>
      </motion.div>
    </motion.main>
  )
}