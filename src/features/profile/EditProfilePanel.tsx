import { motion } from 'framer-motion'
import { Save, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { UserProfile } from '../../types'
import { supabase } from '../../lib/supabase'

type EditProfilePanelProps = {
  profile: UserProfile
  onClose: () => void
  onProfileChange: (next: UserProfile) => void
  onSaveProfile?: (next: UserProfile) => void
}

export function EditProfilePanel({ profile, onClose, onProfileChange, onSaveProfile }: EditProfilePanelProps) {
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [draftEmail, setDraftEmail] = useState<string>('')
  const [originalEmail, setOriginalEmail] = useState<string>('')
  const [emailUpdateMsg, setEmailUpdateMsg] = useState<string | null>(null)

  useEffect(() => {
    setDraftProfile(profile)
    setShowConfirmClose(false)
    setEmailUpdateMsg(null)
    
    // Fetch current auth email natively
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email && !user.email.includes('@internal.arinova.com') && !user.email.includes('@example.com')) {
          setDraftEmail(user.email)
          setOriginalEmail(user.email)
        }
      })
    }
  }, [profile])

  const hasUnsavedChanges = JSON.stringify(draftProfile) !== JSON.stringify(profile) || draftEmail !== originalEmail

  const updateDraft = (patch: Partial<UserProfile>) => {
    setDraftProfile({ ...draftProfile, ...patch })
  }

  const handleSave = async () => {
    if (draftEmail !== originalEmail && supabase && draftEmail) {
      const { error } = await supabase.auth.updateUser({ email: draftEmail })
      if (error) {
        setEmailUpdateMsg(`Email update failed: ${error.message}`)
        return
      } else {
        setEmailUpdateMsg('Email update requested. Check both your old and new email to confirm.')
        setOriginalEmail(draftEmail)
      }
    }

    if (onSaveProfile) {
      onSaveProfile(draftProfile)
    } else {
      onProfileChange(draftProfile)
    }
    setShowConfirmClose(false)
  }

  const handleAttemptClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmClose(true)
    } else {
      onClose()
    }
  }

  const handleDiscard = () => {
    setDraftProfile(profile)
    setShowConfirmClose(false)
    onClose()
  }

  return (
    <motion.section className="section-shell" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55 }}>
      <div className="panel" style={{ padding: '0', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(10,13,20,0.95)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--cyan)', margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>System Config</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#fff', fontWeight: 600, letterSpacing: '-0.02em' }}>Edit Operative Profile</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={handleAttemptClose} className="secondary-btn" style={{ padding: '0.5rem 1rem' }}>
              Cancel
            </button>
            <button onClick={handleSave} className="primary-btn" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }} disabled={!hasUnsavedChanges}>
              <Save size={16} /> Save Profile
            </button>
          </div>
        </div>

        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          {showConfirmClose && (
            <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600 }}>
                <AlertTriangle size={18} />
                <span>Save changes before leaving?</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>You have unsaved edits to your profile.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={handleSave} className="primary-btn" style={{ flex: 1, padding: '0.5rem' }}>Save Changes</button>
                <button onClick={handleDiscard} className="secondary-btn" style={{ flex: 1, padding: '0.5rem', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Discard</button>
                <button onClick={() => setShowConfirmClose(false)} className="secondary-btn" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
              </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, color: 'var(--cyan)' }}>
                  {draftProfile.displayName?.charAt(0).toUpperCase() || draftProfile.username?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>{draftProfile.displayName}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>@{draftProfile.login_id || draftProfile.arinova_id || draftProfile.username} <span style={{ margin: '0 6px', opacity: 0.5 }}>|</span> Level {draftProfile.level}</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Parameters</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>User ID (Login)</label>
                    <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', outline: 'none' }} value={draftProfile.login_id || draftProfile.arinova_id || draftProfile.username} readOnly disabled title="User ID is permanent and cannot be changed" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Email Address</label>
                    <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} placeholder="your@email.com" onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                    {emailUpdateMsg && <span style={{ fontSize: '0.8rem', color: emailUpdateMsg.includes('failed') ? '#ef4444' : '#10b981' }}>{emailUpdateMsg}</span>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Display Alias</label>
                    <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.displayName} onChange={(event) => updateDraft({ displayName: event.target.value })} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Avatar Image URL</label>
                    <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.avatar || ''} onChange={(event) => updateDraft({ avatar: event.target.value })} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Bio / Designation</label>
                    <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.bio || ''} onChange={(event) => updateDraft({ bio: event.target.value })} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Primary Role</label>
                    <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.title} onChange={(event) => updateDraft({ title: event.target.value })} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'} onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>
              </div>

              <div className="drawer-card">
                <h4>Education</h4>
                <input value={draftProfile.education} onChange={(event) => updateDraft({ education: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Focus</h4>
                <input value={draftProfile.focus} onChange={(event) => updateDraft({ focus: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Technologies (comma separated)</h4>
                <input value={draftProfile.technologies.join(', ')} onChange={(event) => updateDraft({ technologies: event.target.value.split(',').map((tech) => tech.trim()).filter(Boolean) })} />
              </div>
              <div className="drawer-card">
                <h4>GitHub</h4>
                <input value={draftProfile.github} onChange={(event) => updateDraft({ github: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>LinkedIn</h4>
                <input value={draftProfile.linkedin} onChange={(event) => updateDraft({ linkedin: event.target.value })} />
              </div>
              <div className="drawer-card">
                <h4>Contact</h4>
                <input value={draftProfile.contact} onChange={(event) => updateDraft({ contact: event.target.value })} />
              </div>
              <div className="drawer-card">
                <div className="drawer-toggle-row">
                  <span>Public contact email</span>
                  <button className={`toggle-switch ${draftProfile.contactPublic ? 'on' : ''}`} onClick={() => updateDraft({ contactPublic: !draftProfile.contactPublic })} aria-label="Toggle public contact" />
                </div>
              </div>
        </div>
      </div>
    </motion.section>
  )
}