import { PlayCircle, Settings as SettingsIcon, Bell } from 'lucide-react'
import type { Progression, UserProfile, ActiveSessionState } from '../types'
import { XpProgressBar } from './XpProgressBar'

type TopBarProps = {
  progression: Progression
  profile: UserProfile
  onOpenSettings?: () => void
  onOpenNotifications?: () => void
  unreadCount?: number
  activeSession?: ActiveSessionState | null
  activeSessionElapsed?: number
  onOpenActiveSession?: () => void
}

export function TopBar({ progression, profile, onOpenSettings, onOpenNotifications, unreadCount = 0, activeSession, activeSessionElapsed, onOpenActiveSession }: TopBarProps) {
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
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: 'rgba(3,4,7,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--cyan), var(--primary))', borderRadius: '8px', boxShadow: '0 0 15px rgba(6,182,212,0.4)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1 }}>SYSTEM LOGGED</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>{profile.displayName}</h2>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {activeSession && (
          <button 
            onClick={onOpenActiveSession}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', 
              color: 'var(--cyan)', padding: '6px 14px', borderRadius: '100px', 
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.15)'
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
            .desktop-only-xp { display: block !important; width: 250px; }
          }
        `}</style>
        
        {onOpenNotifications && (
          <button style={{ position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} onClick={onOpenNotifications} aria-label="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-base)' }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        )}

        {onOpenSettings && (
          <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} onClick={onOpenSettings} aria-label="Settings">
            <SettingsIcon size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
