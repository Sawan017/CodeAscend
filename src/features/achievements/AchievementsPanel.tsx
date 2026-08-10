import { motion } from 'framer-motion'
import type { Achievement, Badge } from '../../types'

type AchievementsPanelProps = {
  achievements: Achievement[]
  badges: Badge[]
  onUnlockAchievement: (id: string) => void
  onEarnBadge: (badgeId: string) => void
}

export function AchievementsPanel({ achievements, badges, onUnlockAchievement, onEarnBadge }: AchievementsPanelProps) {
  return (
    <div className="section-shell">
      <div className="panel">
        <p className="eyebrow">BADGES</p>
        <div className="achievement-grid">
          {badges.map((badge) => (
            <motion.button key={badge.id} whileHover={{ y: -3, scale: 1.01 }} className={`achievement-card ${badge.earned ? 'unlocked' : ''} rarity-${badge.rarity.toLowerCase()}`} onClick={() => onEarnBadge(badge.id)}>
              <div className="achievement-icon">{badge.icon}</div>
              <div><h4>{badge.title}</h4><p>{badge.description}</p><span className={`rarity-badge rarity-${badge.rarity.toLowerCase()}`}>{badge.rarity}</span><p className="muted">{badge.requirement}</p>{badge.earned ? <small className="muted">Earned {badge.dateEarned}</small> : null}</div>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="panel">
        <p className="eyebrow">ACHIEVEMENTS</p>
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <motion.button key={achievement.id} whileHover={{ y: -3, scale: 1.01 }} className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`} onClick={() => onUnlockAchievement(achievement.id)}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div><h4>{achievement.title}</h4><p>{achievement.description}</p><small className="muted">{achievement.unlockCondition}</small></div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}