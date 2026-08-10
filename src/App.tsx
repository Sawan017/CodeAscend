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
import { achievements, badges, goals, milestones, projects, skillTree, skills, timelineEvents, languages, futureMilestones } from './data/journeyData'
import type { Goal, Progression, Project, SectionId, Settings, Skill, UserProfile } from './types'
import { loadInitialState, saveProgression } from './utils/storage'
import { calculateGoalXp, calculateLevel, computeStreak, XP_REWARDS, evaluateAchievementsAndBadges } from './lib/progression'
import { playSoundEffect } from './lib/sound'
import { useAuth } from './lib/auth'
import { fetchAllUserData, saveAchievements, saveBadges, saveGoals, saveProfile, saveProjects, saveProgressionData, saveSettings, saveSkills } from './lib/api'
import { Toasts } from './components/Toasts'
import { useToasts } from './hooks/useToasts'
import { UserSearch } from './components/UserSearch'
import { PublicProfileViewer } from './components/PublicProfileViewer'

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
  const [entered, setEntered] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('profile')

  const [initialData] = useState(() => {
    const stored = loadInitialState()
    const streakResult = computeStreak(stored.progression.streak, stored.progression.lastActiveDate)
    const initialProg: Progression = {
      ...stored.progression,
      streak: streakResult.newStreak,
      lastActiveDate: streakResult.lastDate,
    }
    return {
      progression: initialProg,
      goals: stored.goals.length ? stored.goals : goals,
      skills: stored.skills.length ? stored.skills : skills,
      projects: stored.projects.length ? stored.projects : projects,
      achievements: stored.achievements.length ? stored.achievements : achievements,
      badges: stored.badges.length ? stored.badges : badges,
      settings: stored.settings,
      profile: stored.profile,
    }
  })

  const prevLevelRef = useRef(calculateLevel(initialData.progression.xp))
  const [progression, setProgression] = useState<Progression>(initialData.progression)
  const [goalState, setGoalState] = useState(initialData.goals)
  const [skillState, setSkillState] = useState(initialData.skills)
  const [projectState, setProjectState] = useState(initialData.projects)
  const [achievementState, setAchievementState] = useState(initialData.achievements)
  const [badgeState, setBadgeState] = useState(initialData.badges)
  const [settings, setSettings] = useState<Settings>(initialData.settings)
  const [profileState, setProfileState] = useState<UserProfile>(initialData.profile)
  const [activeProject, setActiveProject] = useState(initialData.projects[0] ?? projects[0])
  const [selectedSkillId, setSelectedSkillId] = useState(initialData.skills[0]?.id ?? skills[0]?.id ?? '')
  const [selectedGoalId, setSelectedGoalId] = useState(initialData.goals[0]?.id ?? goals[0]?.id ?? '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userSearchOpen, setUserSearchOpen] = useState(false)
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const [languageState] = useState(languages)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

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

  // Show a toast and sound when the player levels up or gains XP
  useEffect(() => {
    const level = calculateLevel(progression.xp)
    if (level > prevLevelRef.current) {
      push(`LEVEL UP! You reached level ${level}`, 'level', 4000)
      playSoundEffect('level', settings.soundEffects)
    }
    prevLevelRef.current = level
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progression.xp, settings.soundEffects])

  // Automated badge & achievement evaluator
  useEffect(() => {
    const timeout = setTimeout(() => {
      const { updatedBadges, updatedAchievements, newEarnedBadges, newUnlockedAchievements } = evaluateAchievementsAndBadges(
        progression,
        goalState,
        projectState,
        skillState,
        achievementState,
        badgeState
      )

      if (newEarnedBadges.length > 0) {
        setBadgeState(updatedBadges)
        newEarnedBadges.forEach((b) => {
          setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.badge, badges: p.badges + 1 }))
          push(`Badge earned: ${b.title} +${XP_REWARDS.badge} XP`, 'badge')
          playSoundEffect('badge', settings.soundEffects)
        })
      }

      if (newUnlockedAchievements.length > 0) {
        setAchievementState(updatedAchievements)
        newUnlockedAchievements.forEach((a) => {
          setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.achievement, achievements: p.achievements + 1 }))
          push(`Achievement unlocked: ${a.title} +${XP_REWARDS.achievement} XP`, 'unlock')
          playSoundEffect('unlock', settings.soundEffects)
        })
      }
    }, 0)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progression.xp, goalState, projectState, skillState])

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
      playSoundEffect('xp', settings.soundEffects)
      return { ...goal, status: 'COMPLETED' as const, progress: 100, completedDate: now }
    }))
  }

  const addGoal = (goal: Goal) => {
    setGoalState((prev) => [...prev, goal])
    playSoundEffect('click', settings.soundEffects)
  }

  const removeGoal = (goalId: string) => {
    setGoalState((prev) => prev.filter((goal) => goal.id !== goalId))
    playSoundEffect('click', settings.soundEffects)
  }

  const unlockAchievement = (id: string) => {
    setAchievementState((prev) => prev.map((achievement) => {
      if (achievement.id !== id || achievement.unlocked) return achievement
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.achievement, achievements: p.achievements + 1 }))
      push(`Achievement unlocked: ${achievement.title} +${XP_REWARDS.achievement} XP`, 'unlock')
      playSoundEffect('unlock', settings.soundEffects)
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
        playSoundEffect('unlock', settings.soundEffects)
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
        playSoundEffect('unlock', settings.soundEffects)
        return { ...skill, status: 'MASTERED' as const, progress: 100, completed: new Date().toISOString().slice(0, 10) }
      }
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.skillPractice }))
      push(`Practice logged +${XP_REWARDS.skillPractice} XP`, 'xp')
      playSoundEffect('xp', settings.soundEffects)
      return { ...skill, progress: newProgress }
    }))
  }

  const markProjectCompleted = (projectId: string) => {
    setProjectState((prev) => prev.map((project) => {
      if (project.id !== projectId || project.completed) return project
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.projectCompleted, projectsCompleted: p.projectsCompleted + 1 }))
      push(`Project completed! +${XP_REWARDS.projectCompleted} XP`, 'unlock')
      playSoundEffect('unlock', settings.soundEffects)
      return { ...project, completed: true, completedDate: new Date().toISOString().slice(0, 10), progress: 100, status: 'COMPLETED' }
    }))
  }

  const earnBadge = (badgeId: string) => {
    setBadgeState((prev) => prev.map((badge) => {
      if (badge.id !== badgeId || badge.earned) return badge
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.badge, badges: p.badges + 1 }))
      push(`Badge earned: ${badge.title} +${XP_REWARDS.badge} XP`, 'badge')
      playSoundEffect('badge', settings.soundEffects)
      return { ...badge, earned: true, dateEarned: new Date().toISOString().slice(0, 10) }
    }))
  }

  const addProject = (newProject: Project) => {
    setProjectState((prev) => [newProject, ...prev])
    setActiveProject(newProject)
    push(`Project added: ${newProject.name}`, 'info')
    playSoundEffect('click', settings.soundEffects)
  }

  const deleteProject = (projectId: string) => {
    setProjectState((prev) => {
      const next = prev.filter((p) => p.id !== projectId)
      if (activeProject.id === projectId && next.length > 0) {
        setActiveProject(next[0])
      }
      return next
    })
    push('Project deleted', 'info')
    playSoundEffect('click', settings.soundEffects)
  }

  const addSkill = (newSkill: Skill) => {
    setSkillState((prev) => [...prev, newSkill])
    setSelectedSkillId(newSkill.id)
    push(`Skill added: ${newSkill.name}`, 'info')
    playSoundEffect('click', settings.soundEffects)
  }

  const updateSkillNotes = (skillId: string, notes: string) => {
    setSkillState((prev) => prev.map((s) => (s.id === skillId ? { ...s, notes } : s)))
    push('Skill notes updated', 'info')
  }

  const addMilestone = (goalId: string, milestoneText: string) => {
    setGoalState((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g
        const updatedMilestones = [...g.milestones, milestoneText]
        return { ...g, milestones: updatedMilestones }
      })
    )
    push('Sub-milestone added', 'info')
    playSoundEffect('click', settings.soundEffects)
  }

  const selectSection = (section: SectionId) => {
    setActiveSection(section)
    playSoundEffect('click', settings.soundEffects)
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
                  <CareerWorld activeSection={activeSection} onSelectSection={selectSection} progression={progression} profile={profileState} />
                  <HUD progression={progression} completedGoals={completedGoals} masteredSkills={masteredSkills} earnedBadges={earnedBadges} />
                </div>

                <motion.section ref={contentRef} className="content-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                  <AnimatePresence mode="wait">
                    {activeSection === 'profile' && <ProfilePanel profile={profileState} progression={progression} languages={languageState} goals={goalState} goalsCompleted={completedGoals} onUpdateProfile={setProfileState} />}
                    {activeSection === 'projects' && <ProjectsPanel projects={projectState} activeProject={activeProject} onSelectProject={setActiveProject} onMarkComplete={markProjectCompleted} onAddProject={addProject} onDeleteProject={deleteProject} />}
                    {activeSection === 'learning' && <SkillsPanel skillTree={skillTree} skills={skillState} selectedSkillId={selectedSkillId} onSelectSkill={setSelectedSkillId} onMasterSkill={toggleSkillMastery} onIncrementSkill={incrementSkillProgress} onAddSkill={addSkill} onUpdateSkillNotes={updateSkillNotes} />}
                    {activeSection === 'goals' && <GoalsPanel goals={goalState} selectedGoalId={selectedGoalId} onSelectGoal={setSelectedGoalId} onCompleteGoal={markGoalCompleted} onAddGoal={addGoal} onRemoveGoal={removeGoal} onAddMilestone={addMilestone} />}
                    {activeSection === 'achievements' && <AchievementsPanel achievements={achievementState} badges={badgeState} onUnlockAchievement={unlockAchievement} onEarnBadge={earnBadge} />}
                    {activeSection === 'future' && <TimelinePanel milestones={milestones} futureMilestones={futureMilestones} timelineEvents={timelineEvents} onNavigateSection={selectSection} />}
                  </AnimatePresence>
                </motion.section>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
      <ProfileDrawer open={drawerOpen} profile={profileState} settings={settings} user={user} onClose={() => setDrawerOpen(false)} onSettingsChange={setSettings} onProfileChange={setProfileState} onSignOut={signOut} />
      <UserSearch open={userSearchOpen} onClose={() => setUserSearchOpen(false)} onSelectUser={(userId) => { setViewingUserId(userId); setUserSearchOpen(false) }} />
      <PublicProfileViewer userId={viewingUserId} onClose={() => setViewingUserId(null)} />
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export default App