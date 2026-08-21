import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ChevronDown, ChevronUp } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { DynamicMilestone } from '../types'

interface MilestonesSectionProps {
  dynamicMilestones: DynamicMilestone[]
  displayedIds?: string[]
  maxVisible?: number
}

export function MilestonesSection({ dynamicMilestones, displayedIds, maxVisible = 12 }: MilestonesSectionProps) {
  // Only show unlocked achievements
  const safeAchievements = dynamicMilestones || []
  let unlockedAchievements = safeAchievements.filter(a => a.isUnlocked)
  
  if (displayedIds && displayedIds.length > 0) {
    unlockedAchievements = unlockedAchievements.filter(a => displayedIds.includes(a.id))
  } else if (displayedIds !== undefined) {
    unlockedAchievements = []
  } else {
    // If undefined (legacy profiles that haven't saved any array yet), default to empty.
    unlockedAchievements = []
  }
  
  // Sort them so they match the order in displayedIds if possible
  if (displayedIds) {
    unlockedAchievements.sort((a, b) => displayedIds.indexOf(a.id) - displayedIds.indexOf(b.id))
  }

  console.log("DEBUG: RENDER MilestonesSection mounted = true", { 
    totalAchievementsPassed: safeAchievements.length,
    unlockedCount: unlockedAchievements.length
  })
  
  const [expanded, setExpanded] = useState(false)
  
  const visibleMilestones = expanded ? unlockedAchievements : unlockedAchievements.slice(0, maxVisible)
  const hasMore = unlockedAchievements.length > maxVisible

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--text-muted)' }}>
        <Award size={16} /> CAREER ACHIEVEMENTS
      </h4>
      
      {unlockedAchievements.length === 0 ? (
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>No achievements obtained yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <AnimatePresence>
            {visibleMilestones.map((milestone) => {
              const IconComponent = (LucideIcons as any)[milestone.icon] || LucideIcons.Trophy
              
              return (
                <motion.div 
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="chip" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.4rem 0.75rem', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '16px',
                    color: 'var(--text)',
                    width: 'max-content'
                  }}
                  title={milestone.description}
                >
                  <IconComponent size={14} style={{ color: 'var(--cyan)' }} />
                  <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{milestone.title}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {hasMore && (
            <button 
              className="chip"
              onClick={() => setExpanded(!expanded)}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.25rem', 
                padding: '0.4rem 0.75rem', 
                background: 'var(--surface-raised)', 
                border: '1px solid var(--border)',
                borderRadius: '16px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                width: 'max-content'
              }}
            >
              {expanded ? (
                <><ChevronUp size={14} /> Show less</>
              ) : (
                <><ChevronDown size={14} /> View all ({unlockedAchievements.length})</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
