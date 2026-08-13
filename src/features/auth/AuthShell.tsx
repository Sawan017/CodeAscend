import { motion } from 'framer-motion'
import { ArrowRight, LogIn } from 'lucide-react'
import type { Progression } from '../../types'
import { useAuth } from '../../lib/auth'

type AuthShellProps = {
  onEnter: () => void
  progression: Progression
}

const Premium3DVisual = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px', marginTop: '40px' }}>
      <motion.div 
        animate={{ rotateY: [0, 10, -10, 0], rotateX: [15, 20, 15] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ position: 'relative', width: '200px', height: '200px', transformStyle: 'preserve-3d' }}
      >
        {/* Knowledge Layer */}
        <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--border-strong)', background: 'var(--glass)', transform: 'translateZ(-60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>KNOWLEDGE</div>
        {/* Organization Layer */}
        <div style={{ position: 'absolute', inset: -10, border: '1px solid var(--border-gold)', background: 'rgba(212, 175, 55, 0.05)', transform: 'translateZ(0px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--gold-dark)', letterSpacing: '0.2em' }}>ORGANIZATION</div>
        {/* Progression Layer */}
        <div style={{ position: 'absolute', inset: -20, border: '2px solid var(--primary)', background: 'rgba(0,0,0,0.02)', transform: 'translateZ(60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '0.2em', fontWeight: 600 }}>PROGRESSION</div>
        {/* Mastery Layer */}
        <div style={{ position: 'absolute', top: '-30px', left: '-30px', right: '-30px', bottom: '-30px', border: '3px solid var(--gold)', background: 'transparent', transform: 'translateZ(120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.3em', fontWeight: 800, boxShadow: 'var(--shadow-gold)' }}>MASTERY</div>
        
        {/* Connection Lines */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: '2px', height: '180px', background: 'var(--gold)', transform: 'translate(-50%, -50%) rotateX(90deg)', opacity: 0.5 }} />
      </motion.div>
    </div>
  )
}

export function AuthShell({ onEnter, progression }: AuthShellProps) {
  const { signInWithGoogle, loading, isConfigured } = useAuth()

  return (
    <motion.main key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="landing">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        
        {/* Navbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--primary)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--gold)' }} />
            </div>
            <span style={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.9rem' }}>CODE ASCEND</span>
          </div>
          <div>
            {isConfigured ? (
              <button onClick={signInWithGoogle} disabled={loading} style={{ background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            ) : (
              <button onClick={onEnter} style={{ background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }}>
                Enter Journey
              </button>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', marginTop: '40px' }}>
          
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <p className="eyebrow" style={{ color: 'var(--gold-dark)' }}>The Professional Learning Engine</p>
            <h1 style={{ marginBottom: '24px' }}>Structure your<br/>engineering<br/>mastery.</h1>
            <p className="landing-copy" style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.6 }}>
              A premium workspace to store, organize, and verify your technical skills. Transform scattered knowledge into structured career progression.
            </p>
            <div className="hero-actions" style={{ marginTop: 0 }}>
              {isConfigured ? (
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={signInWithGoogle} disabled={loading}>
                  {loading ? 'Signing in...' : <><LogIn size={18} /> Access Workspace</>}
                </motion.button>
              ) : (
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={onEnter}>
                  Access Workspace <ArrowRight size={18} />
                </motion.button>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <Premium3DVisual />
          </motion.div>

        </div>

        {/* Stats Section */}
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', borderTop: '1px solid var(--border)', paddingTop: '40px', marginTop: '80px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Verified Skills</span>
            <strong style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{String(progression.skillsMastered || 0).padStart(2, '0')}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Architecture</span>
            <strong style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{String(progression.projectsCompleted || 0).padStart(2, '0')}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Knowledge Nodes</span>
            <strong style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{String(progression.goalsCompleted || 0).padStart(2, '0')}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-dark)' }}>System Integrity</span>
            <strong style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold)' }}>100%</strong>
          </div>
        </motion.div>

      </div>
    </motion.main>
  )
}