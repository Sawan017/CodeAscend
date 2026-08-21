// @ts-nocheck
import { motion } from 'framer-motion'
import { Save, AlertTriangle, Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { uploadProfileImage } from '../../lib/storage_upload'
import type { UserProfile } from '../../types'
import { supabase } from '../../lib/supabase'
import { Avatar } from '../../components/Avatar'

type EditProfilePanelProps = {
  dynamicMilestones?: any[];

  profile: UserProfile
  badges?: any[]
  projects?: any[]
  skills?: any[]
  achievements?: any[]
  userId?: string
  onClose: () => void
  onProfileChange: (next: UserProfile) => void
  onSaveProfile?: (next: UserProfile) => void
}

export function EditProfilePanel({ profile, badges = [], projects = [], skills = [], achievements = [], userId, onClose, onProfileChange, onSaveProfile }: EditProfilePanelProps) {
  console.log("DEBUG: RENDER EditProfilePanel mounted = true", { userId })
  
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [draftEmail, setDraftEmail] = useState<string>('')
  const [originalEmail, setOriginalEmail] = useState<string>('')
  const [emailUpdateMsg, setEmailUpdateMsg] = useState<string | null>(null)
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar || null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner || null)
  const [isUploading, setIsUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

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

  const hasUnsavedChanges = JSON.stringify(draftProfile) !== JSON.stringify(profile) || draftEmail !== originalEmail || avatarFile !== null || bannerFile !== null || avatarPreview !== (profile.avatar || null) || bannerPreview !== (profile.banner || null)

  const updateDraft = (patch: Partial<UserProfile>) => {
    setDraftProfile({ ...draftProfile, ...patch })
  }

  const handleSave = async () => {
    setIsUploading(true)
    const nextProfile = { ...draftProfile }

    const targetUserId = userId || profile.userId || profile.id

    if (avatarFile && targetUserId) {
      const url = await uploadProfileImage(targetUserId, avatarFile, 'avatar')
      if (url) nextProfile.avatar = url
    } else if (avatarPreview === null) {
      nextProfile.avatar = ''
    }

    if (bannerFile && targetUserId) {
      const url = await uploadProfileImage(targetUserId, bannerFile, 'banner')
      if (url) nextProfile.banner = url
    } else if (bannerPreview === null) {
      nextProfile.banner = ''
    }
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
      onSaveProfile(nextProfile)
    } else {
      onProfileChange(nextProfile)
    }
    setDraftProfile(nextProfile)
    setAvatarFile(null)
    setBannerFile(null)
    setIsUploading(false)
    setShowConfirmClose(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) return alert('Please select an image file.')
      if (file.size > 5 * 1024 * 1024) return alert('File size must be under 5MB.')
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) return alert('Please select an image file.')
      if (file.size > 5 * 1024 * 1024) return alert('File size must be under 5MB.')
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
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
            <button onClick={handleSave} className="primary-btn" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }} disabled={!hasUnsavedChanges || isUploading}>
              <Save size={16} /> {isUploading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        <div style={{ padding: '2rem', flex: 1, display: 'flex', gap: '3rem', width: '100%', overflowY: 'auto', alignItems: 'flex-start' }}>
          
          {/* Left Side: Editor Form */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
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

            {/* Visual Identity section removed from here as per instructions */}

            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Basic Information</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>User ID (Login)</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', outline: 'none' }} value={draftProfile.login_id || draftProfile.username} readOnly disabled title="User ID is permanent and cannot be changed" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Display Name</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.displayName} onChange={(event) => updateDraft({ displayName: event.target.value })} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Primary Role</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.title || ''} onChange={(event) => updateDraft({ title: event.target.value })} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Bio / About Me</label>
                  <textarea style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', minHeight: '100px', resize: 'vertical' }} value={draftProfile.bio || ''} onChange={(event) => updateDraft({ bio: event.target.value })} />
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Contact & Social Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Email Address</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} placeholder="your@email.com" />
                  {emailUpdateMsg && <span style={{ fontSize: '0.8rem', color: emailUpdateMsg.includes('failed') ? '#ef4444' : '#10b981' }}>{emailUpdateMsg}</span>}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Show Email Publicly?</span>
                  <button className={`toggle-switch ${draftProfile.contactPublic ? 'on' : ''}`} onClick={() => updateDraft({ contactPublic: !draftProfile.contactPublic, contact: draftEmail })} aria-label="Toggle public contact" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>GitHub Profile URL</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.github || ''} onChange={(event) => updateDraft({ github: event.target.value })} placeholder="https://github.com/..." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>LinkedIn Profile URL</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.linkedin || ''} onChange={(event) => updateDraft({ linkedin: event.target.value })} placeholder="https://linkedin.com/in/..." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>Portfolio / Website</label>
                  <input style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }} value={draftProfile.portfolio || ''} onChange={(event) => updateDraft({ portfolio: event.target.value })} placeholder="https://..." />
                </div>
              </div>
            </div>

          </div>

            {/* Achievements Section */}
            <div className="panel" style={{ padding: '1.5rem', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>Achievements</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Selected: {draftProfile.displayedAchievements?.length || 0}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {achievements.filter((a: any) => a.unlocked).length === 0 ? (
                  <p className="muted" style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>No achievements earned yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {achievements.filter((a: any) => a.unlocked).map((a: any) => {
                      const isSelected = draftProfile.displayedAchievements?.includes(a.id)
                      return (
                        <button
                          key={a.id}
                          className="chip"
                          onClick={() => {
                            const current = draftProfile.displayedAchievements || []
                            if (isSelected) {
                              updateDraft({ displayedAchievements: current.filter(id => id !== a.id) })
                            } else {
                              updateDraft({ displayedAchievements: [...current, a.id] })
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
                          <span style={{ fontSize: '0.85rem' }}>{a.title}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

          {/* Right Side: Live Profile Preview */}
          <div style={{ flex: 1, position: 'sticky', top: 0 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Live Preview</p>
            <div style={{ 
              background: 'var(--surface-sunken)', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: '1px solid var(--border)'
            }}>
              <input type="file" accept="image/*" ref={bannerInputRef} style={{ display: 'none' }} onChange={handleBannerChange} />
              <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />

              {/* Banner */}
              <div 
                style={{ 
                  height: '120px', 
                  width: '100%', 
                  background: bannerPreview 
                    ? `url(${bannerPreview}) center/cover no-repeat` 
                    : 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
                  position: 'relative',
                  borderBottom: '1px solid rgba(0,0,0,0.2)'
                }} 
              >
                {/* Permanent Edit Button for Banner */}
                <div 
                  onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }}
                  style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    padding: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    borderRadius: '50%', color: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  title="Edit Banner"
                >
                  <Pencil size={18} />
                </div>
                {bannerPreview && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setBannerFile(null); setBannerPreview(null); }}
                    style={{ 
                      position: 'absolute', top: '10px', right: '54px', 
                      padding: '0.5rem', background: 'rgba(239, 68, 68, 0.6)', backdropFilter: 'blur(4px)',
                      borderRadius: '50%', color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    title="Remove Banner"
                  >
                    <Trash2 size={18} />
                  </div>
                )}
              </div>

              {/* Header Info */}
              <div style={{ padding: '0 1.25rem', position: 'relative' }}>
                <div style={{ position: 'relative', marginTop: '-36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  
                  {/* Avatar Container with relative positioning for absolute edit buttons */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ borderRadius: '50%', border: '6px solid var(--surface-sunken)', background: 'var(--surface-sunken)' }}>
                      <Avatar src={avatarPreview} alt="Avatar" size={80} isOnline={true} showStatus={true} />
                    </div>

                    {/* Permanent Edit Button for Avatar */}
                    <div 
                      onClick={() => avatarInputRef.current?.click()}
                      style={{ 
                        position: 'absolute', top: '-4px', right: '-4px', 
                        padding: '0.4rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                        borderRadius: '50%', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 10
                      }}
                      title="Edit Avatar"
                    >
                      <Pencil size={14} />
                    </div>
                    
                    {avatarPreview && (
                      <div 
                        onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                        style={{ 
                          position: 'absolute', top: '28px', right: '-24px', 
                          padding: '0.4rem', background: 'rgba(239, 68, 68, 0.7)', backdropFilter: 'blur(4px)',
                          borderRadius: '50%', color: 'white', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                          zIndex: 10
                        }}
                        title="Remove Avatar"
                      >
                        <Trash2 size={14} />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    {draftProfile.displayName || 'Display Name'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                      @{draftProfile.login_id || draftProfile.username}
                    </p>
                    {draftProfile.title && (
                      <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc', border: 'none', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                        {draftProfile.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Discord-style details block */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                  {draftProfile.bio && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>About Me</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4, color: '#ddd', whiteSpace: 'pre-wrap' }}>{draftProfile.bio}</p>
                    </div>
                  )}

                  <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Operative Stats</h4>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Level</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{draftProfile.level || 1}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Total XP</span>
                      <strong style={{ fontSize: '1rem', color: '#fff' }}>{draftProfile.xp || 0}</strong>
                    </div>
                  </div>
                  
                  {(badges.length > 0 || projects.length > 0 || skills.length > 0) && (
                    <>
                      <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Activity</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {badges.length > 0 && <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#ccc' }}>{badges.length} Badges</span>}
                        {projects.length > 0 && <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#ccc' }}>{projects.length} Projects</span>}
                        {skills.length > 0 && <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#ccc' }}>{skills.length} Skills</span>}
                      </div>
                    </>
                  )}

                  {((draftProfile.contactPublic && draftEmail) || draftProfile.github || draftProfile.linkedin || draftProfile.portfolio) && (
                    <>
                      <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Links</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {draftProfile.github && <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--primary)' }}>GitHub</div>}
                        {draftProfile.linkedin && <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--primary)' }}>LinkedIn</div>}
                        {draftProfile.portfolio && <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--primary)' }}>Website</div>}
                        {draftProfile.contactPublic && draftEmail && <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--primary)' }}>Email</div>}
                      </div>
                    </>
                  )}

                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}