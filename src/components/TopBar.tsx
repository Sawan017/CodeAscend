import { UserCircle2, Search, PlayCircle } from 'lucide-react'
import type { Progression, UserProfile, ActiveSessionState } from '../types'
import { calculateLevel, getNameColorClass } from '../lib/progression'
import { XpProgressBar } from './XpProgressBar'

type TopBarProps = {
  progression: Progression
  profile: UserProfile
  onOpenDrawer: () => void
  onOpenSearch?: () => void
  activeSession?: ActiveSessionState | null
  activeSessionElapsed?: number
  onOpenActiveSession?: () => void
}

export function TopBar({ progression, profile, onOpenDrawer, onOpenSearch, activeSession, activeSessionElapsed, onOpenActiveSession }: TopBarProps) {
  const level = calculateLevel(progression.xp)
  const nameColorClass = getNameColorClass(level)

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(Math.abs(totalSeconds) / 60)
    const s = Math.abs(totalSeconds) % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  let sessionText = ''
  if (activeSession && activeSessionElapsed !== undefined) {
    const remaining = (activeSession.baselineTime * 60) - activeSessionElapsed
    const isOvertime = remaining < 0
    sessionText = `${isOvertime ? '+' : ''}${formatTime(remaining)}`
  }

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
        {activeSession && (
          <button 
            onClick={onOpenActiveSession}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', 
              color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '100px', 
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' 
            }}
          >
            <PlayCircle size={14} />
            {sessionText}
          </button>
        )}
        <div style={{ marginRight: '1rem', display: 'none' }} className="desktop-only-xp">
          <XpProgressBar xp={progression.xp} compact={true} />
        </div>
        <style>{`
          @media (min-width: 768px) {
            .desktop-only-xp { display: block !important; }
          }
        `}</style>
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
