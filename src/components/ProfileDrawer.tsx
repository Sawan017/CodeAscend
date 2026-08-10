import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, X, Check, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Settings, ThemeMode, UserProfile } from '../types'
import type { AuthUser } from '../lib/auth'
import { checkUsernameAvailability } from '../lib/api'

type ProfileDrawerProps = {
  open: boolean
  profile: UserProfile
  settings: Settings
  user?: AuthUser | null
  onClose: () => void
  onSettingsChange: (next: Settings) => void
  onProfileChange: (next: UserProfile) => void
  onSignOut?: (forgetAccount: boolean) => void
}

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'aurora', label: 'Aurora' },
]

export function ProfileDrawer({ open, profile, settings, user, onClose, onSettingsChange, onProfileChange, onSignOut }: ProfileDrawerProps) {
  const updateProfile = (patch: Partial<UserProfile>) => {
    onProfileChange({ ...profile, ...patch })
  }
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Debounced username availability check
  useEffect(() => {
    if (!open || !user) return

    const timeout = setTimeout(async () => {
      const isAvailable = await checkUsernameAvailability(profile.username, user.id)
      setUsernameStatus(isAvailable ? 'available' : 'taken')
    }, 500)

    return () => clearTimeout(timeout)
  }, [profile.username, open, user])

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="drawer-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
            <div className="drawer-header">
              <div>
                <p className="eyebrow">PLAYER</p>
                <h3>Profile & Settings</h3>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close profile drawer">
                <X size={18} />
              </button>
            </div>

            <div className="drawer-section">
              <div className="drawer-card">
                <div className="avatar-badge">{profile.displayName?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase() || 'S'}</div>
                <div>
                  <h4>{profile.displayName || profile.username}</h4>
                  <p className="muted">@{profile.username} · Level {profile.level}</p>
                </div>
              </div>

            </div>

            <div className="drawer-section">
              <p className="eyebrow">EDIT PROFILE</p>
              <div className="drawer-card">
                <h4>User ID</h4>
                <div className="username-input-row">
                  <input value={profile.username} onChange={(event) => updateProfile({ username: event.target.value })} />
                  {usernameStatus === 'available' && <Check size={18} className="username-status-icon available" />}
                  {usernameStatus === 'taken' && <XCircle size={18} className="username-status-icon taken" />}
                </div>
                {usernameStatus === 'taken' && <p className="username-error">This username is already taken</p>}
                {usernameStatus === 'available' && <p className="username-success">Username is available</p>}
              </div>
              <div className="drawer-card">
                <h4>Display name</h4>
                <input value={profile.displayName} onChange={(event) => updateProfile({ displayName: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Avatar URL</h4>
                <input value={profile.avatar || ''} onChange={(event) => updateProfile({ avatar: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Bio</h4>
                <input value={profile.bio || ''} onChange={(event) => updateProfile({ bio: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Title</h4>
                <input value={profile.title} onChange={(event) => updateProfile({ title: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Introduction</h4>
                <textarea value={profile.introduction} onChange={(event) => updateProfile({ introduction: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Education</h4>
                <input value={profile.education} onChange={(event) => updateProfile({ education: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Focus</h4>
                <input value={profile.focus} onChange={(event) => updateProfile({ focus: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Technologies (comma separated)</h4>
                <input value={profile.technologies.join(', ')} onChange={(event) => updateProfile({ technologies: event.target.value.split(',').map((tech) => tech.trim()).filter(Boolean) })} />
              </div>
              <div className="drawer-card">
                <h4>GitHub</h4>
                <input value={profile.github} onChange={(event) => updateProfile({ github: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>LinkedIn</h4>
                <input value={profile.linkedin} onChange={(event) => updateProfile({ linkedin: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Contact</h4>
                <input value={profile.contact} onChange={(event) => updateProfile({ contact: event.target.value })} />
              </div>
              <div className="drawer-card">
                <div className="drawer-toggle-row">
                  <span>Public contact email</span>
                  <button className={`toggle-switch ${profile.contactPublic ? 'on' : ''}`} onClick={() => updateProfile({ contactPublic: !profile.contactPublic })} aria-label="Toggle public contact" />
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <p className="eyebrow">SETTINGS</p>
              <div className="drawer-card">
                <h4>Theme</h4>
                <select value={settings.theme} onChange={(event) => onSettingsChange({ ...settings, theme: event.target.value as ThemeMode })}>
                  {themeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="drawer-card">
                <h4>Animations</h4>
                <select value={settings.animationIntensity} onChange={(event) => onSettingsChange({ ...settings, animationIntensity: event.target.value as Settings['animationIntensity'] })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="drawer-card">
                <div className="drawer-toggle-row">
                  <span>Sound effects</span>
                  <button className={`toggle-switch ${settings.soundEffects ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, soundEffects: !settings.soundEffects })} aria-label="Toggle sound effects" />
                </div>
              </div>
              <div className="drawer-card">
                <div className="drawer-toggle-row">
                  <span>Reduced motion</span>
                  <button className={`toggle-switch ${settings.reducedMotion ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, reducedMotion: !settings.reducedMotion })} aria-label="Toggle reduced motion" />
                </div>
              </div>
              <div className="drawer-card">
                <div className="drawer-toggle-row">
                  <span>Streak tracking</span>
                  <button className={`toggle-switch ${settings.streakTracking ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, streakTracking: !settings.streakTracking })} aria-label="Toggle streak tracking" />
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <p className="eyebrow">ACCOUNT</p>
              {user ? (
                <div className="drawer-card">
                  <div className="drawer-toggle-row">
                    <div>
                      <h4>Signed in</h4>
                      <p>{user.email}</p>
                    </div>
                    <button className="secondary-btn" onClick={() => setShowLogoutDialog(true)}><LogOut size={14} /> Sign out</button>
                  </div>
                </div>
              ) : (
                <div className="drawer-card">
                  <p className="muted">Demo mode — data saves locally. Sign in with Google to sync across devices.</p>
                </div>
              )}
            </div>
          </motion.aside>
          
          <AnimatePresence>
            {showLogoutDialog && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                style={{ 
                  position: 'fixed', 
                  top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: 'rgba(0, 0, 0, 0.75)', 
                  backdropFilter: 'blur(8px)', 
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
                onClick={(e) => { if (e.target === e.currentTarget) setShowLogoutDialog(false) }}
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 15 }}
                  className="drawer-card" 
                  style={{ 
                    width: '100%', 
                    maxWidth: '420px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
                    padding: '2rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Sign out</h3>
                    <button className="icon-button" onClick={() => setShowLogoutDialog(false)} aria-label="Cancel sign out">
                      <X size={24} />
                    </button>
                  </div>
                  <p className="muted" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>Would you like to remember this account on this device?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button className="primary-btn" style={{ padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center' }} onClick={() => { setShowLogoutDialog(false); onSignOut?.(false); }}>
                      Remember this account
                    </button>
                    <button className="secondary-btn" style={{ padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center' }} onClick={() => { setShowLogoutDialog(false); onSignOut?.(true); }}>
                      Forget this account
                    </button>
                    <button className="secondary-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center' }} onClick={() => setShowLogoutDialog(false)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : null}
    </AnimatePresence>
  )
}