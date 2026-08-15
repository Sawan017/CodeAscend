import { motion } from 'framer-motion'
import { Compass, GraduationCap, House, Layers3, Target, Trophy } from 'lucide-react'
import type { Progression, SectionId, UserProfile } from '../types'
import { calculateLevel, calculateProgressToNextLevel } from '../lib/progression'

const sections: Array<{ id: SectionId; label: string; icon: typeof House }> = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'profile', label: 'Profile', icon: House },
  { id: 'projects', label: 'Projects', icon: Layers3 },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'future', label: 'Future', icon: Compass },
]

// Node positions are anchored as percentages. The wrapper holds the centering
// translate so hover transforms on the inner button never displace the node.
const positions: Partial<Record<SectionId, { left: string; top: string }>> = {
  dashboard: { left: '35%', top: '25%' },
  profile: { left: '20%', top: '50%' },
  projects: { left: '80%', top: '50%' },
  learning: { left: '35%', top: '75%' },
  goals: { left: '65%', top: '25%' },
  achievements: { left: '65%', top: '75%' },
  friends: { left: '80%', top: '60%' },
  chat: { left: '80%', top: '40%' },
  future: { left: '50%', top: '15%' },
}

type CareerWorldProps = {
  activeSection: SectionId
  onSelectSection: (section: SectionId) => void
  progression: Progression
  profile?: UserProfile
}

export function CareerWorld({ activeSection, onSelectSection, progression, profile }: CareerWorldProps) {
  const level = calculateLevel(progression.xp)
  const levelLabel = String(level).padStart(2, '0')
  const xpLabel = progression.xp.toLocaleString()
  const { progress } = calculateProgressToNextLevel(progression.xp)
  const playerName = (profile?.arinova_id || profile?.displayName || profile?.username || 'DEVELOPER').toUpperCase()

  return (
    <motion.section
      className="map-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">CAREER WORLD</p>
          <h3>Developer progression map</h3>
          <p>Each node is a milestone in your growth arc.</p>
        </div>
        <div className="hero-badge">LIVE</div>
      </div>

      <div className="map-canvas">
        <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20 50 L35 25 L50 15" />
          <path d="M50 15 L65 25 L80 50" />
          <path d="M80 50 L65 75 L35 75" />
          <path d="M35 75 L20 50" />
          <path d="M50 50 L35 25" />
          <path d="M50 50 L65 25" />
          <path d="M50 50 L35 75" />
          <path d="M50 50 L65 75" />
        </svg>

        {/* Central level / XP core */}
        <div className="core-node">
          <div className="core-ring" />
          <div className="core-body">
            <span>{playerName}</span>
            <strong>LEVEL {levelLabel}</strong>
            <small>{xpLabel} XP</small>
            <div className="core-progress">
              <div className="progress-bar"><div style={{ width: `${Math.round(progress)}%` }} /></div>
            </div>
          </div>
        </div>

        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          const position = positions[section.id]
          if (!position) return null
          // Simple progression state: profile is "current", others are "available"
          const stateClass = isActive ? 'current' : 'available'
          return (
            <div key={section.id} className="node-anchor" style={{ left: position.left, top: position.top }}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`world-node ${stateClass}`}
                onClick={() => onSelectSection(section.id)}
                aria-label={section.label}
              >
                <span className="world-node-icon"><Icon size={14} /></span>
                <span>{section.label}</span>
              </motion.button>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}