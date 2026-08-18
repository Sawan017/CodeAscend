import { useState } from 'react'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { Achievement, Badge, DynamicMilestone, MilestoneCategory } from '../../types'

type AchievementsPanelProps = {
  achievements: Achievement[]
  badges: Badge[]
  dynamicMilestones: DynamicMilestone[]
  onSelectAchievement: (id: string) => void
  onSelectBadge: (badgeId: string) => void
}

const CATEGORIES: MilestoneCategory[] = ['All', 'Learning', 'Coding', 'Knowledge', 'XP', 'Streak', 'Exploration', 'Special']

type BadgeArtworkProps = {
  category: MilestoneCategory
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'mythic'
  isEarned: boolean
  icon: string
}

function BadgeArtwork({ isEarned, icon, tier }: BadgeArtworkProps) {
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Trophy

  // Professional, subtle color palette for tiers, keeping it clean
  const getTierColor = () => {
    switch(tier) {
      case 'bronze': return 'var(--cyan)' // Standard accent
      case 'silver': return '#94a3b8'     // Slate 400
      case 'gold': return '#fbbf24'       // Amber 400
      case 'diamond': return '#38bdf8'    // Sky 400
      case 'mythic': return '#c084fc'     // Purple 400
      default: return 'var(--cyan)'
    }
  }

  const baseColor = getTierColor()
  
  // Use hex to rgba hack since we can't easily parse var() in inline styles for opacity
  // For cyan, we can just use the standard classes. For hex, we'll just use 15% opacity manually if needed,
  // but it's simpler to just use standard CSS or an approximation.
  const isCyan = baseColor === 'var(--cyan)'
  
  const containerBg = isEarned 
    ? (isCyan ? 'rgba(34, 211, 238, 0.1)' : `${baseColor}20`)
    : 'rgba(255, 255, 255, 0.03)'
    
  const borderColor = isEarned 
    ? (isCyan ? 'rgba(34, 211, 238, 0.2)' : `${baseColor}40`) 
    : 'var(--border)'
    
  const iconColor = isEarned ? baseColor : 'var(--text-muted)'

  return (
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      background: containerBg,
      border: `1px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: iconColor,
      transition: 'all 0.2s ease'
    }}>
      <IconComponent size={24} strokeWidth={isEarned ? 2 : 1.5} />
    </div>
  )
}

export function AchievementsPanel({ achievements, dynamicMilestones }: AchievementsPanelProps) {
  console.log("DEBUG: RENDER AchievementsPanel mounted = true", { 
    dynamicMilestonesCount: dynamicMilestones?.length, 
    achievementsCount: achievements?.length 
  })
  
  const [activeCategory, setActiveCategory] = useState<MilestoneCategory>('All')

  const filteredMilestones = dynamicMilestones.filter(m => activeCategory === 'All' || m.category === activeCategory)
  const earnedCount = filteredMilestones.filter(m => m.isUnlocked).length
  const totalCount = filteredMilestones.length

  return (
    <div className="section-shell">
      <div className="panel hero-panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow">ACHIEVEMENTS</p>
            <h2 style={{ margin: 0 }}>Career Achievements</h2>
          </div>
          <div className="hud-chip">
            <span style={{ color: 'var(--cyan)' }}>Earned: {earnedCount}/{totalCount}</span>
          </div>
        </div>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: `1px solid ${activeCategory === cat ? 'var(--cyan)' : 'var(--border)'}`,
                background: activeCategory === cat ? 'rgba(34,211,238,0.1)' : 'transparent',
                color: activeCategory === cat ? 'var(--cyan)' : 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {totalCount === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No milestones found for this category.</p>
          </div>
        ) : (
          <div className="achievement-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredMilestones.map((milestone) => {
              const isEarned = milestone.isUnlocked
              const progressPercentage = Math.min(100, Math.max(0, (milestone.progressValue / milestone.targetValue) * 100))
              
              return (
                <motion.div 
                  key={milestone.id} 
                  whileHover={{ y: -2, scale: 1.01 }} 
                  className={`achievement-card ${isEarned ? 'unlocked' : ''}`} 
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: isEarned ? 'var(--surface-sunken)' : 'rgba(255,255,255,0.02)',
                    borderColor: isEarned ? 'var(--border-strong)' : 'var(--border)',
                    opacity: isEarned ? 1 : 0.7,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    textAlign: 'left'
                  }}
                >
                  {isEarned && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.02), transparent)', pointerEvents: 'none' }} />
                  )}

                  <BadgeArtwork 
                    category={milestone.category} 
                    tier={milestone.tier || 'bronze'} 
                    isEarned={isEarned} 
                    icon={milestone.icon} 
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: isEarned ? 'var(--text)' : 'var(--text-muted)' }}>{milestone.title}</h4>
                      {milestone.xpReward && (
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', color: 'var(--cyan)' }}>+{milestone.xpReward} XP</span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--text-muted)' }}>{milestone.description}</p>
                    
                    <div style={{ marginTop: 'auto' }}>
                      {isEarned ? (
                        <p className="muted" style={{ fontSize: '0.8rem', margin: 0, color: 'var(--green)' }}>
                          ✓ Earned {milestone.dateUnlocked}
                        </p>
                      ) : (
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--text-muted)' }}>
                            <span>Progress</span>
                            <span>{Math.floor(milestone.progressValue)} / {milestone.targetValue}</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--cyan)', borderRadius: '3px' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
      
    </div>
  )
}