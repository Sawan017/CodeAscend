import { motion } from 'framer-motion'
import { ArrowLeft, Award, Sparkles } from 'lucide-react'
import type { Badge } from '../../types'

type BadgeDetailProps = {
  badge: Badge
  onBack: () => void
}

export function BadgeDetail({
  badge,
  onBack
}: BadgeDetailProps) {
  const isUnlocked = badge.earned

  return (
    <motion.div 
      className="detail-view-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-main)',
        minHeight: '100vh',
        padding: '2rem',
        border: '1px solid var(--border-strong)',
        borderRadius: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background glow based on rarity */}
      {isUnlocked && (
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', 
          background: badge.rarity === 'Legendary' ? 'radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(0,0,0,0) 70%)' :
                      badge.rarity === 'Epic' ? 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)' :
                      badge.rarity === 'Rare' ? 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)' :
                      'radial-gradient(circle, rgba(161,161,170,0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none', zIndex: 0
        }} />
      )}

      <header style={{ position: 'relative', zIndex: 1, marginBottom: '4rem' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-strong)', color: 'var(--text-main)', cursor: 'pointer',
            fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '8px', backdropFilter: 'blur(10px)'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <motion.div 
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          style={{
            width: '160px', height: '160px', borderRadius: '50%', marginBottom: '2rem',
            background: isUnlocked ? 'var(--surface-sunken)' : 'var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isUnlocked ? 'var(--glow-cyan)' : 'none',
            border: '4px solid', borderColor: isUnlocked ? 'var(--cyan)' : 'var(--text-muted)',
            position: 'relative'
          }}
        >
          <span style={{ fontSize: '4rem', filter: isUnlocked ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'grayscale(100%) opacity(50%)' }}>
            {badge.icon}
          </span>
          {isUnlocked && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, border: '1px dashed var(--cyan)', borderRadius: '50%' }}
            />
          )}
        </motion.div>

        <h1 style={{ 
          fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 800,
          color: isUnlocked ? 'var(--text)' : 'var(--text-muted)'
        }}>
          {badge.title}
        </h1>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span className={`rarity-badge rarity-${badge.rarity.toLowerCase()}`} style={{ fontSize: '1rem', padding: '4px 12px' }}>
            {badge.rarity}
          </span>
          {isUnlocked && (
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '1rem' }}>+80 XP</span>
          )}
        </div>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', maxWidth: '600px', lineHeight: '1.6', marginBottom: '3rem' }}>
          {badge.description}
        </p>

        <div style={{ 
          width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.03)', 
          padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-strong)',
          display: 'flex', flexDirection: 'column', gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="var(--text-main)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{badge.requirement}</div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-strong)', width: '100%' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="var(--text-main)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isUnlocked ? (
                  <>
                    <span style={{ color: 'var(--green)' }}>✓ Earned on {badge.dateEarned || 'Unknown date'}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Locked</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
