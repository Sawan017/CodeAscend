import { AnimatePresence, motion } from 'framer-motion'
import { Compass, GraduationCap, House, Layers3, Target, Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AuthShell } from './features/auth/AuthShell'
import { OnboardingScreen } from './features/auth/OnboardingScreen'
import { AchievementsPanel } from './features/achievements/AchievementsPanel'
import { CareerWorld } from './components/CareerWorld'
import { HUD } from './components/HUD'
import { ProfileDrawer } from './components/ProfileDrawer'
import { TopBar } from './components/TopBar'
import { Toasts } from './components/Toasts'
import { Celebration } from './components/Celebration'
import { GoalsPanel } from './features/goals/GoalsPanel'
import { Dashboard } from './features/dashboard/Dashboard'
import { BadgeDetail } from './features/achievements/BadgeDetail'
import { ProfilePanel } from './features/profile/ProfilePanel'
import { ProjectsPanel } from './features/projects/ProjectsPanel'
import { SkillsPanel } from './features/skills/SkillsPanel'
import { TimelinePanel } from './features/timeline/TimelinePanel'
import { achievements, badges, goals, projects } from './data/journeyData'
import { milestones, futureMilestones, timelineEvents } from './data/journeyData'
import { resolveSkill, generateSubtopicsForSkill, getSkillsForPathway } from './data/learningData'
import type { Goal, Progression, Project, SectionId, Settings, Skill, UserProfile, FriendState, Route } from './types'
import { loadInitialState, getEmptyState } from './utils/storage'
import { calculateGoalXp, calculateLevel, computeStreak, XP_REWARDS, evaluateAchievementsAndBadges } from './lib/progression'
import { playSoundEffect } from './lib/sound'
import { useAuth } from './lib/auth'
import { usePersist } from './hooks/usePersist'
import { fetchAllUserData, saveAchievements, saveBadges, saveGoals, saveProfile, saveProjects, saveProgressionData, saveSettings, saveSkills } from './lib/api'
import { useToasts } from './hooks/useToasts'
import { UserSearch } from './components/UserSearch'
import { PublicProfileViewer } from './components/PublicProfileViewer'
import { FriendsPanel } from './features/friends/FriendsPanel'
import { ChatPanel } from './features/chat/ChatPanel'
import { ProjectDetail } from './features/projects/ProjectDetail'
import { GoalDetail } from './features/goals/GoalDetail'
import { SkillDetail } from './features/skills/SkillDetail'
import { AchievementDetail } from './features/achievements/AchievementDetail'
import { fetchIncomingFriendRequests, fetchIncomingMessages, saveFriendsState, saveChatState } from './lib/api'
import { Users, MessageSquare } from 'lucide-react'

const sections: Array<{ id: SectionId; label: string; icon: typeof House }> = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'profile', label: 'Profile', icon: House },
  { id: 'projects', label: 'Projects', icon: Layers3 },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'friends', label: 'Network', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'future', label: 'Future', icon: Compass },
  { id: 'career_world', label: 'Career World', icon: Compass },
]

const parseHash = (): Route => {
  if (typeof window === 'undefined') return { view: 'dashboard' }
  const hash = window.location.hash.replace('#', '')
  const params = new URLSearchParams(hash)
  const view = params.get('view') as any
  const id = params.get('id')
  if (!view) return { view: 'dashboard' }
  if (id) return { view, id } as Route
  return { view } as Route
}

const buildHash = (r: Route) => {
  const params = new URLSearchParams()
  params.set('view', r.view)
  if ('id' in r && r.id) params.set('id', r.id)
  return `#${params.toString()}`
}

function App() {
  const { user, loading, isConfigured, signOut } = useAuth()
  const hydratedFromRemote = useRef(false)
  const { toasts, push, dismiss } = useToasts()
  const [entered, setEntered] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userSearchOpen, setUserSearchOpen] = useState(false)

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEntered(true)
    } else if (isConfigured && !loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEntered(false)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrawerOpen(false)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserSearchOpen(false)
    }
  }, [user, loading, isConfigured])
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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
      skills: stored.skills.length ? stored.skills : [],
      projects: stored.projects.length ? stored.projects : projects,
      achievements: stored.achievements.length ? stored.achievements : achievements,
      badges: stored.badges.length ? stored.badges : badges,
      settings: stored.settings,
      profile: stored.profile,
      friends: stored.friends || { relationships: [] },
      chat: stored.chat || { messages: [], lastRead: {} },
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
  const [friendState, setFriendState] = useState<FriendState>(initialData.friends)
  const [incomingRequests, setIncomingRequests] = useState<string[]>([])
  const [chatState, setChatState] = useState<import('./types').ChatState>(initialData.chat)
  const [incomingMessages, setIncomingMessages] = useState<import('./types').ChatMessage[]>([])
  const [activeFriendIdForChat, setActiveFriendIdForChat] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  
  const handleOnboardingComplete = () => {
    // Explicitly zero out everything to ensure no mock data leaks
    setProgression(p => ({ ...p, xp: 0, level: 1, projectsCompleted: 0, goalsCompleted: 0, skillsMastered: 0, achievements: 0, badges: 0, streak: 0, longestStreak: 0 }))
    setProjectState([])
    setGoalState([])
    setSkillState([])
    setAchievementState([])
    setBadgeState([])
    setSettings(s => ({ ...s, onboarded: true }))
    
    // Explicitly force a save of the initial profile so they are marked as an existing user
    if (user) {
      saveProfile(user.id, profileState)
    }
  }

  const [activeProject, setActiveProject] = useState(initialData.projects[0] ?? projects[0])
  const [selectedGoalId] = useState(initialData.goals[0]?.id ?? goals[0]?.id ?? '')
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  // Load remote data when a user logs in
  useEffect(() => {
    if (!user) {
      if (isConfigured) {
        hydratedFromRemote.current = false
        setDataLoaded(false)
        const empty = getEmptyState()
        setProfileState(empty.profile)
        setProgression(empty.progression)
        setGoalState(empty.goals)
        setProjectState(empty.projects)
        setSkillState(empty.skills)
        setAchievementState(empty.achievements)
        setBadgeState(empty.badges)
        setSettings(empty.settings)
        setFriendState(empty.friends)
        setChatState(empty.chat)
      }
      return
    }
    
    hydratedFromRemote.current = false
    setDataLoaded(false)
    fetchAllUserData(user.id).then((remote) => {
      if (!remote) return
      
      const empty = getEmptyState()
      
      // Determine if this is a genuinely NEW user (no profile AND no progression AND no settings)
      const isNewUser = !remote.profile && !remote.progression && !remote.settings

      if (isNewUser) {
        // 1. BRAND-NEW USER: Initialize and persist their first-time state
        const initialProfile = {
          ...empty.profile,
          displayName: user.name || empty.profile.displayName,
          avatar: user.avatarUrl || empty.profile.avatar,
          contact: user.email || empty.profile.contact
        }
        
        setProfileState(initialProfile)
        setProgression(empty.progression)
        setGoalState(empty.goals)
        setProjectState(empty.projects)
        setSkillState(empty.skills)
        setAchievementState(empty.achievements)
        setBadgeState(empty.badges)
        setSettings(empty.settings) // onboarded is false by default
        setFriendState(empty.friends)
        setChatState(empty.chat)

        // Automatically persist the initial records to Supabase so they exist
        saveProfile(user.id, initialProfile)
        saveProgressionData(user.id, empty.progression)
        saveSettings(user.id, empty.settings)
        
      } else {
        // 2. EXISTING USER: Load their persisted data exactly as it is
        if (remote.profile) setProfileState(remote.profile)
        if (remote.progression) setProgression(remote.progression)
        if (remote.goals) setGoalState(remote.goals)
        if (remote.projects) setProjectState(remote.projects)
        if (remote.skills) setSkillState(remote.skills)
        if (remote.achievements) setAchievementState(remote.achievements)
        if (remote.badges) setBadgeState(remote.badges)
        if (remote.friends) setFriendState(remote.friends)
        if (remote.chat) setChatState(remote.chat)
        
        if (remote.settings) {
          setSettings(remote.settings)
        } else {
          // Fallback if settings are somehow missing but user is not new
          setSettings(s => ({ ...s, onboarded: true }))
        }
      }

      fetchIncomingFriendRequests(user.id).then(reqs => setIncomingRequests(reqs))
      fetchIncomingMessages(user.id).then(msgs => setIncomingMessages(msgs))

      setTimeout(() => {
        hydratedFromRemote.current = true
        setDataLoaded(true)
      }, 0)
    })
  }, [user, isConfigured])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Safe persistence: only saves when state mutates AFTER hydration
  usePersist(progression, user, dataLoaded, saveProgressionData)
  usePersist(goalState, user, dataLoaded, saveGoals)
  usePersist(skillState, user, dataLoaded, saveSkills)
  usePersist(projectState, user, dataLoaded, saveProjects)
  usePersist(achievementState, user, dataLoaded, saveAchievements)
  usePersist(badgeState, user, dataLoaded, saveBadges)
  usePersist(settings, user, dataLoaded, saveSettings)
  usePersist(profileState, user, dataLoaded, saveProfile)
  usePersist(friendState, user, dataLoaded, saveFriendsState)
  usePersist(chatState, user, dataLoaded, saveChatState)

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

  const updateGoal = (updatedGoal: Goal) => {
    setGoalState((prev) => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g))
    push('Goal updated successfully', 'info')
  }

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



  const markProjectCompleted = (projectId: string) => {
    setProjectState((prev) => prev.map((project) => {
      if (project.id !== projectId || project.completed) return project
      setProgression((p) => ({ ...p, xp: p.xp + XP_REWARDS.projectCompleted, projectsCompleted: p.projectsCompleted + 1 }))
      push(`Project completed! +${XP_REWARDS.projectCompleted} XP`, 'unlock')
      playSoundEffect('unlock', settings.soundEffects)
      return { ...project, completed: true, completedDate: new Date().toISOString().slice(0, 10), progress: 100, status: 'COMPLETED' }
    }))
  }

  const updateProject = (updatedProject: Project) => {
    setProjectState((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
    push('Project updated successfully', 'info')
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
    const searchName = (newSkill.canonicalName || newSkill.name || '').toLowerCase().trim()
    const existing = skillState.find(s => s.id === newSkill.id || (s.canonicalName || s.name || '').toLowerCase().trim() === searchName)
    
    if (existing) {
      push(`Skill restored: ${existing.name}`, 'info')
      playSoundEffect('click', settings.soundEffects)
      setSkillState((prev) => prev.map(s => {
        if (s.id === existing.id) {
           const updatedDomains = newSkill.activeDomains?.length ? Array.from(new Set([...(s.activeDomains||[]), ...newSkill.activeDomains])) : s.activeDomains;
           return { ...s, isIndependent: newSkill.isIndependent ?? true, activeDomains: updatedDomains }
        }
        return s
      }))
    } else {
      push(`Skill added: ${newSkill.name}`, 'info')
      playSoundEffect('click', settings.soundEffects)
      const resolved = resolveSkill(newSkill.canonicalName || newSkill.name)
      const subtopics = generateSubtopicsForSkill(resolved)
      const skillWithSubtopics = { ...newSkill, id: resolved.id, canonicalName: resolved.canonicalName, subtopics, isIndependent: newSkill.isIndependent ?? true }
      setSkillState((prev) => [...prev, skillWithSubtopics])
    }
  }

  const removeSkill = (skillId: string) => {
    setSkillState((prev) => {
      return prev.map(s => {
        if (s.id === skillId) {
          return { ...s, isIndependent: false, activeDomains: [] }
        }
        return s
      });
    });
    push('Skill removed from active learning', 'info')
  }

  const startPathway = (pathwayId: string) => {
    setSettings((prev) => {
      const active = prev.activePathways || []
      if (!active.includes(pathwayId)) {
        return { ...prev, activePathways: [pathwayId, ...active] }
      }
      return prev
    })

    // Reclassify independent skills that natively belong to the new domain
    setSkillState((prev) => {
      // getSkillsForPathway is imported, wait I removed it from App.tsx earlier! I need to ensure it's imported.
      // I'll add the import later if missing, or use SKILL_REGISTRY. Wait, I must import it.
      const pathwaySkillIds = getSkillsForPathway(pathwayId).map(s => (s.canonicalName||'').toLowerCase().trim())
      return prev.map(s => {
        const sCanon = (s.canonicalName || s.name || '').toLowerCase().trim()
        if (s.isIndependent && pathwaySkillIds.includes(sCanon)) {
          return { 
            ...s, 
            isIndependent: false, 
            activeDomains: Array.from(new Set([...(s.activeDomains || []), pathwayId])) 
          }
        }
        return s
      })
    })

    push('Domain container added', 'info')
  }

  const removePathway = (pathwayId: string) => {
    setSettings((prev) => {
      const active = prev.activePathways || []
      return { ...prev, activePathways: active.filter((id: string) => id !== pathwayId) }
    })
    setSkillState((prev) => prev.map(s => {
      if (s.activeDomains && s.activeDomains.includes(pathwayId)) {
        const newDomains = s.activeDomains.filter(id => id !== pathwayId);
        return { ...s, activeDomains: newDomains }
      }
      return s
    }))
    push('Domain container removed', 'info')
  }

  const associateSkillWithDomain = (skillId: string, domainId: string) => {
    setSkillState((prev) => prev.map(s => {
      const sCanon = (s.canonicalName || s.name || '').toLowerCase().trim()
      const searchCanon = skillId.toLowerCase().trim()
      if (s.id === skillId || sCanon === searchCanon || s.id.toLowerCase() === searchCanon) {
        const domains = s.activeDomains || []
        if (!domains.includes(domainId)) {
          return { ...s, activeDomains: [...domains, domainId], isIndependent: false }
        }
        return { ...s, isIndependent: false } // ensure it's not independent if it's already in the domain
      }
      return s
    }))
    push('Skill added to domain container', 'info')
  }

  const disassociateSkillFromDomain = (skillId: string, domainId: string) => {
    setSkillState((prev) => prev.map(s => {
      if (s.id === skillId) {
        const domains = (s.activeDomains || []).filter(id => id !== domainId);
        return { ...s, activeDomains: domains };
      }
      return s;
    }))
    push('Skill removed from domain', 'info')
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
    navigate({ view: section })
  }

  const navigate = (newRoute: Route) => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.hash = buildHash(newRoute)
    playSoundEffect('click', settings.soundEffects)
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const goBack = () => {
    window.history.back()
    playSoundEffect('click', settings.soundEffects)
  }

  return (
    <div className={`app-shell ${settings.theme}`}>
      <div className="noise" />
      <div className="aurora aura-a" />
      <div className="aurora aura-b" />
      <div className="grid-overlay" />
      <div className="spotlight" style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }} />
      <AnimatePresence mode="wait">
        {loading || (user && !dataLoaded) ? (
          <div key="loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
            <div className="loading-pulse" style={{ color: 'var(--cyan)', fontSize: '1.25rem', animation: 'pulse 1.5s infinite', letterSpacing: '0.1em', fontWeight: 500 }}>
              ESTABLISHING CONNECTION...
            </div>
            <div style={{ marginTop: '1rem', width: '120px', height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} style={{ width: '50%', height: '100%', background: 'var(--cyan)' }} />
            </div>
          </div>
        ) : !entered ? (
          <AuthShell onEnter={() => setEntered(true)} progression={progression} />
        ) : user && !settings.onboarded ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <motion.main key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="world-shell">
            <TopBar progression={progression} profile={profileState} onOpenDrawer={() => setDrawerOpen(true)} onOpenSearch={() => setUserSearchOpen(true)} />
            <div className="workspace">
              <aside className="sidebar">
                {sections.map((section) => {
                  return (
                    <motion.button 
                      key={section.id} 
                      whileHover={{ scale: 1.03, y: -2 }} 
                      whileTap={{ scale: 0.97 }} 
                      className={`nav-item ${route.view === section.id || route.view.startsWith(section.id.replace('s', '')) ? 'active' : ''}`}
                      onClick={() => selectSection(section.id)}
                      title={section.label}
                    >
                      <section.icon size={20} />
                      <span className="desktop-only" style={{ flex: 1 }}>{section.label}</span>
                      
                      {/* Unread indicators */}
                      {section.id === 'friends' && incomingRequests.length > 0 && (
                        <div style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
                          {incomingRequests.length}
                        </div>
                      )}
                      {section.id === 'chat' && (
                        (() => {
                          const unreadTotal = incomingMessages.filter(m => {
                            const lastRead = chatState.lastRead[m.senderId] || '1970-01-01T00:00:00.000Z'
                            return new Date(m.timestamp) > new Date(lastRead)
                          }).length
                          if (unreadTotal > 0) {
                            return (
                              <div style={{ background: 'var(--primary)', color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
                                {unreadTotal}
                              </div>
                            )
                          }
                          return null
                        })()
                      )}
                    </motion.button>
                  )
                })}
              </aside>

              <div className="main-stage">
                <motion.section ref={contentRef} className="content-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                  <AnimatePresence mode="wait">
                    {route.view === 'dashboard' && <Dashboard profile={profileState} progression={progression} projects={projectState} goals={goalState} skills={skillState} badges={badgeState} friendState={friendState} chatState={chatState} incomingRequestsCount={incomingRequests.length} unreadMessagesCount={incomingMessages.filter(m => new Date(m.timestamp) > new Date(chatState.lastRead[m.senderId] || '1970-01-01')).length} onNavigate={navigate} />}
                    {route.view === 'profile' && <ProfilePanel profile={profileState} progression={progression} skills={skillState} goals={goalState} goalsCompleted={completedGoals} onUpdateProfile={setProfileState} />}
                    {route.view === 'projects' && <ProjectsPanel projects={projectState} activeProject={activeProject} onSelectProject={(p) => navigate({ view: 'project_detail', id: p.id })} onMarkComplete={markProjectCompleted} onAddProject={addProject} onDeleteProject={deleteProject} />}
                    {route.view === 'project_detail' && <ProjectDetail project={projectState.find(p => p.id === route.id)!} onBack={goBack} onMarkComplete={markProjectCompleted} onDeleteProject={deleteProject} onUpdateProject={updateProject} />}
                    {route.view === 'learning' && <SkillsPanel 
            skills={skillState} 
            activePathways={settings.activePathways || []}
            onSelectSkill={(id) => navigate({ view: 'skill_detail', id })} 
            onAddSkill={addSkill} 
            onStartPathway={startPathway}
            onRemovePathway={removePathway}
            onAssociateSkill={associateSkillWithDomain}
            onDisassociateSkill={disassociateSkillFromDomain}
            onRemoveSkill={removeSkill}
          />}
                    {route.view === 'skill_detail' && <SkillDetail skill={skillState.find(s => s.id === route.id)!} onBack={goBack} onMarkMastered={toggleSkillMastery} onUpdateNotes={updateSkillNotes} />}
                    {route.view === 'goals' && <GoalsPanel goals={goalState} selectedGoalId={selectedGoalId} onSelectGoal={(id) => navigate({ view: 'goal_detail', id })} onCompleteGoal={markGoalCompleted} onAddGoal={addGoal} onRemoveGoal={removeGoal} onAddMilestone={addMilestone} />}
                    {route.view === 'goal_detail' && <GoalDetail goal={goalState.find(g => g.id === route.id)!} onBack={goBack} onMarkComplete={markGoalCompleted} onDeleteGoal={removeGoal} onUpdateGoal={updateGoal} />}
                    {route.view === 'achievements' && <AchievementsPanel achievements={achievementState} badges={badgeState} onSelectAchievement={(id) => navigate({ view: 'achievement_detail', id })} onSelectBadge={(id) => navigate({ view: 'badge_detail', id })} />}
                    {route.view === 'achievement_detail' && <AchievementDetail achievement={achievementState.find(a => a.id === route.id)!} onBack={goBack} />}
                    {route.view === 'badge_detail' && <BadgeDetail badge={badgeState.find(b => b.id === route.id)!} onBack={goBack} />}
                    {route.view === 'friends' && (
                      <FriendsPanel
                        friendState={friendState}
                        incomingRequests={incomingRequests}
                        onAccept={(id) => {
                          setFriendState((prev: FriendState) => ({ relationships: [...prev.relationships, { userId: id, status: 'accepted', createdAt: new Date().toISOString() }] }))
                          setIncomingRequests(prev => prev.filter(r => r !== id))
                          push('Friend request accepted!', 'info')
                        }}
                        onReject={(id) => {
                          setIncomingRequests(prev => prev.filter(r => r !== id))
                          push('Friend request rejected.', 'info')
                        }}
                        onRemove={(id) => {
                          setFriendState((prev: FriendState) => ({ relationships: prev.relationships.filter((r) => r.userId !== id) }))
                          push('Friend removed.', 'info')
                        }}
                        onOpenProfile={(id) => { setViewingUserId(id) }}
                        onMessage={(id) => {
                          setActiveFriendIdForChat(id)
                          navigate({ view: 'chat' })
                        }}
                      />
                    )}
                    {route.view === 'chat' && (
                      <ChatPanel
                        activeUserId={user?.id || ''}
                        chatState={chatState}
                        friendState={friendState}
                        incomingMessages={incomingMessages}
                        onSendMessage={(receiverId, content) => {
                          const msg = {
                            id: Math.random().toString(36).substring(7),
                            conversationId: [user?.id || '', receiverId].sort().join('_'),
                            senderId: user?.id || '',
                            receiverId,
                            content,
                            timestamp: new Date().toISOString()
                          }
                          setChatState(prev => ({ ...prev, messages: [...prev.messages, msg] }))
                        }}
                        onMarkRead={(friendId, timestamp) => {
                          setChatState(prev => ({ ...prev, lastRead: { ...prev.lastRead, [friendId]: timestamp } }))
                        }}
                        onOpenProfile={(id) => { setViewingUserId(id) }}
                        activeFriendId={activeFriendIdForChat}
                        onSetActiveFriendId={setActiveFriendIdForChat}
                      />
                    )}
                    {route.view === 'future' && (
                      <TimelinePanel milestones={milestones} futureMilestones={futureMilestones} timelineEvents={timelineEvents} onNavigateSection={selectSection} />
                    )}
                    {route.view === 'career_world' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <HUD progression={progression} completedGoals={completedGoals} masteredSkills={masteredSkills} earnedBadges={earnedBadges} />
                        <CareerWorld activeSection={route.view as SectionId} onSelectSection={selectSection} progression={progression} profile={profileState} />
                      </div>
                    )}
                  </AnimatePresence>
                </motion.section>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
      <ProfileDrawer open={drawerOpen} profile={profileState} settings={settings} user={user} onClose={() => setDrawerOpen(false)} onSettingsChange={setSettings} onProfileChange={setProfileState} onSignOut={signOut} />
      <UserSearch open={userSearchOpen} onClose={() => setUserSearchOpen(false)} onSelectUser={(userId) => { setViewingUserId(userId); setUserSearchOpen(false) }} />
      <PublicProfileViewer
        userId={viewingUserId}
        activeUserId={user?.id}
        friendState={friendState}
        onSendRequest={(id) => {
          if (id === user?.id) return
          setFriendState((prev: FriendState) => {
            if (prev.relationships.find((r) => r.userId === id)) return prev
            return { relationships: [...prev.relationships, { userId: id, status: 'pending_outgoing', createdAt: new Date().toISOString() }] }
          })
          push('Friend request sent!', 'info')
        }}
        onRemoveFriend={(id) => {
          setFriendState((prev: FriendState) => ({ relationships: prev.relationships.filter((r) => r.userId !== id) }))
          push('Friend removed.', 'info')
        }}
        onMessage={(id) => {
          setActiveFriendIdForChat(id)
          navigate({ view: 'chat' })
        }}
        onClose={() => setViewingUserId(null)}
      />
      <Toasts toasts={toasts} onDismiss={dismiss} />
      <Celebration xp={progression.xp} />
    </div>
  )
}

export default App