import { motion } from 'framer-motion'
import { BadgeArtwork } from './BadgeArtwork'
import { ArrowLeft, Trophy, Calendar, Sparkles } from 'lucide-react'
import type { Achievement } from '../../types'

type AchievementDetailProps = {
  achievement: Achievement
  onBack: () => void
}

export function AchievementDetail({
  achievement,
  onBack
}: AchievementDetailProps) {
  const isUnlocked = achievement.unlocked

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
      {/* Decorative background glow */}
      {isUnlocked && (
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(0,0,0,0) 70%)',
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
          style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
        >
          <BadgeArtwork title={achievement.title} image={(achievement as any).image} isLocked={!isUnlocked} size={160} tier={(achievement as any).tier || 'bronze'} />
        </motion.div>

        <h1 style={{ 
          fontSize: '3rem', marginBottom: '1rem', fontWeight: 800,
          color: isUnlocked ? '#FFD700' : 'var(--text-muted)'
        }}>
          {achievement.title}
        </h1>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', maxWidth: '600px', lineHeight: '1.6', marginBottom: '3rem' }}>
          {achievement.description}
        </p>

        <div style={{ 
          width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.03)', 
          padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-strong)',
          display: 'flex', flexDirection: 'column', gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} color="var(--text-main)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unlock Condition</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{achievement.unlockCondition}</div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-strong)', width: '100%' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="var(--text-main)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isUnlocked ? (
                  <>
                    <Sparkles size={16} color="#FFD700" />
                    <span style={{ color: '#FFD700' }}>Unlocked on {achievement.dateUnlocked || 'Unknown date'}</span>
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
