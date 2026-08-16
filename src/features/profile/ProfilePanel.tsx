import { useState } from 'react'
import type { Goal, Progression, UserProfile, Skill } from '../../types'
import { calculateLevel, getNameColorClass, calculateProgressToNextLevel } from '../../lib/progression'
import { XpProgressBar } from '../../components/XpProgressBar'

type ProfilePanelProps = {
  profile: UserProfile
  progression: Progression
  skills: Skill[]
  goals: Goal[]
  goalsCompleted: number
  onUpdateProfile: (next: UserProfile) => void
}

const LANGUAGE_OPTIONS = [
  'TypeScript', 'JavaScript', 'React', 'Node.js', 'Python', 'Tailwind CSS',
  'Java', 'C++', 'C#', 'Go', 'Rust', 'SQL',
]

export function ProfilePanel({ profile, progression, skills, goals, goalsCompleted, onUpdateProfile, onEditProfile }: ProfilePanelProps & { onEditProfile?: () => void }) {
  const level = calculateLevel(progression.xp)
  const nameColorClass = getNameColorClass(level)
  const [customLang, setCustomLang] = useState('')

  const skillProgressions = skills.map(skill => {
    const xp = skill.subtopics?.filter(s => s.status === 'Completed').reduce((acc, sub) => acc + (sub.xpReward || 0), 0) || 0;
    const { level: skillLevel, progress: levelProgress } = calculateProgressToNextLevel(xp)
    return {
      id: skill.id,
      name: skill.name,
      xp,
      level: skillLevel,
      levelProgress
    }
  }).sort((a, b) => b.xp - a.xp)

  const toggleLanguage = (lang: string) => {
    const tech = profile.technologies.includes(lang)
      ? profile.technologies.filter((t) => t !== lang)
      : [...profile.technologies, lang]
    onUpdateProfile({ ...profile, technologies: tech })
  }

  const addCustomLanguage = () => {
    const lang = customLang.trim()
    if (!lang || profile.technologies.includes(lang)) return
    onUpdateProfile({ ...profile, technologies: [...profile.technologies, lang] })
    setCustomLang('')
  }

  const activeGoals = goals.filter((goal) => goal.status !== 'COMPLETED').slice(0, 3)

  return (
    <div className="section-shell">
      <div className="panel" style={{ padding: '2rem', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--cyan)', margin: 0, textTransform: 'uppercase' }}>Operative Profile</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {onEditProfile && (
              <button className="secondary-btn" onClick={onEditProfile}>Edit Profile</button>
            )}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 600, color: '#fff', boxShadow: '0 0 20px rgba(6,182,212,0.15)', overflow: 'hidden' }}>
                {profile.avatar ? <img src={profile.avatar} alt={profile.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile.displayName?.[0] || 'U'}
              </div>
              <div>
                <h3 className={nameColorClass} style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 700, letterSpacing: '-0.02em' }}>{profile.displayName}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem' }}>@{profile.login_id || profile.arinova_id || profile.username} <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.2)' }}>|</span> {profile.title}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <XpProgressBar xp={progression.xp} />
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem', lineHeight: 1.6, color: '#fff', fontSize: '0.95rem' }}>
              {profile.introduction}
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Technical Capabilities</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {LANGUAGE_OPTIONS.map((lang) => {
                  const selected = profile.technologies.includes(lang)
                  return (
                    <button
                      key={lang}
                      style={{ padding: '0.5rem 1rem', background: selected ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)', color: selected ? 'var(--cyan)' : 'var(--text-muted)', border: `1px solid ${selected ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '100px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => toggleLanguage(lang)}
                      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }} onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    >
                      {selected ? '✦ ' : ''}{lang}
                    </button>
                  )
                })}
                {profile.technologies.filter((t) => !LANGUAGE_OPTIONS.includes(t)).map((t) => (
                  <button key={t} style={{ padding: '0.5rem 1rem', background: 'rgba(6,182,212,0.1)', color: 'var(--cyan)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '100px', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => toggleLanguage(t)}>✦ {t}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  placeholder="Define new parameter..."
                  value={customLang}
                  onChange={(e) => setCustomLang(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addCustomLanguage() }}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
                <button style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.2s' }} onClick={addCustomLanguage} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Integrate</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Academic Node</span>
              <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{profile.education}</strong>
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Primary Vector</span>
              <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{profile.focus}</strong>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Comm Links</p>
              <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>LinkedIn</a>
              <a href={`mailto:${profile.contact}`} style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{profile.contact}</a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="panel" style={{ padding: '1.5rem', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1.5rem 0', textTransform: 'uppercase' }}>Career Metrics</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Level</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--cyan)' }}>{level}</strong>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>XP</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{progression.xp}</strong>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Projects</span>
              <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{progression.projectsCompleted}</strong>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Goals</span>
              <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{goalsCompleted}</strong>
            </div>
          </div>
        </div>

        <div className="panel" style={{ padding: '1.5rem', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1.5rem 0', textTransform: 'uppercase' }}>Skill Progression</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {skillProgressions.length === 0 ? (
              <p style={{ padding: '1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active proficiencies.
              </p>
            ) : (
              skillProgressions.slice(0, 4).map((lang) => (
                <div key={lang.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{lang.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LVL {lang.level}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${lang.levelProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--primary))', boxShadow: '0 0 10px var(--cyan)' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel" style={{ padding: '1.5rem', background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', margin: '0 0 1.5rem 0', textTransform: 'uppercase' }}>Active Directives</p>
          {activeGoals.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeGoals.map((goal) => (
                <div key={goal.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{goal.title}</strong>
                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(6,182,212,0.1)', color: 'var(--cyan)', borderRadius: '100px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{goal.priority}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>Directives nominal. Awaiting assignments.</p>
          )}
        </div>
      </div>
    </div>
  )
}