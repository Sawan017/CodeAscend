// @ts-nocheck
import { Avatar } from './Avatar'
import { MilestonesSection } from './MilestonesSection'
import type { UserProfile, Skill, Project, Goal, DynamicMilestone, Badge } from '../types'
import { Code, Globe, Mail, Link } from 'lucide-react'
import { sanitizeUrl } from '../utils/url'

interface PublicProfileContentProps {
  profile: UserProfile
  isOnline?: boolean
  projects?: Project[]
  skills?: Skill[]
  goals?: Goal[]
  badges?: Badge[]
  dynamicMilestones?: DynamicMilestone[]
}

export function PublicProfileContent({ profile, isOnline, projects = [], skills = [], goals = [], badges = [], dynamicMilestones = [] }: PublicProfileContentProps) {
  return (
    <div className="panel" style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
      {/* Banner */}
      <div 
        style={{ 
          height: '140px', 
          width: '100%', 
          background: profile.banner 
            ? `url(${profile.banner}) center/cover no-repeat` 
            : 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
          position: 'relative'
        }} 
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,20,0.8), transparent)' }} />
      </div>

      <div style={{ padding: '0 2rem 2rem 2rem' }}>
        {/* Profile Info */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ 
              borderRadius: '50%', 
              padding: '4px', 
              background: 'var(--bg-base)',
              display: 'inline-block'
            }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', width: '92px', height: '92px' }}>
                <Avatar src={profile.avatar} alt={profile.displayName} size={92} isOnline={isOnline} showStatus={true} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
              {profile.displayName || profile.username}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>@{profile.login_id || profile.username}</p>
              {profile.title && (
                <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc', border: 'none', padding: '0.15rem 0.5rem', fontSize: '0.75rem', borderRadius: '12px', fontWeight: 500 }}>
                  {profile.title}
                </span>
              )}
            </div>
          </div></div><div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Operative Stats */}
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Operative Stats</h4>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--surface-sunken)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Level</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{profile.level || 1}</strong>
              </div>
              
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Bio</h4>
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              {profile.bio ? (
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: '#ddd', whiteSpace: 'pre-wrap' }}>{profile.bio}</p>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>No bio added yet.</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Skills</h4>
            {(!profile.displayedSkills || profile.displayedSkills.length === 0) ? (
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>No skills selected.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.displayedSkills.map((skillId) => {
                  const skill = skills?.find(s => s.id === skillId)
                  if (!skill) return null
                  return (
                    <div key={skillId} style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      padding: '0.4rem 0.75rem', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '16px',
                      color: 'var(--text)',
                      width: 'max-content'
                    }}>
                      <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{skill.name}{skill.progress === 100 && <span style={{ marginLeft: '4px', color: 'var(--cyan)', fontWeight: 700 }}>• M</span>}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Links */}
          {((profile.contactPublic && profile.contact) || profile.github || profile.linkedin || profile.portfolio) && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Links</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                    <Mail size={14} /> Email
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Career Achievements */}
          <div>
            <MilestonesSection dynamicMilestones={dynamicMilestones} displayedIds={profile.displayedAchievements} maxVisible={12} />
          </div>

        </div>
      </div>
    </div>
  )
}



