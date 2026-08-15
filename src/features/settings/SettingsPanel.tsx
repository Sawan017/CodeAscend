import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X } from 'lucide-react'
import type { Settings, ThemeMode } from '../../types'

type SettingsPanelProps = {
  settings: Settings
  onSettingsChange: (next: Settings) => void
  onSignOut?: (forgetAccount: boolean) => void
}

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'aurora', label: 'Aurora' },
]

export function SettingsPanel({ settings, onSettingsChange, onSignOut }: SettingsPanelProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  
  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="section-shell">
      <div className="panel" style={{ padding: '2rem', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '2rem' }}>System Settings</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Theme</h4>
            <select style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} value={settings.theme} onChange={(event) => onSettingsChange({ ...settings, theme: event.target.value as ThemeMode })}>
              {themeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          
          <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Animations</h4>
            <select style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} value={settings.animationIntensity} onChange={(event) => onSettingsChange({ ...settings, animationIntensity: event.target.value as Settings['animationIntensity'] })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="drawer-toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>Sound effects</span>
              <button className={`toggle-switch ${settings.soundEffects ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, soundEffects: !settings.soundEffects })} aria-label="Toggle sound effects" />
            </div>
          </div>
          
          <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="drawer-toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>Reduced motion</span>
              <button className={`toggle-switch ${settings.reducedMotion ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, reducedMotion: !settings.reducedMotion })} aria-label="Toggle reduced motion" />
            </div>
          </div>
          
          <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="drawer-toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>Streak tracking</span>
              <button className={`toggle-switch ${settings.streakTracking ? 'on' : ''}`} onClick={() => onSettingsChange({ ...settings, streakTracking: !settings.streakTracking })} aria-label="Toggle streak tracking" />
            </div>
          </div>
        </div>
        
        {onSignOut && (
          <div style={{ marginTop: '3rem', maxWidth: '600px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.2rem' }}>Account</h4>
            <div className="drawer-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Sign Out</h5>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sign out of your current session.</p>
              </div>
              <button 
                onClick={() => setShowLogoutDialog(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>

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
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Sign out?</h3>
              <button className="icon-button" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }} onClick={() => setShowLogoutDialog(false)} aria-label="Cancel sign out">
                <X size={24} />
              </button>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>Do you want to forget this account from this device, or keep it remembered?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button className="primary-btn" style={{ padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} onClick={() => { setShowLogoutDialog(false); onSignOut?.(false); }}>
                Remember account
              </button>
              <button className="secondary-btn" style={{ padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} onClick={() => { setShowLogoutDialog(false); onSignOut?.(true); }}>
                Forget account
              </button>
              <button className="secondary-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.875rem', fontSize: '1.05rem', justifyContent: 'center', width: '100%' }} onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
