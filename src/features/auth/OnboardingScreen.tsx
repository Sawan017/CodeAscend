import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

type OnboardingScreenProps = {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <motion.main key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="landing">
      <motion.div className="landing-card" initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.7 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--cyan)' }}>
            <Sparkles size={32} />
          </div>
        </div>
        
        <p className="eyebrow" style={{ textAlign: 'center' }}>WELCOME TO ARINOVA</p>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Start Your Journey</h1>
        
        <p className="landing-copy" style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.9 }}>
          Your digital developer chronicle awaits. Build skills, complete projects, and map out your professional growth.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button 
            whileHover={{ scale: 1.03, y: -2 }} 
            whileTap={{ scale: 0.98 }} 
            className="primary-btn" 
            onClick={onComplete}
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            Start Your Journey <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </motion.main>
  )
}
