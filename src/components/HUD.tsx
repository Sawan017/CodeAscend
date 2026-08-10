import { Sparkles } from 'lucide-react'
import type { Progression } from '../types'
import { calculateProgressToNextLevel } from '../lib/progression'

type HUDProps = {
  progression: Progression
  completedGoals: number
  masteredSkills: number
  earnedBadges: number
}

export function HUD({ progression, completedGoals, masteredSkills, earnedBadges }: HUDProps) {
  const { level, progress } = calculateProgressToNextLevel(progression.xp)

  return (
    <section className="hud-card" aria-label="Player status">
      <div className="status-top">
        <div>
          <p className="eyebrow">PLAYER HUD</p>
          <h3>Developer signal</h3>
        </div>
        <Sparkles size={18} />
      </div>
      <div className="radial-progress" style={{ background: `conic-gradient(#22d3ee ${progress}%, rgba(255,255,255,0.08) 0 100%)` }}>
        <div className="radial-inner">
          <strong>{Math.round(progress)}%</strong>
          <span>to next level</span>
        </div>
      </div>
      <div className="status-rows">
        <div><span>Level</span><strong>{level}</strong></div>
        <div><span>XP</span><strong>{progression.xp}</strong></div>
        <div><span>Projects</span><strong>{progression.projectsCompleted}</strong></div>
        <div><span>Goals</span><strong>{completedGoals}</strong></div>
        <div><span>Skills</span><strong>{masteredSkills}</strong></div>
        <div><span>Badges</span><strong>{earnedBadges}</strong></div>
        <div><span>Streak</span><strong>🔥 {progression.streak}</strong></div>
      </div>
    </section>
  )
}
