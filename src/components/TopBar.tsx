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

  const SECTION_COLORS: Record<string, { hex: string, rgb: string }> = {
    'dashboard': { hex: '#3EA354', rgb: '62, 163, 84' },
    'learning': { hex: '#3B82F6', rgb: '59, 130, 246' },
    'projects': { hex: '#F59E0B', rgb: '245, 158, 11' },
    'achievements': { hex: '#EAB308', rgb: '234, 179, 8' },
    'chat': { hex: '#8B5CF6', rgb: '139, 92, 246' },
    'goals': { hex: '#14B8A6', rgb: '20, 184, 166' },
    'todo': { hex: '#8B5CF6', rgb: '139, 92, 246' },
    'future': { hex: '#06B6D4', rgb: '6, 182, 212' },
    'career_world': { hex: '#F43F5E', rgb: '244, 63, 94' },
    'admin_support': { hex: '#F59E0B', rgb: '245, 158, 11' },
  }

  return (
    <header style={{
      display: 'flex', alignItems: 'center',
      padding: '0 24px', height: '64px',
      margin: '16px 24px', borderRadius: '16px',
      background: 'rgba(252, 253, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(140, 135, 125, 0.15)',
      position: 'sticky', top: '16px', zIndex: 100,
      boxShadow: '0 4px 24px -6px rgba(0,0,0,0.05)',
      gap: '0',
    }}>
      {/* ── Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '40px', flexShrink: 0 }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #3EA354, #2a7a40)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '-0.5px',
          boxShadow: '0 2px 8px rgba(62, 163, 84, 0.25)'
        }}>AR</div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E1D1B', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
            ARINOVA
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: '#9A958C', textTransform: 'uppercase' }}>
            Platform
          </span>
        </div>
      </div>

      {/* ── Nav Tabs ── */}
      <nav style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '4px', flex: 1, minWidth: 0 }}>
        {sections.map((section) => {
          const Icon = section.icon
          const active = isActive(section.id)
          const theme = SECTION_COLORS[section.id] || SECTION_COLORS['dashboard']
          return (
            <button
              key={section.id}
              onClick={() => onSelectSection?.(section.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px',
                background: active ? `rgba(${theme.rgb}, 0.12)` : 'transparent',
                border: '1px solid',
                borderColor: active ? `rgba(${theme.rgb}, 0.15)` : 'transparent',
                borderRadius: '10px',
                color: active ? theme.hex : '#5A5750',
                fontSize: '0.85rem', fontWeight: active ? 700 : 600,
                cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = `rgba(${theme.rgb}, 0.06)`
                  e.currentTarget.style.color = '#1E1D1B'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#5A5750'
                }
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} style={{ color: active ? 'inherit' : `rgba(${theme.rgb}, 0.75)` }} />
              <span className="topnav-label">{section.label}</span>

              {/* Chat unread badge */}
              {section.id === 'chat' && chatUnread > 0 && (
                <span style={{
                  background: theme.hex, color: '#fff', fontSize: '0.6rem', fontWeight: 800,
                  padding: '1px 5px', borderRadius: '8px', lineHeight: 1.3,
                  marginLeft: '2px'
                }}>{chatUnread}</span>
              )}
            </button>
          )
        })}

        {isGlobalAdmin && (
          <button
            onClick={() => onSelectSection?.('admin_support' as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px',
              background: activeView === 'admin_support' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              border: '1px solid',
              borderColor: activeView === 'admin_support' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              borderRadius: '10px',
              color: activeView === 'admin_support' ? '#d97706' : '#9A958C',
              fontSize: '0.85rem', fontWeight: activeView === 'admin_support' ? 700 : 600,
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (activeView !== 'admin_support') {
                e.currentTarget.style.background = 'rgba(140, 135, 125, 0.08)'
                e.currentTarget.style.color = '#1E1D1B'
              }
            }}
            onMouseLeave={e => {
              if (activeView !== 'admin_support') {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#9A958C'
              }
            }}
          >
            <Shield size={16} strokeWidth={activeView === 'admin_support' ? 2.5 : 2} />
            <span className="topnav-label">Admin</span>
          </button>
        )}
      </nav>
      {/* --- Right controls --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px', position: 'relative' }}>

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

        {/* Normal Notification Icon (Always present) */}
        {onOpenNotifications && (
          <button
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(140, 135, 125, 0.15)',
              borderRadius: '50%', width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5A5750', cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
            onClick={onOpenNotifications}
            aria-label="Notifications"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#1E1D1B'; e.currentTarget.style.borderColor = 'rgba(140, 135, 125, 0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.color = '#5A5750'; e.currentTarget.style.borderColor = 'rgba(140, 135, 125, 0.15)'; e.currentTarget.style.transform = 'none'; }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                background: '#D34B4B', color: '#fff',
                fontSize: '0.55rem', fontWeight: 'bold',
                width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        )}

        {onOpenSettings && (
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(140, 135, 125, 0.15)',
              borderRadius: '50%', width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5A5750', cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
            onClick={onOpenSettings}
            aria-label="Settings"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#1E1D1B'; e.currentTarget.style.borderColor = 'rgba(140, 135, 125, 0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.color = '#5A5750'; e.currentTarget.style.borderColor = 'rgba(140, 135, 125, 0.15)'; e.currentTarget.style.transform = 'none'; }}
          >
            <SettingsIcon size={17} />
          </button>
        )}

        {/* Profile avatar */}
        <div
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: profile.avatar ? 'transparent' : 'linear-gradient(135deg, #3EA354, #2f855a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.85rem', fontWeight: 800,
            cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
            border: '2px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            marginLeft: '4px'
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

        {/* Floating Active Task container */}
        {activeSession && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 16px)',
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
            zIndex: 150
          }}>
            {/* Active Task Timer */}
            <button
              onClick={onOpenActiveSession}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)', 
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', padding: '10px 18px', borderRadius: '100px',
                fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 8px 16px -4px rgba(6,182,212,0.4)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(6,182,212,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(6,182,212,0.4)'; }}
            >
              <PlayCircle size={16} fill="rgba(255,255,255,0.2)" />
              {sessionText}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
