import { motion } from 'framer-motion'
import { Save, X, Pencil, Trash2, Code, Globe, Link, Search, ArrowUpDown } from 'lucide-react'
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

export function EditProfilePanel({ profile, achievements = [], skills = [], dynamicMilestones = [], userId, onClose, onProfileChange, onSaveProfile }: EditProfilePanelProps) {
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile)
  const [draftEmail, setDraftEmail] = useState<string>('')
  
  const [achSearch, setAchSearch] = useState('')
  const [achSort, setAchSort] = useState<'default' | 'asc' | 'desc'>('default')
  const [skillSearch, setSkillSearch] = useState('')

  const [originalEmail, setOriginalEmail] = useState<string>('')
  const [emailUpdateMsg, setEmailUpdateMsg] = useState<string | null>(null)
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar || null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner || null)
  const [isUploading, setIsUploading] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false)
  const [achDropdownOpen, setAchDropdownOpen] = useState(false)
  const skillDropdownRef = useRef<HTMLDivElement>(null)
  const achDropdownRef = useRef<HTMLDivElement>(null)
  const [achDropdownStyle, setAchDropdownStyle] = useState<React.CSSProperties>({ right: 0 })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) {
        setSkillDropdownOpen(false)
      }
      if (achDropdownRef.current && !achDropdownRef.current.contains(event.target as Node)) {
        setAchDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (achDropdownOpen && achDropdownRef.current) {
      const rect = achDropdownRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const dropdownWidth = Math.min(420, viewportWidth - 32)
      const estimatedHeight = 350
      
      let newStyle: React.CSSProperties = {}
      
      // Vertical positioning
      if (rect.bottom + estimatedHeight > viewportHeight && rect.top > estimatedHeight) {
        newStyle.bottom = '100%'
        newStyle.marginBottom = '4px'
      } else {
        newStyle.top = '100%'
        newStyle.marginTop = '4px'
      }
      
      // Horizontal positioning
      if (rect.right - dropdownWidth < 16) {
        newStyle.left = 0
        
        // Check if anchoring left goes off the right edge
        if (rect.left + dropdownWidth > viewportWidth - 16) {
           // Fallback: fix it purely to the viewport
           newStyle = { position: 'fixed', left: '16px', right: '16px', width: 'auto' }
           if (rect.bottom + estimatedHeight > viewportHeight && rect.top > estimatedHeight) {
             newStyle.bottom = (viewportHeight - rect.top + 4) + 'px'
           } else {
             newStyle.top = (rect.bottom + 4) + 'px'
           }
        }
      } else {
        newStyle.right = 0
      }
      setAchDropdownStyle(newStyle)
    }
  }, [achDropdownOpen, draftProfile.displayedAchievements])

  useEffect(() => {
    setDraftProfile(profile)
    setEmailUpdateMsg(null)
    
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email && !user.email.includes('@internal.arinova.com') && !user.email.includes('@example.com')) {
          setDraftEmail(user.email)
          setOriginalEmail(user.email)
        }
      })
    }
  }, [profile])

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
        setIsUploading(false)
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
    
    setIsUploading(false)
    onClose()
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

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    marginTop: '0.25rem'
  }

  const labelStyle = {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  }

  const validDisplayedAchievements = (draftProfile.displayedAchievements || []).filter(id => 
    achievements.some(a => a.id === id) || (dynamicMilestones || []).some(m => m.id === id)
  )

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hidden file inputs */}
      <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
      <input type="file" ref={bannerInputRef} onChange={handleBannerChange} style={{ display: 'none' }} accept="image/*" />

      {/* Banner */}
      <div 
        style={{ 
          height: '180px', 
          width: '100%', 
          borderRadius: '16px',
          background: bannerPreview 
            ? `url(${bannerPreview}) center/cover no-repeat` 
            : 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
          position: 'relative',
          overflow: 'hidden'
        }} 
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,20,0.9), transparent)' }} />
        
        {/* Banner Edit Controls */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
          <button onClick={() => bannerInputRef.current?.click()} className="secondary-btn" style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Pencil size={16} /> Edit Banner
          </button>
          {bannerPreview && (
            <button onClick={() => { setBannerFile(null); setBannerPreview(null); }} className="secondary-btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '0 2rem' }}>
        {/* Profile Info Header */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            
            <div style={{ position: 'relative', borderRadius: '50%', padding: '6px', background: 'var(--bg-base)', display: 'inline-block' }}>
              <Avatar src={avatarPreview} alt={draftProfile.displayName} size={120} showStatus={true} isOnline={true} />
              
              {/* Avatar Edit Controls */}
              <div 
                onClick={() => avatarInputRef.current?.click()}
                style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem', background: 'var(--primary)', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 10 }}
                title="Edit Avatar"
              >
                <Pencil size={14} />
              </div>
              {avatarPreview && (
                <div 
                  onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                  style={{ position: 'absolute', top: '35px', right: '-15px', padding: '0.4rem', background: '#ef4444', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 10 }}
                  title="Remove Avatar"
                >
                  <Trash2 size={12} />
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="secondary-btn" onClick={onClose} disabled={isUploading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <X size={16} /> Cancel
              </button>
              <button className="primary-btn" onClick={handleSave} disabled={isUploading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <Save size={16} /> {isUploading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
            <div>
              <label style={labelStyle}>Display Name</label>
              <input style={inputStyle} value={draftProfile.displayName || ''} onChange={e => updateDraft({ displayName: e.target.value })} placeholder="Your display name" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>User ID (Login)</label>
                <input style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} value={draftProfile.login_id || draftProfile.username} readOnly disabled title="User ID cannot be changed" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Primary Role / Title</label>
                <input style={inputStyle} value={draftProfile.title || ''} onChange={e => updateDraft({ title: e.target.value })} placeholder="e.g. Senior Engineer" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Bio */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Bio</h4>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <textarea 
                style={{ ...inputStyle, background: 'var(--bg-base)', minHeight: '120px', resize: 'vertical', marginTop: 0 }} 
                value={draftProfile.bio || ''} 
                onChange={e => updateDraft({ bio: e.target.value })} 
                placeholder="Tell the community about yourself..." 
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Contact & Links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Email Address</label>
                <input style={inputStyle} value={draftEmail} onChange={e => setDraftEmail(e.target.value)} placeholder="your@email.com" />
                {emailUpdateMsg && <span style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: emailUpdateMsg.includes('failed') ? '#ef4444' : '#10b981' }}>{emailUpdateMsg}</span>}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={draftProfile.contactPublic} onChange={e => updateDraft({ contactPublic: e.target.checked, contact: draftEmail })} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Show email publicly on profile</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>GitHub URL</label>
                <div style={{ position: 'relative' }}>
                  <Code size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={draftProfile.github || ''} onChange={e => updateDraft({ github: e.target.value })} placeholder="https://github.com/..." />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>LinkedIn URL</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={draftProfile.linkedin || ''} onChange={e => updateDraft({ linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Portfolio / Website</label>
                <div style={{ position: 'relative' }}>
                  <Link size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={draftProfile.portfolio || ''} onChange={e => updateDraft({ portfolio: e.target.value })} placeholder="https://..." />
                </div>
              </div>

            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Displayed Skills</h4>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select the skills to highlight on your profile.</p>
                <div style={{ position: 'relative', width: '250px' }} ref={skillDropdownRef}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    placeholder="Search skills..."
                    value={skillSearch}
                    onFocus={() => setSkillDropdownOpen(true)}
                    onChange={(e) => {
                      setSkillSearch(e.target.value)
                      setSkillDropdownOpen(true)
                    }}
                    style={{ ...inputStyle, marginTop: 0, padding: '0.4rem 1rem 0.4rem 2rem', fontSize: '0.85rem' }}
                  />
                  {skillDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 50, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                      {(() => {
                        const available = skills.filter(s => s.progress >= 50 && !draftProfile.displayedSkills?.includes(s.id))
                        const filtered = skillSearch ? available.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase())) : available
                        if (filtered.length === 0) {
                          return <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No matching skills available.</div>
                        }
                        return filtered.map(skill => (
                          <div 
                            key={skill.id}
                            onClick={() => {
                              const current = draftProfile.displayedSkills || []
                              updateDraft({ displayedSkills: [...current, skill.id] })
                              setSkillSearch('')
                              setSkillDropdownOpen(false)
                            }}
                            style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                          >
                            <span>{skill.name} <span style={{ color: 'var(--text-muted)' }}>— {Math.floor(skill.progress)}%</span></span>
                          </div>
                        ))
                      })()}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {!(draftProfile.displayedSkills?.length) ? (
                  <p className="muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>No skills selected yet.</p>
                ) : (
                  draftProfile.displayedSkills.map(skillId => {
                    const skill = skills.find(s => s.id === skillId)
                    if (!skill) return null
                    const isMastered = skill.progress >= 100 || skill.status === 'MASTERED'
                    return (
                      <div 
                        key={skill.id}
                        onClick={() => {
                          const current = draftProfile.displayedSkills || []
                          updateDraft({ displayedSkills: current.filter(id => id !== skill.id) })
                        }}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '20px',
                          border: `1px solid var(--primary)`,
                          background: 'rgba(99, 102, 241, 0.1)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s',
                          color: '#fff',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                        title="Click to remove"
                      >
                        {skill.name} 
                        {isMastered && (
                          <span style={{ marginLeft: '6px', background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>M</span>
                        )}
                        <X size={14} style={{ opacity: 0.7, marginLeft: '6px' }} />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Displayed Achievements</h4>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select up to 12 achievements to highlight on your profile.</p>
                <div style={{ position: 'relative' }} ref={achDropdownRef}>
                  <button 
                    onClick={() => setAchDropdownOpen(!achDropdownOpen)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Add Achievement ({validDisplayedAchievements.length}/12)
                  </button>
                  
                  {achDropdownOpen && (
                    <div style={{ position: achDropdownStyle.position || 'absolute' as any, top: achDropdownStyle.top, bottom: achDropdownStyle.bottom, right: achDropdownStyle.right, left: achDropdownStyle.left, marginTop: achDropdownStyle.marginTop, marginBottom: achDropdownStyle.marginBottom, background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 50, width: achDropdownStyle.width || 'min(420px, 100%)', maxWidth: 'min(420px, calc(100vw - 32px))', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ position: 'relative' }}>
                          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            placeholder="Search achievements..."
                            value={achSearch}
                            onChange={(e) => setAchSearch(e.target.value)}
                            style={{ ...inputStyle, marginTop: 0, padding: '0.4rem 1rem 0.4rem 2rem', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <ArrowUpDown size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                          <select
                            value={achSort}
                            onChange={(e) => setAchSort(e.target.value as 'default'|'asc'|'desc')}
                            style={{ ...inputStyle, marginTop: 0, padding: '0.4rem 1rem 0.4rem 2rem', fontSize: '0.85rem', appearance: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}
                          >
                            <option value="default">Default</option>
                            <option value="asc">Lowest XP</option>
                            <option value="desc">Highest XP</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ maxHeight: '320px', overflowY: 'auto', overflowX: 'hidden' }}>
                        {(() => {
                          let allEarned = [...achievements.filter(a => a.unlocked), ...(dynamicMilestones || []).filter(m => m.isUnlocked)]
                          
                          // Exclude already selected
                          allEarned = allEarned.filter(a => !(validDisplayedAchievements.includes(a.id)))
                          
                          if (achSearch) {
                            const q = achSearch.toLowerCase()
                            allEarned = allEarned.filter(a => (a.name || a.title || a.id).toLowerCase().includes(q))
                          }
                          
                          if (achSort === 'asc') {
                            allEarned.sort((a, b) => (a.xpReward || 0) - (b.xpReward || 0))
                          } else if (achSort === 'desc') {
                            allEarned.sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0))
                          }

                          if (allEarned.length === 0) {
                            return <p style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No matching achievements.</p>
                          }

                          return allEarned.map(a => (
                            <div 
                              key={a.id}
                              onClick={() => {
                                if (validDisplayedAchievements.length < 12) {
                                  updateDraft({ displayedAchievements: [...validDisplayedAchievements, a.id] })
                                  setAchDropdownOpen(false)
                                  setAchSearch('')
                                }
                              }}
                              style={{
                                padding: '0.6rem 0.75rem',
                                borderBottom: '1px solid var(--border)',
                                cursor: validDisplayedAchievements.length >= 12 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s',
                                opacity: validDisplayedAchievements.length >= 12 ? 0.5 : 1
                              }}
                            >
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '8px' }}>{a.name || a.title || a.id}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', whiteSpace: 'nowrap', flexShrink: 0 }}>+{a.xpReward || 0} XP</span>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {validDisplayedAchievements.length === 0 ? (
                  <p className="muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>No achievements selected yet.</p>
                ) : (
                  validDisplayedAchievements.map(id => {
                    const a = achievements.find(ach => ach.id === id) || (dynamicMilestones || []).find(m => m.id === id)
                    if (!a) return null
                    return (
                      <div 
                        key={a.id}
                        onClick={() => {
                          updateDraft({ displayedAchievements: validDisplayedAchievements.filter(aid => aid !== a.id) })
                        }}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          border: `1px solid var(--primary)`,
                          background: 'rgba(99, 102, 241, 0.1)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s'
                        }}
                        title="Click to remove"
                      >
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{a.name || a.title || a.id}</span>
                        <X size={14} style={{ opacity: 0.7, color: '#fff' }} />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}