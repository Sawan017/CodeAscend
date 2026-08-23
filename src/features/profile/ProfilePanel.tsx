// @ts-nocheck
import type { Goal, Progression, UserProfile, Skill } from '../../types'
import { calculateLevel, calculateProgressToNextLevel, evaluateDynamicMilestones } from '../../lib/progression'
import { XpProgressBar } from '../../components/XpProgressBar'
import { Avatar } from '../../components/Avatar'
import { MilestonesSection } from '../../components/MilestonesSection'
import { Code, Globe, Mail, Link, Pencil } from 'lucide-react'
import { sanitizeUrl } from '../../utils/url'

interface ProfilePanelProps {
  profile: UserProfile
  progression: Progression
  goals: Goal[]
  skills: Skill[]
  onEditProfile?: () => void
}

export function ProfilePanel({ profile, progression, goals, skills, onEditProfile }: ProfilePanelProps) {
  const level = calculateLevel(progression.xp)
    
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner */}
      <div 
        style={{ 
          height: '180px', 
          width: '100%', 
          borderRadius: '16px',
          background: profile.banner 
            ? `url(${profile.banner}) center/cover no-repeat` 
            : 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
          position: 'relative',
          overflow: 'hidden'
        }} 
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,20,0.9), transparent)' }} />
      </div>

      <div style={{ padding: '0 2rem' }}>
        {/* Profile Info */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ 
              borderRadius: '50%', 
              padding: '6px', 
              background: 'var(--bg-base)',
              display: 'inline-block'
            }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', width: '120px', height: '120px' }}>
                <Avatar src={profile.avatar} alt={profile.displayName} size={120} showStatus={true} isOnline={true} />
              </div>
            </div>
            
            {onEditProfile && (
              <button className="primary-btn" onClick={onEditProfile} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', height: 'fit-content' }}>
                <Pencil size={16} /> Edit Profile
              </button>
            )}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
                {profile.displayName || profile.username}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <p className="muted" style={{ margin: 0, fontSize: '1rem' }}>@{profile.login_id || profile.username}</p>
                {profile.title && (
                  <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc', border: 'none', padding: '0.1rem 0.5rem', fontSize: '0.8rem' }}>
                    {profile.title}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Operative Stats */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Operative Stats</h4>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Level</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{level}</strong>
              </div>
              
              <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <XpProgressBar xp={progression.xp} />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Bio</h4>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              {profile.bio ? (
                <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: '#ddd', whiteSpace: 'pre-wrap' }}>{profile.bio}</p>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic' }}>No bio added yet.</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Skills</h4>
            {(!profile.displayedSkills || profile.displayedSkills.length === 0) ? (
              <p className="muted" style={{ margin: 0, fontSize: '1rem' }}>No skills selected.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.displayedSkills.map((skillId) => {
                  const skill = (skills || []).find(s => s.id === skillId)
                  if (!skill) return null
                  return (
                    <div key={skillId} style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      padding: '0.5rem 1rem', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '20px',
                      color: 'var(--text)',
                      width: 'max-content'
                    }}>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{skill.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Links */}
          {((profile.contactPublic && profile.contact) || profile.github || profile.linkedin || profile.portfolio) && (
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>Links</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {profile.github && (
                  <a href={sanitizeUrl(profile.github)} target="_blank" rel="noreferrer" className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', width: 'max-content' }}>
                    <Code size={16} /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={sanitizeUrl(profile.linkedin)} target="_blank" rel="noreferrer" className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', width: 'max-content' }}>
                    <Globe size={16} /> LinkedIn
                  </a>
                )}
                {profile.portfolio && (
                  <a href={sanitizeUrl(profile.portfolio)} target="_blank" rel="noreferrer" className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', width: 'max-content' }}>
                    <Link size={16} /> Portfolio
                  </a>
                )}
                {profile.contactPublic && profile.contact && (
                  <a href={sanitizeUrl(`mailto:${profile.contact}`)} className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', width: 'max-content' }}>
                    <Mail size={16} /> Email
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Career Achievements */}
          <div>
            <MilestonesSection dynamicMilestones={evaluateDynamicMilestones(progression, skills)} displayedIds={profile.displayedAchievements} maxVisible={12} />
          </div>

        </div>
      </div>
    </div>
  )
}

