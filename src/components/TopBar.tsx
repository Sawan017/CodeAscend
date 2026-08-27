import { PlayCircle, Settings as SettingsIcon, Bell, Shield } from 'lucide-react'
import type { Progression, UserProfile, ActiveSessionState, SectionId } from '../types'
import type { House } from 'lucide-react'
import { XpProgressBar } from './XpProgressBar'

type NavSection = { id: SectionId; label: string; icon: typeof House }

type TopBarProps = {
  progression: Progression
  profile: UserProfile
  onOpenSettings?: () => void
  onOpenNotifications?: () => void
  unreadCount?: number
  activeSession?: ActiveSessionState | null
  activeSessionElapsed?: number
  onOpenActiveSession?: () => void
  /* Navigation */
  sections?: NavSection[]
  activeView?: string
  onSelectSection?: (id: SectionId) => void
  chatUnread?: number
  isGlobalAdmin?: boolean
}

export function TopBar({
  progression, profile, onOpenSettings, onOpenNotifications, unreadCount = 0,
  activeSession, activeSessionElapsed, onOpenActiveSession,
  sections = [], activeView = 'dashboard', onSelectSection, chatUnread = 0, isGlobalAdmin = false,
}: TopBarProps) {
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

  const isActive = (id: string) => activeView === id || activeView.startsWith(id.replace('s', ''))

  return (
    <header style={{
      display: 'flex', alignItems: 'center',
      padding: '0 28px', height: '56px',
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(140, 135, 125, 0.12)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      gap: '0',
    }}>
      {/* ── Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '32px', flexShrink: 0 }}>
        <div style={{
          width: '26px', height: '26px',
          background: 'linear-gradient(135deg, #3EA354, #2f855a)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '-0.5px',
        }}>CA</div>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1D1B', letterSpacing: '-0.3px' }}>
          Code<span style={{ color: '#3EA354' }}>Ascend</span>
        </span>
      </div>

      {/* ── Nav Tabs ── */}
      <nav style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '2px', flex: 1, minWidth: 0 }}>
        {sections.map((section) => {
          const Icon = section.icon
          const active = isActive(section.id)
          return (
            <button
              key={section.id}
              onClick={() => onSelectSection?.(section.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0 14px', height: '100%',
                background: 'transparent', border: 'none',
                color: active ? '#3EA354' : '#5A5750',
                fontSize: '0.85rem', fontWeight: active ? 700 : 600,
                cursor: 'pointer', position: 'relative',
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#1E1D1B'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#5A5750'; }}
            >
              <Icon size={16} />
              <span className="topnav-label">{section.label}</span>

              {/* Chat unread badge */}
              {section.id === 'chat' && chatUnread > 0 && (
                <span style={{
                  background: '#3EA354', color: '#fff', fontSize: '0.6rem', fontWeight: 800,
                  padding: '1px 5px', borderRadius: '8px', lineHeight: 1.3,
                }}>{chatUnread}</span>
              )}

              {/* Active underline */}
              {active && (
                <div style={{
                  position: 'absolute', bottom: 0, left: '12px', right: '12px',
                  height: '2.5px', background: '#3EA354', borderRadius: '2px 2px 0 0',
                }} />
              )}
            </button>
          )
        })}

        {isGlobalAdmin && (
          <button
            onClick={() => onSelectSection?.('admin_support' as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0 14px', height: '100%',
              background: 'transparent', border: 'none',
              color: activeView === 'admin_support' ? '#f59e0b' : '#9A958C',
              fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            <Shield size={16} />
            <span className="topnav-label">Admin</span>
            {activeView === 'admin_support' && (
              <div style={{
                position: 'absolute', bottom: 0, left: '12px', right: '12px',
                height: '2.5px', background: '#f59e0b', borderRadius: '2px 2px 0 0',
              }} />
            )}
          </button>
        )}
      </nav>

      {/* ── Right controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
        {activeSession && (
          <button
            onClick={onOpenActiveSession}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(62, 163, 84, 0.08)', border: '1px solid rgba(62, 163, 84, 0.2)',
              color: '#3EA354', padding: '5px 12px', borderRadius: '100px',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <PlayCircle size={13} />
            {sessionText}
          </button>
        )}

        <div style={{ display: 'none' }} className="desktop-only-xp">
          <XpProgressBar xp={progression.xp} compact={true} />
        </div>
        <style>{`
          @media (min-width: 900px) {
            .desktop-only-xp { display: block !important; width: 180px; }
          }
          @media (max-width: 900px) {
            .topnav-label { display: none; }
          }
        `}</style>

        {onOpenNotifications && (
          <button
            style={{
              position: 'relative',
              background: 'transparent', border: '1px solid rgba(140, 135, 125, 0.12)',
              borderRadius: '10px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5A5750', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={onOpenNotifications}
            aria-label="Notifications"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F2F1EC'; e.currentTarget.style.color = '#1E1D1B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5A5750'; }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                background: '#D34B4B', color: '#fff',
                fontSize: '0.55rem', fontWeight: 'bold',
                width: '15px', height: '15px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        )}

        {onOpenSettings && (
          <button
            style={{
              background: 'transparent', border: '1px solid rgba(140, 135, 125, 0.12)',
              borderRadius: '10px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5A5750', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={onOpenSettings}
            aria-label="Settings"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F2F1EC'; e.currentTarget.style.color = '#1E1D1B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5A5750'; }}
          >
            <SettingsIcon size={16} />
          </button>
        )}

        {/* Profile avatar */}
        <div
          style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: profile.avatar ? 'transparent' : 'linear-gradient(135deg, #3EA354, #2f855a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.8rem', fontWeight: 800,
            cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
            border: '2px solid rgba(140, 135, 125, 0.12)',
          }}
          onClick={() => onSelectSection?.('profile' as any)}
          title="View Profile"
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            profile.displayName?.charAt(0)?.toUpperCase() || 'U'
          )}
        </div>
      </div>
    </header>
  )
}
