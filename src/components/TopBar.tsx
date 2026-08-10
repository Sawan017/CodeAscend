import { UserCircle2, Search } from 'lucide-react'
import type { Progression, UserProfile } from '../types'
import { calculateLevel, getNameColorClass } from '../lib/progression'

type TopBarProps = {
  progression: Progression
  profile: UserProfile
  onOpenDrawer: () => void
  onOpenSearch?: () => void
}

export function TopBar({ progression, profile, onOpenDrawer, onOpenSearch }: TopBarProps) {
  const level = calculateLevel(progression.xp)
  const nameColorClass = getNameColorClass(level)
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark" />
        <div>
          <p className="eyebrow">FUTUREME</p>
          <h2>Career World</h2>
        </div>
      </div>
      <div className="hud-right">
        <div className="hud-chip"><span>LEVEL</span><strong>{String(level).padStart(2, '0')}</strong></div>
        <div className="hud-chip"><span>XP</span><strong>{progression.xp}</strong></div>
        <div className="hud-chip"><span>@{profile.username}</span><strong className={nameColorClass}>{profile.displayName || profile.username}</strong></div>
        {onOpenSearch && (
          <button className="icon-button" onClick={onOpenSearch} aria-label="Search developers">
            <Search size={18} />
          </button>
        )}
        <button className="icon-button" onClick={onOpenDrawer} aria-label="Open player drawer">
          <UserCircle2 size={18} />
        </button>
      </div>
    </header>
  )
}
