import { motion } from 'framer-motion'
import type { Achievement, Badge } from '../../types'

type AchievementsPanelProps = {
  achievements: Achievement[]
  badges: Badge[]
  onSelectAchievement: (id: string) => void
  onSelectBadge: (badgeId: string) => void
}

export function AchievementsPanel({ achievements, badges, onSelectAchievement, onSelectBadge }: AchievementsPanelProps) {
  return (
    <div className="section-shell">
      <div className="panel hero-panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <p className="eyebrow">BADGE SHOWCASE</p>
            <h2 style={{ margin: 0 }}>Career Milestones</h2>
          </div>
          <div className="hud-chip">
            <span style={{ color: 'var(--cyan)' }}>Earned: {badges.filter(b => b.earned).length}/{badges.length}</span>
          </div>
        </div>
        
        <div className="achievement-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {badges.map((badge) => {
            const isEarned = badge.earned
            return (
              <motion.button 
                key={badge.id} 
                whileHover={{ y: -4, scale: 1.02 }} 
                className={`achievement-card ${isEarned ? 'unlocked' : ''} rarity-${badge.rarity.toLowerCase()}`} 
                onClick={() => onSelectBadge(badge.id)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: isEarned ? 'var(--surface-sunken)' : 'rgba(255,255,255,0.02)',
                  borderColor: isEarned ? 'var(--border-strong)' : 'var(--border)',
                  boxShadow: isEarned ? 'var(--glow-cyan)' : 'none',
                }}
              >
                {isEarned && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(34,211,238,0.1), transparent)', pointerEvents: 'none' }} />
                )}
                
                <div className="achievement-icon" style={{ 
                  fontSize: '2rem', 
                  width: '56px', 
                  height: '56px',
                  background: isEarned ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)',
                  boxShadow: isEarned ? 'inset 0 0 12px rgba(34,211,238,0.3)' : 'none'
                }}>
                  {badge.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: isEarned ? 'var(--text)' : 'var(--text-muted)' }}>{badge.title}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', lineHeight: 1.4 }}>{badge.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={`rarity-badge rarity-${badge.rarity.toLowerCase()}`}>{badge.rarity}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>+80 XP</span>
                  </div>
                  
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border)' }}>
                    <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                      {isEarned ? (
                        <span style={{ color: 'var(--green)' }}>✓ Earned {badge.dateEarned}</span>
                      ) : (
                        <span>🔒 {badge.requirement}</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
      
      <div className="panel">
        <p className="eyebrow">ACHIEVEMENTS</p>
        <div className="achievement-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {achievements.map((achievement) => (
            <motion.button 
              key={achievement.id} 
              whileHover={{ y: -3, scale: 1.01 }} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`} 
              onClick={() => onSelectAchievement(achievement.id)}
              style={{
                borderColor: achievement.unlocked ? 'var(--cyan)' : 'var(--border)',
                opacity: achievement.unlocked ? 1 : 0.6
              }}
            >
              <div className="achievement-icon" style={{ 
                  background: achievement.unlocked ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)',
                  color: achievement.unlocked ? 'var(--cyan)' : 'inherit'
                }}>{achievement.icon}</div>
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>{achievement.title}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>{achievement.description}</p>
                <small className="muted">{achievement.unlocked ? `Unlocked ${achievement.dateUnlocked}` : achievement.unlockCondition}</small>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}