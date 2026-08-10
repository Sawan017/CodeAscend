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

export function ProfilePanel({ profile, progression, skills, goals, goalsCompleted, onUpdateProfile }: ProfilePanelProps) {
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
      <div className="panel hero-panel-card">
        <p className="eyebrow">PLAYER PROFILE</p>
        <div className="profile-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="avatar-badge" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                {profile.avatar ? <img src={profile.avatar} alt={profile.displayName} style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} /> : profile.displayName?.[0] || 'U'}
              </div>
              <div>
                <h3 className={nameColorClass} style={{ fontSize: '1.8rem', margin: 0 }}>{profile.displayName || profile.username}</h3>
                <p className="muted">@{profile.username} • {profile.title}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <XpProgressBar xp={progression.xp} />
            </div>

            <p className="copy">{profile.introduction}</p>

            <div className="chip-section">
              <p className="eyebrow">Coding languages</p>
              <div className="chip-row">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const selected = profile.technologies.includes(lang)
                  return (
                    <button
                      key={lang}
                      className={`chip selectable ${selected ? 'selected' : ''}`}
                      onClick={() => toggleLanguage(lang)}
                    >
                      {selected ? '✓ ' : '+ '}{lang}
                    </button>
                  )
                })}
              </div>
              {profile.technologies.some((t) => !LANGUAGE_OPTIONS.includes(t)) ? (
                <div className="chip-row">
                  {profile.technologies.filter((t) => !LANGUAGE_OPTIONS.includes(t)).map((t) => (
                    <button key={t} className="chip selectable selected" onClick={() => toggleLanguage(t)}>✓ {t}</button>
                  ))}
                </div>
              ) : null}
              <div className="lang-add">
                <input
                  placeholder="Add a language…"
                  value={customLang}
                  onChange={(e) => setCustomLang(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addCustomLanguage() }}
                />
                <button className="secondary-btn" onClick={addCustomLanguage}>Add</button>
              </div>
            </div>
          </div>

          <div className="profile-side">
            <div className="info-card"><span>Education</span><strong>{profile.education}</strong></div>
            <div className="info-card"><span>Focus</span><strong>{profile.focus}</strong></div>
            <div className="info-card link-row">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${profile.contact}`}>{profile.contact}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="panel compact-panel">
        <p className="eyebrow">CAREER STATS</p>
        <div className="mini-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
          <div className="mini-card"><span>Level</span><strong>{level}</strong></div>
          <div className="mini-card"><span>XP</span><strong>{progression.xp}</strong></div>
          <div className="mini-card"><span>Projects</span><strong>{progression.projectsCompleted}</strong></div>
          <div className="mini-card"><span>Goals</span><strong>{goalsCompleted}</strong></div>
        </div>
      </div>

      <div className="panel compact-panel">
        <p className="eyebrow">LANGUAGE PROGRESSION</p>
        <div className="lang-grid">
          {skillProgressions.length === 0 ? (
            <p className="muted" style={{ padding: '1rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px' }}>
              No learning progression yet. Add skills from the Learning tab.
            </p>
          ) : (
            skillProgressions.map((lang) => (
              <div key={lang.id} className="lang-row">
                <span className="lang-name" style={{ color: 'var(--cyan)' }}>{lang.name}</span>
                <div className="progress-bar"><div style={{ width: `${lang.levelProgress}%` }} /></div>
                <small className="muted">Level {lang.level} · {lang.xp} XP</small>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel compact-panel">
        <p className="eyebrow">ACTIVE QUESTS</p>
        {activeGoals.length ? (
          <div className="goal-list">
            {activeGoals.map((goal) => (
              <div key={goal.id} className="goal-card">
                <div className="goal-card-main">
                  <div className="goal-head"><strong>{goal.title}</strong><span>{goal.difficulty}</span></div>
                  <div className="progress-bar"><div style={{ width: `${goal.progress}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">All quests complete — add new goals from the Goals tab.</p>
        )}
      </div>
    </div>
  )
}