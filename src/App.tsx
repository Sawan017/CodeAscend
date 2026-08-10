import { AnimatePresence, motion } from 'framer-motion'
import { Compass, GraduationCap, House, Layers3, Target, Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AuthShell } from './features/auth/AuthShell'
import { AchievementsPanel } from './features/achievements/AchievementsPanel'
import { CareerWorld } from './components/CareerWorld'
import { HUD } from './components/HUD'
import { ProfileDrawer } from './components/ProfileDrawer'
import { TopBar } from './components/TopBar'
import { GoalsPanel } from './features/goals/GoalsPanel'
import { ProfilePanel } from './features/profile/ProfilePanel'
import { ProjectsPanel } from './features/projects/ProjectsPanel'
import { SkillsPanel } from './features/skills/SkillsPanel'
import { TimelinePanel } from './features/timeline/TimelinePanel'
import { achievements, badges, goals, milestones, profile, projects, skillTree, skills, timelineEvents, initialProgression, languages, futureMilestones } from './data/journeyData'
import type { Goal, SectionId, Settings, UserProfile } from './types'
import { loadInitialState, saveProgression } from './utils/storage'
import { calculateGoalXp, calculateLevel, computeStreak, XP_REWARDS } from './lib/progression'
import { useAuth } from './lib/auth'
import { fetchAllUserData, saveAchievements, saveBadges, saveGoals, saveProfile, saveProjects, saveProgressionData, saveSettings, saveSkills } from './lib/api'
import { Toasts, useToasts } from './components/Toasts'
import { UserSearch } from './components/UserSearch'

const sections: Array<{ id: SectionId; label: string; icon: typeof House }> = [
  { id: 'profile', label: 'Profile', icon: House },
  { id: 'projects', label: 'Projects', icon: Layers3 },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'future', label: 'Future', icon: Compass },
]

function App() {
  const { user, signOut } = useAuth()
  const hydratedFromRemote = useRef(false)
  const { toasts, push, dismiss } = useToasts()
  const prevLevelRef = useRef(calculateLevel(initialProgression.xp))
  const [entered, setEntered] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('profile')
  const [activeProject, setActiveProject] = useState(projects[0])
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id ?? '')
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id ?? '')
  const [progression, setProgression] = useState(initialProgression)
  const [goalState, setGoalState] = useState(goals)
  const [skillState, setSkillState] = useState(skills)
  const [projectState, setProjectState] = useState(projects)
  const [achievementState, setAchievementState] = useState(achievements)
  const [badgeState, setBadgeState] = useState(badges)
  const [settings, setSettings] = useState<Settings>({ animationIntensity: 'high', reducedMotion: false, soundEffects: false, theme: 'dark', streakTracking: true })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userSearchOpen, setUserSearchOpen] = useState(false)
  const [profileState, setProfileState] = useState<UserProfile>(profile)
  const [languageState] = useState(languages)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = loadInitialState()
    setProgression(stored.progression)
    setGoalState(stored.goals.length ? stored.goals : goals)
    setSkillState(stored.skills.length ? stored.skills : skills)
    setProjectState(stored.projects.length ? stored.projects : projects)
    setAchievementState(stored.achievements.length ? stored.achievements : achievements)
    setBadgeState(stored.badges.length ? stored.badges : badges)
    setSettings(stored.settings)
    setProfileState(stored.profile)
  }, [])

  // Load remote data when a user logs in
  useEffect(() => {
    if (!user) return
    hydratedFromRemote.current = false
    fetchAllUserData(user.id).then((remote) => {
      if (!remote) return
      hydratedFromRemote.current = true
      if (remote.profile) setProfileState(remote.profile)
      if (remote.progression) setProgression(remote.progression)
      if (remote.goals && remote.goals.length) setGoalState(remote.goals)
      if (remote.projects && remote.projects.length) setProjectState(remote.projects)
      if (remote.skills && remote.skills.length) setSkillState(remote.skills)
      if (remote.achievements && remote.achievements.length) setAchievementState(remote.achievements)
      if (remote.badges && remote.badges.length) setBadgeState(remote.badges)
      if (remote.settings) setSettings(remote.settings)
    })
  }, [user])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => { saveProgression(progression, 'progression') }, [progression])
  useEffect(() => { saveProgression(goalState, 'goals') }, [goalState])
  useEffect(() => { saveProgression(skillState, 'skills') }, [skillState])
  useEffect(() => { saveProgression(projectState, 'projects') }, [projectState])
  useEffect(() => { saveProgression(achievementState, 'achievements') }, [achievementState])
  useEffect(() => { saveProgression(badgeState, 'badges') }, [badgeState])
  useEffect(() => { saveProgression(settings, 'settings') }, [settings])
  useEffect(() => { saveProgression(profileState, 'profile') }, [profileState])

  // Push changes to Supabase when logged in (after remote hydration completes)
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveProgressionData(user.id, progression)
  }, [user, progression])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveGoals(user.id, goalState)
  }, [user, goalState])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveSkills(user.id, skillState)
  }, [user, skillState])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveProjects(user.id, projectState)
  }, [user, projectState])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveAchievements(user.id, achievementState)
  }, [user, achievementState])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveBadges(user.id, badgeState)
  }, [user, badgeState])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveSettings(user.id, settings)
  }, [user, settings])
  useEffect(() => {
    if (!user || !hydratedFromRemote.current) return
    saveProfile(user.id, profileState)
  }, [user, profileState])

  // Show a toast when the player levels up
  useEffect(() => {
    const level = calculateLevel(progression.xp)
    if (level > prevLevelRef.current) {
      push(`LEVEL UP! You reached level ${level}`, 'level', 4000)
    }
    prevLevelRef.current = level
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progression.xp])

  // Track daily streak on mount
  useEffect(() => {
    const { streak, lastActiveDate } = progression
    const { newStreak, lastDate } = computeStreak(streak, lastActiveDate)
    if (newStreak !== streak) {
      setProgression((prev) => ({ ...prev, streak: newStreak, lastActiveDate: lastDate }))
    } else if (lastDate !== lastActiveDate) {
      setProgression((prev) => ({ ...prev, lastActiveDate: lastDate }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completedGoals = goalState.filter((goal) => goal.status === 'COMPLETED').length
  const masteredSkills = skillState.filter((skill) => skill.status === 'MASTERED').length
  const earnedBadges = badgeState.filter((badge) => badge.earned).length

  const markGoalCompleted = (goalId: string) => {
    const now = new Date().toISOString().slice(0, 10)
    setGoalState((prev) => prev.map((goal) => {
      if (goal.id !== goalId || goal.status === 'COMPLETED') return goal
      const xpGained = calculateGoalXp(goal, now)
      setProgression((p) => ({ ...p, xp: p.xp + xpGained, goalsCompleted: p.goalsCompleted + 1 }))
      push(`Goal complete! +${xpGained} XP`, 'xp')
      return { ...goal, status: 'COMPLETED' as const, progress: 100, completedDate: now }
    }))
  }

  const addGoal = (goal: Goal) => {
    setGoalState((prev) => [...prev, goal])
  }

  const removeGoal = (goalId: string) => {
    setGoalState((prev) => prev.filter((goal) => goal.id !== goalId))
  }

  const unlockAchievement = (id: string) => {
    setAchievementState((prev) => prev.map((achievement) => {
      if (achievement.id !== id || achievement.unlocked) return achievement
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.achievement, achievements: p.achievements + 1 }))
      push(`Achievement unlocked: ${achievement.title} +${XP_REWARDS.achievement} XP`, 'unlock')
      return { ...achievement, unlocked: true, dateUnlocked: new Date().toISOString().slice(0, 10) }
    }))
  }

  const toggleSkillMastery = (id: string) => {
    setSkillState((prev) => prev.map((skill) => {
      if (skill.id !== id) return skill
      const nextStatus = skill.status === 'MASTERED' ? 'LEARNING' : 'MASTERED'
      if (nextStatus === 'MASTERED') {
        setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.skillMastered, skillsMastered: p.skillsMastered + 1 }))
        push(`Skill mastered! +${XP_REWARDS.skillMastered} XP`, 'unlock')
        return { ...skill, status: 'MASTERED' as const, progress: 100, completed: new Date().toISOString().slice(0, 10) }
      }
      return { ...skill, status: 'LEARNING' as const, completed: '' }
    }))
  }

  const incrementSkillProgress = (id: string) => {
    setSkillState((prev) => prev.map((skill) => {
      if (skill.id !== id || skill.status === 'MASTERED') return skill
      const newProgress = Math.min(100, skill.progress + 10)
      if (newProgress >= 100) {
        setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.skillMastered, skillsMastered: p.skillsMastered + 1 }))
        push(`Skill mastered! +${XP_REWARDS.skillMastered} XP`, 'unlock')
        return { ...skill, status: 'MASTERED' as const, progress: 100, completed: new Date().toISOString().slice(0, 10) }
      }
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.skillPractice }))
      push(`Practice logged +${XP_REWARDS.skillPractice} XP`, 'xp')
      return { ...skill, progress: newProgress }
    }))
  }

  const markProjectCompleted = (projectId: string) => {
    setProjectState((prev) => prev.map((project) => {
      if (project.id !== projectId || project.completed) return project
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.projectCompleted, projectsCompleted: p.projectsCompleted + 1 }))
      push(`Project completed! +${XP_REWARDS.projectCompleted} XP`, 'unlock')
      return { ...project, completed: true, completedDate: new Date().toISOString().slice(0, 10), progress: 100, status: 'COMPLETED' }
    }))
  }

  const earnBadge = (badgeId: string) => {
    setBadgeState((prev) => prev.map((badge) => {
      if (badge.id !== badgeId || badge.earned) return badge
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.badge, badges: p.badges + 1 }))
      push(`Badge earned: ${badge.title} +${XP_REWARDS.badge} XP`, 'badge')
      return { ...badge, earned: true, dateEarned: new Date().toISOString().slice(0, 10) }
    }))
  }

  const selectSection = (section: SectionId) => {
    setActiveSection(section)
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className={`app-shell ${settings.theme}`}>
      <div className="noise" />
      <div className="aurora aura-a" />
      <div className="aurora aura-b" />
      <div className="grid-overlay" />
      <div className="spotlight" style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }} />
      <AnimatePresence mode="wait">
        {!entered ? (
          <AuthShell onEnter={() => setEntered(true)} progression={progression} />
        ) : (
          <motion.main key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="world-shell">
            <TopBar progression={progression} profile={profileState} onOpenDrawer={() => setDrawerOpen(true)} onOpenSearch={() => setUserSearchOpen(true)} />
            <div className="workspace">
              <aside className="sidebar">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  return (
                    <motion.button key={section.id} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => selectSection(section.id)} title={section.label}>
                      <Icon size={16} />
                      <span>{section.label}</span>
                    </motion.button>
                  )
                })}
              </aside>

              <div className="main-stage">
                <div className="hero-panel">
                  <div className="hero-copy">
                    <p className="eyebrow">CORE SYSTEM</p>
                    <h3>Developer progression map</h3>
                    <p>Each node is a milestone in your growth arc.</p>
                  </div>
                  <div className="hero-badge">LIVE</div>
                </div>

                <div className="arena-grid">
                  <CareerWorld activeSection={activeSection} onSelectSection={selectSection} progression={progression} />
                  <HUD progression={progression} completedGoals={completedGoals} masteredSkills={masteredSkills} earnedBadges={earnedBadges} />
                </div>

                <motion.section ref={contentRef} className="content-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                  <AnimatePresence mode="wait">
                    {activeSection === 'profile' && <ProfilePanel profile={profileState} progression={progression} languages={languageState} goals={goalState} goalsCompleted={completedGoals} onUpdateProfile={setProfileState} />}
                    {activeSection === 'projects' && <ProjectsPanel projects={projectState} activeProject={activeProject} onSelectProject={setActiveProject} onMarkComplete={markProjectCompleted} />}
                    {activeSection === 'learning' && <SkillsPanel skillTree={skillTree} skills={skillState} selectedSkillId={selectedSkillId} onSelectSkill={setSelectedSkillId} onMasterSkill={toggleSkillMastery} onIncrementSkill={incrementSkillProgress} />}
                    {activeSection === 'goals' && <GoalsPanel goals={goalState} selectedGoalId={selectedGoalId} onSelectGoal={setSelectedGoalId} onCompleteGoal={markGoalCompleted} onAddGoal={addGoal} onRemoveGoal={removeGoal} />}
                    {activeSection === 'achievements' && <AchievementsPanel achievements={achievementState} badges={badgeState} onUnlockAchievement={unlockAchievement} onEarnBadge={earnBadge} />}
                    {activeSection === 'future' && <TimelinePanel milestones={milestones} futureMilestones={futureMilestones} timelineEvents={timelineEvents} />}
                  </AnimatePresence>
                </motion.section>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
      <ProfileDrawer open={drawerOpen} profile={profileState} settings={settings} user={user} onClose={() => setDrawerOpen(false)} onSettingsChange={setSettings} onProfileChange={setProfileState} onSignOut={signOut} />
      <UserSearch open={userSearchOpen} onClose={() => setUserSearchOpen(false)} onSelectUser={(profile) => { setProfileState(profile); setUserSearchOpen(false) }} />
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export default App