import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Compass, GraduationCap, House, Layers3, Target, Trophy, X } from 'lucide-react'
import { useEffect, useRef, useState, Suspense } from 'react'
import { AuthShell } from './features/auth/AuthShell'
import { OnboardingScreen } from './features/auth/OnboardingScreen'
import { AchievementsPanel } from './features/achievements/AchievementsPanel'
import { CareerWorld } from './components/CareerWorld'
import { HUD } from './components/HUD'
import { EditProfilePanel } from './features/profile/EditProfilePanel'
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
import { milestones } from './data/journeyData'
import { resolveSkill, generateSubtopicsForSkill, getSkillsForPathway, expandSkillSubtopicsIfNeeded } from './data/learningData.ts'
import { allTimeDistributions } from './data/timeDistributions/index'
import type { Goal, Progression, Project, SectionId, Settings, Skill, UserProfile, FriendState, Route } from './types'

import { loadInitialState, getEmptyState } from './utils/storage'
import { LoginUI } from './features/auth/LoginUI'
import { calculateLevel, computeStreak, XP_REWARDS, evaluateAchievementsAndBadges, evaluateDynamicMilestones, generateTimelineEvents, generateFutureMilestones } from './lib/progression'
import { playSoundEffect } from './lib/sound'
import { useAuth } from './lib/auth'
import { usePersist } from './hooks/usePersist'
import { supabase } from './lib/supabase'
import { fetchAllUserData, saveAchievements, saveBadges, saveGoals, saveProfile, saveProjects, saveProgressionData, saveSettings, saveSkills, fetchIncomingMessages, fetchSocialNetwork, acceptFriendRequest, rejectFriendRequest, removeFriend, sendFriendRequest, lookupLoginIdByAuthUserId, sendChatMessage } from './lib/api'
import { useToasts } from './hooks/useToasts'
import { UserSearch } from './components/UserSearch'
import { PublicProfileViewer } from './components/PublicProfileViewer'
import { FriendsPanel } from './features/friends/FriendsPanel'
import { ChatPanel } from './features/chat/ChatPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProjectDetail } from './features/projects/ProjectDetail'
import { SkillDetail } from './features/skills/SkillDetail'
import { AchievementDetail } from './features/achievements/AchievementDetail'
import { SettingsDrawer } from './features/settings/SettingsDrawer'
import { saveChatState } from './lib/api'
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

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [userSearchOpen, setUserSearchOpen] = useState(false)
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    // Check for OAuth callback errors
    console.log('[Auth Trace] App mounted with URL:', window.location.href)
    console.log('[Auth Trace] search:', window.location.search, 'hash:', window.location.hash)

    const params = new URLSearchParams(window.location.hash.replace('#', '?'))
    const error = params.get('error') || new URLSearchParams(window.location.search).get('error')
    const errorDescription = params.get('error_description') || new URLSearchParams(window.location.search).get('error_description')
    
    // Capture settings param
    const searchParams = new URLSearchParams(window.location.search)
    const shouldOpenSettings = searchParams.get('settings') === 'account'

    if (error) {
      console.error('OAuth Callback Error:', error, errorDescription)
      push(`Authentication Error: ${errorDescription || error}`, 'info')
      window.sessionStorage.removeItem('github_link_pending')
      window.sessionStorage.setItem('github_oauth_error', errorDescription || error)
      // Clean up URL after a short delay so any async auth listeners can see it if needed
      setTimeout(() => {
        window.history.replaceState(null, '', window.location.pathname)
      }, 500)
    }

    // If we just came back from an OAuth flow successfully
    if (params.get('access_token')) {
      const providerToken = params.get('provider_token')
      if (providerToken) {
        // Store it so github.ts can use it immediately before Supabase emits the event
        window.sessionStorage.setItem('github_provider_token', providerToken)
        console.log('[Auth Trace] Saved provider_token from URL hash')
      }
      push('Account successfully connected!', 'info')
      
      // CRITICAL FIX: Do NOT delete the URL hash immediately!
      // Supabase's `_initialize()` is asynchronous. If we delete the hash here,
      // Supabase GoTrue NEVER sees the tokens and NEVER updates the session
      // with the newly linked identity. We must let Supabase process it.
      // Supabase will automatically clean the hash when it is done processing.
      
    } else if (!error && shouldOpenSettings && window.sessionStorage.getItem('github_link_pending') === 'true') {
      console.warn('[GitHub OAuth] Returned from OAuth redirect with no access_token and no error — linkIdentity may have failed silently or used PKCE flow.')
    }

    // Open settings drawer if requested (e.g. returning from OAuth redirect)
    if (shouldOpenSettings) {
      setSettingsOpen(true)
      searchParams.delete('settings')
      const newSearch = searchParams.toString() ? '?' + searchParams.toString() : ''
      // Keep the hash intact for Supabase
      window.history.replaceState(null, '', window.location.pathname + newSearch + window.location.hash)
    }
  }, [])

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEntered(true)
      if (route.view === 'login') {
        window.location.hash = '#view=dashboard'
      }
    } else if (isConfigured && !loading) {
      // If we are explicitly on the login route, don't force 'entered' back to false
      // so they can see the login screen instead of the landing page.
      if (route.view !== 'login') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEntered(false)
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettingsOpen(false)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserSearchOpen(false)
    }
  }, [user, loading, isConfigured, route.view])

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash();
      // Protect routes: If unauthenticated and trying to access app routes, redirect to login
      if (!user && !loading && isConfigured && newRoute.view !== 'login' && entered) {
         window.location.hash = '#view=login';
         return;
      }
      setRoute(newRoute)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [user, loading, isConfigured, entered])

  const [initialData] = useState(() => {
    const stored = loadInitialState()
    const streakResult = computeStreak(stored.progression.streak, stored.progression.lastActiveDate)
    const initialProg: Progression = {
      ...stored.progression,
      streak: streakResult.newStreak,
      lastActiveDate: streakResult.lastDate,
    }
    const activeLoginId = typeof window !== 'undefined' ? window.localStorage.getItem('current_login_id') : null;
    if (activeLoginId && stored.profile) {
      if (!stored.profile.arinova_id) {
        stored.profile.arinova_id = activeLoginId;
      }
      if (!stored.profile.login_id) {
        stored.profile.login_id = activeLoginId;
      }
      if (!stored.profile.displayName) {
        stored.profile.displayName = 'Player';
      }
      if (!stored.profile.username) {
        stored.profile.username = activeLoginId;
      }
    }

    return {
      progression: initialProg,
      goals: stored.goals.length ? stored.goals : goals,
      skills: (stored.skills.length ? stored.skills : []).map(expandSkillSubtopicsIfNeeded),
      projects: stored.projects.length ? stored.projects : projects,
      achievements: stored.achievements.length ? stored.achievements : achievements,
      badges: stored.badges.length ? stored.badges : badges,
      settings: stored.settings,
      profile: stored.profile,
      friends: stored.friends || { relationships: [] },
      chat: stored.chat || { messages: [], lastRead: {} },
      activeSession: stored.activeSession || null,
    }
  })

  const prevLevelRef = useRef(calculateLevel(initialData.progression.xp))
  const [progression, setProgression] = useState<Progression>(initialData.progression)
  const [goalState, setGoalState] = useState(initialData.goals)
  const [skillState, setSkillState] = useState<Skill[]>(initialData.skills)
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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const [activeSession, setActiveSession] = useState<import('./types').ActiveSessionState | null>(initialData.activeSession)
  const [activeSessionElapsed, setActiveSessionElapsed] = useState(0)

  useEffect(() => {
    import('./utils/storage').then(({ saveProgression }) => {
      saveProgression(activeSession, 'activeSession')
    })
  }, [activeSession])

  useEffect(() => {
    let interval: number;
    if (activeSession && activeSession.isActive) {
      interval = window.setInterval(() => {
        const now = Date.now()
        const diff = now - activeSession.startTime
        setActiveSessionElapsed(Math.floor(diff / 1000) - activeSession.totalPausedSeconds)
      }, 1000)
    } else if (activeSession && !activeSession.isActive) {
      const diff = (activeSession.lastPauseTime || Date.now()) - activeSession.startTime
      setActiveSessionElapsed(Math.floor(diff / 1000) - activeSession.totalPausedSeconds)
    } else {
      setActiveSessionElapsed(0)
    }
    return () => window.clearInterval(interval)
  }, [activeSession])

  useEffect(() => {
    if (!user || !supabase) return;
    
    const channel = supabase.channel('online-users')
    
    channel.on('presence', { event: 'sync' }, () => {
      const newState = channel.presenceState()
      const onlineIds = new Set<string>()
      for (const key in newState) {
        newState[key].forEach((presence: any) => {
          if (presence.userId) onlineIds.add(presence.userId)
        })
      }
      setOnlineUsers(Array.from(onlineIds))
    })
    
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ userId: user.id })
      }
    })
    
    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const completeActiveSession = async () => {
    if (!activeSession) return
    const { skillId, subtopic, teachingMinutes = 60, solvingBaselineMinutes = 25 } = activeSession
    const minutesSpent = Math.max(1, Math.ceil(activeSessionElapsed / 60))
    const xpBase = subtopic.baseXP || 88  // minimum baseXP in the current economy
    let finalXp = 0 // Expired by default
    
    // Tier thresholds (minutes from session start)
    // PRIME  = finish within teaching + 50% of solving window
    // FOCUSED = finish within teaching + 100% of solving window
    // EXTENDED = no time limit — always earnable
    const primeLimit   = teachingMinutes + (solvingBaselineMinutes * 0.5)
    const focusedLimit = teachingMinutes + solvingBaselineMinutes

    if (minutesSpent <= primeLimit)   finalXp = Math.floor(xpBase * 2.5)   // fastest
    else if (minutesSpent <= focusedLimit) finalXp = Math.floor(xpBase * 1.75)  // on target
    else                              finalXp = xpBase                       // EXTENDED — no cap

    setProgression(prev => ({ ...prev, xp: prev.xp + finalXp }))
    
    let history: any[] = []
    setSkillState(prev => prev.map(s => {
      if (s.id !== skillId) return s
      const newSubtopics = (s.subtopics || []).map(st => {
        if (st.id === subtopic.id) {
          return { ...st, status: 'Completed' as const, completedAt: new Date().toISOString(), xpReward: finalXp, completionTimeMinutes: minutesSpent }
        }
        return st
      })
      const completedCount = newSubtopics.filter(st => st.status === 'Completed').length
      const totalCount = newSubtopics.length
      
      history = newSubtopics
        .filter(st => st.status === 'Completed' && st.completionTimeMinutes)
        .map(st => ({
          title: st.title,
          baseTime: st.baseTime,
          timeSpent: st.completionTimeMinutes,
          difficulty: st.difficulty
        }))

      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : s.progress
      const status = progress === 100 ? 'MASTERED' : s.status

      if (progress === 100 && s.status !== 'MASTERED' && !s.completed) {
        // Automatically award XP when hitting 100%
        setProgression(p => ({ ...p, xp: p.xp + XP_REWARDS.skillMastered, skillsMastered: p.skillsMastered + 1 }))
        push(`Skill mastered! +${XP_REWARDS.skillMastered} XP`, 'unlock')
      }

      return { ...s, subtopics: newSubtopics, progress, status, completed: (progress === 100 && !s.completed) ? new Date().toISOString().slice(0, 10) : s.completed }
    }))
    
    push(`Subtopic completed! +${finalXp} XP`, 'xp')
    setActiveSession(null)

    import('./lib/api').then(async ({ analyzeUserPerformance }) => {
      const { content } = await analyzeUserPerformance(history)
      if (content && typeof content === 'object') {
        setSkillState(prev => prev.map(s => {
          if (s.id !== skillId) return s
          const newSubtopics = (s.subtopics || []).map(st => {
            if (st.id === subtopic.id) {
              return { ...st, aiRecommendation: content as any }
            }
            return st
          })
          return { ...s, subtopics: newSubtopics }
        }))
      }
    }).catch(e => console.error('AI Error:', e))
  }

  const cancelActiveSession = () => {
    if (!activeSession) return
    setActiveSession(null)
  }

  const handleOnboardingComplete = () => {
    // Explicitly zero out everything else to ensure no mock data leaks
    setProjectState([])
    setGoalState([])
    setSkillState([])
    setBadgeState([])
    
    // Determine if they already got Journey Begins
    const hasJb = achievementState.some(a => a.id === 'journey-begins' && a.unlocked)
    
    const initialAchievements = achievements.map(a => 
      a.id === 'journey-begins' 
        ? { ...a, unlocked: true, dateUnlocked: new Date().toISOString().slice(0, 10), xpReward: 500 } 
        : a
    )
    
    setAchievementState(initialAchievements)
    setProgression(p => ({ 
      ...p, 
      xp: hasJb ? p.xp : p.xp + 500, 
      level: 1, 
      projectsCompleted: 0, 
      goalsCompleted: 0, 
      skillsMastered: 0, 
      achievements: hasJb ? p.achievements : p.achievements + 1, 
      badges: 0, 
      streak: 0, 
      longestStreak: 0 
    }))

    setProfileState(prev => {
      const prevDisplayed = prev.displayedAchievements || []
      const newProfile = !prevDisplayed.includes('journey-begins') 
        ? { ...prev, displayedAchievements: ['journey-begins', ...prevDisplayed] }
        : prev
        
      if (user) {
        saveProfile(user.id, newProfile)
      }
      return newProfile
    })

    setSettings(s => ({ ...s, onboarded: true }))
    
    if (!hasJb) {
      setTimeout(() => {
        push('Achievement unlocked: Journey Begins +500 XP', 'unlock', 5000)
        playSoundEffect('unlock', settings.soundEffects)
      }, 500)
    }

    if (user) {
      saveAchievements(user.id, initialAchievements)
      // Progression is auto-saved by usePersist when the state updates
    }
  }

  const [activeProject, setActiveProject] = useState(initialData.projects[0] ?? projects[0])
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [goalReminder, setGoalReminder] = useState<Goal | null>(null)
  
  // Track notifications independent of React render cycle to prevent Strict Mode duplicates
  const notifiedGoalsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const checkGoals = () => {
      setGoalState(prevGoals => {
        const today = new Date().toISOString().slice(0, 10)
        let updated = false
        const nextGoals = prevGoals.map(g => {
          if (g.status !== 'COMPLETED' && !g.notificationSent && g.targetDate && g.targetDate <= today) {
            if (!notifiedGoalsRef.current.has(g.id)) {
              notifiedGoalsRef.current.add(g.id)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Goal Reminder', { body: `You planned to work on '${g.title}' today.` })
              }
              setGoalReminder(current => current ? current : g)
            }
            updated = true
            return { ...g, notificationSent: true }
          }
          return g
        })
        return updated ? nextGoals : prevGoals
      })
    }

    const timeout = setTimeout(checkGoals, 1500)
    const interval = setInterval(checkGoals, 60000)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

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

    // CRITICAL FIX: Resolve the permanent login_id from user_identities BEFORE
    // loading any profile data. This ensures that OAuth logins (Google) and
    // session restores always map back to the correct permanent Arinova ID.
    const resolveAndLoad = async () => {
      let activeLoginId = window.localStorage.getItem('current_login_id')

      // If current_login_id is not in localStorage (e.g. OAuth redirect, session restore),
      // look it up from the user_identities table using the auth UUID.
      if (!activeLoginId || activeLoginId.includes('@')) {
        const resolvedLoginId = await lookupLoginIdByAuthUserId(user.id)
        if (resolvedLoginId) {
          // Migrate the session token from the un-namespaced key to the namespaced key.
          // When Google OAuth redirected back, GoTrue stored the session under the base key
          // (because current_login_id was not set yet). Now that we know the login_id,
          // we must move the token so the custom storage adapter can find it.
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
          let hostname = ''
          try { hostname = new URL(supabaseUrl).hostname.split('.')[0] } catch (_) { /* */ }
          const baseKey = `sb-${hostname}-auth-token`
          const existingToken = window.localStorage.getItem(baseKey) || window.sessionStorage.getItem(baseKey)
          
          activeLoginId = resolvedLoginId
          window.localStorage.setItem('current_login_id', resolvedLoginId)
          window.localStorage.setItem('auth_remember_me', 'true')

          // Copy the session token to the namespaced key and remove the old one
          if (existingToken) {
            const namespacedKey = `${baseKey}-${resolvedLoginId}`
            window.localStorage.setItem(namespacedKey, existingToken)
            window.localStorage.removeItem(baseKey)
            window.sessionStorage.removeItem(baseKey)
          }

          // Force the Supabase client to re-read the session from the new key location
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
              // Session wasn't picked up — try to set it explicitly from the stored token
              const namespacedKey = `${baseKey}-${resolvedLoginId}`
              const tokenStr = window.localStorage.getItem(namespacedKey)
              if (tokenStr) {
                try {
                  const parsed = JSON.parse(tokenStr)
                  if (parsed?.access_token && parsed?.refresh_token) {
                    await supabase.auth.setSession({
                      access_token: parsed.access_token,
                      refresh_token: parsed.refresh_token
                    })
                  }
                } catch (_) { /* ignore parse errors */ }
              }
            }
          }
        }
      }
      
      let remote = await fetchAllUserData(user.id)
      if (!remote) return
      
      // FALLBACK: If lookupLoginIdByAuthUserId failed (e.g. due to RLS) and activeLoginId is STILL null,
      // but the user DOES have an existing profile, we can extract the login_id from the profile itself!
      // This is necessary because Google OAuth redirects clear the local storage state.
      if (!activeLoginId && remote.profile) {
        const profileLoginId = remote.profile.login_id || remote.profile.arinova_id || remote.profile.username;
        if (profileLoginId && profileLoginId !== 'player') {
          activeLoginId = profileLoginId;
          
          // Now that we have the login_id, we MUST migrate the session token from the base key to the namespaced key
          // just like we would have done above, so the custom storage adapter can find it for future requests.
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
          let hostname = ''
          try { hostname = new URL(supabaseUrl).hostname.split('.')[0] } catch (_) { /* */ }
          const baseKey = `sb-${hostname}-auth-token`
          const existingToken = window.localStorage.getItem(baseKey) || window.sessionStorage.getItem(baseKey)
          
          window.localStorage.setItem('current_login_id', activeLoginId)
          window.localStorage.setItem('auth_remember_me', 'true')
          
          if (existingToken) {
            const namespacedKey = `${baseKey}-${activeLoginId}`
            window.localStorage.setItem(namespacedKey, existingToken)
            window.localStorage.removeItem(baseKey)
            window.sessionStorage.removeItem(baseKey)
            
            // Force the Supabase client to re-read the session from the new key location
            if (supabase) {
              const { data: { session } } = await supabase.auth.getSession()
              if (!session) {
                try {
                  const parsed = JSON.parse(existingToken)
                  if (parsed?.access_token && parsed?.refresh_token) {
                    await supabase.auth.setSession({
                      access_token: parsed.access_token,
                      refresh_token: parsed.refresh_token
                    })
                  }
                } catch (_) { /* ignore parse errors */ }
              }
            }
          }
          
          // Re-fetch data using the fully configured storage key to ensure all data loads cleanly
          remote = await fetchAllUserData(user.id)
          if (!remote) return
        }
      }
      
      const empty = getEmptyState()
      
      // Determine if this is a genuinely NEW user (no profile AND no progression AND no settings)
      const isNewUser = !remote.profile && !remote.progression && !remote.settings

      if (isNewUser) {
        // 1. BRAND-NEW USER: Initialize and persist their first-time state
        // Do NOT award Journey Begins XP here, because handleOnboardingComplete will wipe it out.
        // It will be awarded precisely when they finish the onboarding wizard.
        const initialProgression = {
          ...empty.progression,
          xp: 0,
          achievements: 0
        }
        const initialProfile = {
          ...empty.profile,
          displayName: activeLoginId || (user.name !== 'Player' ? user.name : null) || empty.profile.displayName,
          username: activeLoginId || empty.profile.username,
          arinova_id: activeLoginId || undefined,
          avatar: user.avatarUrl || empty.profile.avatar,
          contact: user.email || empty.profile.contact,
          displayedAchievements: []
        }
        
        setProfileState(initialProfile)
        setProgression(initialProgression)
        setGoalState(empty.goals)
        setProjectState(empty.projects)
        setSkillState(empty.skills)
        setAchievementState(achievements) // load base achievements with all unlocked: false
        setBadgeState(empty.badges)
        setSettings(empty.settings) // onboarded is false by default
        setFriendState(empty.friends)
        setChatState(empty.chat)
        
        // Automatically persist the initial records to Supabase so they exist
        saveProfile(user.id, initialProfile)
        saveProgressionData(user.id, initialProgression)
        saveSettings(user.id, empty.settings)
        saveAchievements(user.id, achievements)
        
      } else {
        // 2. EXISTING USER: Load their persisted data exactly as it is
        if (remote.profile) {
          const loadedProfile = { ...remote.profile }
          
          if (activeLoginId) {
            // Retroactively fix missing arinova_id
            if (!loadedProfile.arinova_id) {
              loadedProfile.arinova_id = activeLoginId
            }
            if (!loadedProfile.login_id) {
              loadedProfile.login_id = activeLoginId
            }
            // Retroactively fix missing username
            if (!loadedProfile.username) {
              loadedProfile.username = activeLoginId
            }
          }
          
          if (loadedProfile.contact && (loadedProfile.contact.includes('@example.com') || loadedProfile.contact.startsWith('id_') || loadedProfile.contact.includes('...temp...'))) {
            loadedProfile.contact = ''
          }
          
          setProfileState(loadedProfile)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('futureme-profile', JSON.stringify(loadedProfile))
          }
        } else if (activeLoginId) {
          // Fallback if remote profile is missing but user is not completely new
          const fallbackProfile = {
            ...empty.profile,
            displayName: 'Player',
            username: activeLoginId,
            arinova_id: activeLoginId,
            login_id: activeLoginId,
            avatar: user.avatarUrl || empty.profile.avatar,
            contact: user.email || empty.profile.contact
          }
          setProfileState(fallbackProfile)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('futureme-profile', JSON.stringify(fallbackProfile))
          }
        }
        let loadedProgression = remote.progression || empty.progression
        const savedAch = remote.achievements || empty.achievements
        let loadedAchievements = achievements.map(baseAch => {
          const existing = savedAch.find((a: any) => a.id === baseAch.id)
          return existing ? { ...baseAch, ...existing } : baseAch
        })

        setProgression(loadedProgression)
        setAchievementState(loadedAchievements)
        if (remote.goals) setGoalState(remote.goals)
        if (remote.projects) {
          const filteredProjects = remote.projects.filter((p: any) => p.id !== 'futureme')
          setProjectState(filteredProjects)
        }
        if (remote.skills) setSkillState(remote.skills.map(expandSkillSubtopicsIfNeeded))
        if (remote.badges) setBadgeState(remote.badges)
        
        // CRITICAL FIX: Fetch actual social network state instead of relying on legacy profile.data.friends JSON
        try {
          const network = await fetchSocialNetwork(user.id)
          setFriendState({ relationships: network.relationships })
          setIncomingRequests(network.incomingRequests.map((r: any) => r.sender_id))
        } catch (err) {
          console.error("Failed to fetch social network", err)
          if (remote.friends) setFriendState(remote.friends)
        }
        if (remote.chat) setChatState(remote.chat)
        
        if (remote.settings) {
          // Ensure existing users are marked as onboarded even if the flag is missing
          setSettings({ ...remote.settings, onboarded: true })
        } else {
          // Fallback if settings are somehow missing but user is not new
          setSettings(s => ({ ...s, onboarded: true }))
        }
      }

      fetchIncomingMessages(user.id).then(msgs => setIncomingMessages(msgs))

      setTimeout(() => {
        hydratedFromRemote.current = true
        setDataLoaded(true)
      }, 0)
    }

    resolveAndLoad()
  }, [user, isConfigured])

  // Safe persistence: only saves when state mutates AFTER hydration
  usePersist(profileState, user, dataLoaded, saveProfile)
  usePersist(progression, user, dataLoaded, saveProgressionData)
  usePersist(goalState, user, dataLoaded, saveGoals)
  usePersist(skillState, user, dataLoaded, saveSkills)
  usePersist(projectState, user, dataLoaded, saveProjects)
  usePersist(achievementState, user, dataLoaded, saveAchievements)
  usePersist(badgeState, user, dataLoaded, saveBadges)
  usePersist(settings, user, dataLoaded, saveSettings)
  usePersist(chatState, user, dataLoaded, saveChatState)

  const hasSyncedInitialLevel = useRef(false)

  // Show a toast and sound when the player levels up or gains XP
  useEffect(() => {
    if (!dataLoaded) {
      hasSyncedInitialLevel.current = false
      return
    }

    const level = calculateLevel(progression.xp)

    if (!hasSyncedInitialLevel.current) {
      // First time dataLoaded is true, silently synchronize the level ref.
      // This prevents hydration batching from appearing as a level up.
      prevLevelRef.current = level
      hasSyncedInitialLevel.current = true
      return
    }

    if (level > prevLevelRef.current) {
      push(`LEVEL UP! You reached level ${level}`, 'level', 4000)
      playSoundEffect('level', settings.soundEffects)
    }
    prevLevelRef.current = level
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progression.xp, settings.soundEffects, dataLoaded])

  const evaluatingRewardsRef = useRef(false)

  // Automated badge & achievement evaluator
  useEffect(() => {
    if (evaluatingRewardsRef.current) return
    
    // Quick check if there is anything to unlock BEFORE attempting to mutate state
    const { newEarnedBadges, newUnlockedAchievements } = evaluateAchievementsAndBadges(
      progression, goalState, projectState, skillState, achievementState, badgeState
    )

    if (newEarnedBadges.length === 0 && newUnlockedAchievements.length === 0) {
      return // Nothing to do
    }

    evaluatingRewardsRef.current = true

    // We have rewards! Let's update all state atomically 
    const { updatedBadges, updatedAchievements } = evaluateAchievementsAndBadges(
      progression, goalState, projectState, skillState, achievementState, badgeState
    )

    if (newEarnedBadges.length > 0) {
      setBadgeState(updatedBadges)
      let totalBadgeXp = 0
      newEarnedBadges.forEach((b) => {
        totalBadgeXp += XP_REWARDS.badge
        push(`Badge earned: ${b.title} +${XP_REWARDS.badge} XP`, 'badge')
      })
      if (totalBadgeXp > 0) {
        setProgression(p => ({ ...p, xp: p.xp + totalBadgeXp, badges: p.badges + newEarnedBadges.length }))
      }
    }

    if (newUnlockedAchievements.length > 0) {
      setAchievementState(updatedAchievements)
      let totalAchXp = 0
      newUnlockedAchievements.forEach((a) => {
        const reward = a.xpReward || XP_REWARDS.achievement
        totalAchXp += reward
        push(`Achievement unlocked: ${a.title} +${reward} XP`, 'unlock')
      })
      if (totalAchXp > 0) {
        setProgression(p => ({ ...p, xp: p.xp + totalAchXp, achievements: p.achievements + newUnlockedAchievements.length }))
      }
    }
    
    if (newEarnedBadges.length > 0 || newUnlockedAchievements.length > 0) {
      playSoundEffect('unlock', settings.soundEffects)
    }

    // Release the lock after a short delay to allow React to commit the state
    setTimeout(() => {
      evaluatingRewardsRef.current = false
    }, 150)

  }, [progression, goalState, projectState, skillState, achievementState, badgeState])

  const completedGoals = goalState.filter((goal) => goal.status === 'COMPLETED').length
  const masteredSkills = skillState.filter((skill) => skill.status === 'MASTERED').length
  const earnedBadges = badgeState.filter((badge) => badge.earned).length

  const markGoalCompleted = (goalId: string) => {
    setGoalState((prev) => prev.filter((goal) => goal.id !== goalId))
    push(`Goal marked as done.`, 'info')
  }

  const addGoal = (goal: Goal) => {
    setGoalState((prev) => [...prev, goal])
    playSoundEffect('click', settings.soundEffects)
  }

  const removeGoal = (goalId: string) => {
    setGoalState((prev) => prev.filter((goal) => goal.id !== goalId))
    playSoundEffect('click', settings.soundEffects)
  }



  const markProjectCompleted = async (projectId: string) => {
    const project = projectState.find(p => p.id === projectId)
    if (!project || project.completed) return

    // 1. Generate the stable reward key
    const rewardKey = project.provider && project.externalId ? `project_${project.provider}_${project.externalId}` : `project_local_${project.id}`

    // 2. Fetch the metadata needed for dynamic XP calculation, if it's an external project
    let metadata: any = undefined;
    let baseTargetXp: number = XP_REWARDS.projectCompleted;

    if (project.provider && project.externalId && user?.id) {
      const { supabase } = await import('./lib/supabase')
      if (supabase) {
        const { data: existing } = await supabase.from('external_projects')
          .select('metadata')
          .eq('user_id', user.id)
          .eq('provider', project.provider)
          .eq('external_id', project.externalId)
          .single();
        
        metadata = existing?.metadata;
        
        const { calculateExternalProjectXP } = await import('./lib/progression')
        // Calculate the raw target XP for this project based ONLY on metadata, 
        // passing 0 for currentXpAwarded since we use claimedRewards as the ledger.
        baseTargetXp = calculateExternalProjectXP('completed', 0, metadata);

        // Update the external_project row's status, ignoring xp_awarded logic for the authoritative check
        await supabase.from('external_projects').upsert({
          user_id: user.id,
          provider: project.provider,
          external_id: project.externalId,
          status: 'completed',
          metadata: metadata,
          last_synced_at: new Date().toISOString()
        }, { onConflict: 'user_id,provider,external_id' })
      }
    }

    setProjectState((prev) => prev.map((p) => {
      if (p.id !== projectId || p.completed) return p
      return { ...p, completed: true, completedDate: new Date().toISOString().slice(0, 10), progress: 100, status: 'COMPLETED' }
    }))
    
    // 3. Read the CURRENT persisted progression.claimedRewards inside a functional update 
    // to strictly prevent stale closures and ensure atomic ledger updates.
    setProgression((prog) => {
       const hasClaimed = prog.claimedRewards?.includes(rewardKey);
       
       // 4. If it exists: award 0 XP
       // 5. If it does not exist: calculate XP, award exactly once
       const actualXp = hasClaimed ? 0 : baseTargetXp;
       
       if (actualXp > 0) {
          setTimeout(() => {
             push(`Project completed! +${actualXp} XP`, 'unlock')
             playSoundEffect('unlock', settings.soundEffects)
          }, 0)
          
          return {
             ...prog,
             xp: prog.xp + actualXp,
             projectsCompleted: prog.projectsCompleted + 1,
             claimedRewards: [...(prog.claimedRewards || []), rewardKey]
          }
       } else {
          setTimeout(() => {
             push('Project completed!', 'info')
          }, 0)
          
          return {
             ...prog,
             projectsCompleted: prog.projectsCompleted + 1,
             // DO NOT append another claim or modify the existing claim
             claimedRewards: prog.claimedRewards || []
          }
       }
    })
  }

  const updateProject = (updatedProject: Project) => {
    setProjectState((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
    push('Project updated successfully', 'info')
  }

  const deleteProject = async (projectId: string) => {
    const projectToDelete = projectState.find(p => p.id === projectId)
    
    // If it's a synced external project, remove its tracking record in Codeascend DB
    if (projectToDelete?.provider && projectToDelete?.externalId && user?.id) {
      try {
        const { supabase } = await import('./lib/supabase')
        if (supabase) {
          const { error } = await supabase
            .from('external_projects')
            .update({ is_deleted: true })
            .eq('user_id', user.id)
            .eq('provider', projectToDelete.provider)
            .eq('external_id', projectToDelete.externalId)
            
          if (error) {
            push('Failed to delete integration record: ' + error.message, 'info')
            return // Halt deletion if the DB operation fails
          }
        }
      } catch (err: any) {
        push('Failed to delete project tracking: ' + err.message, 'info')
        return
      }
    }

    setProjectState((prev) => {
      const next = prev.filter((p) => p.id !== projectId)
      if (activeProject?.id === projectId && next.length > 0) {
        setActiveProject(next[0])
      }
      return next
    })
    
    push('Project deleted', 'info')
    playSoundEffect('click', settings.soundEffects)
    
    // Redirect if we are currently viewing the deleted project
    if (route.view === 'project_detail') {
      window.location.hash = '#view=projects'
    }
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
      return s
    }))
    push('Skill removed from domain', 'info')
  }

  const updateSkillNotes = (skillId: string, notes: string) => {
    setSkillState((prev) => prev.map((s) => (s.id === skillId ? { ...s, notes } : s)))
    push('Skill notes updated', 'info')
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
    <MotionConfig reducedMotion={settings.reducedMotion ? 'always' : 'user'}>
      <div className={`app-shell ${settings.theme} ${settings.compactLayout ? 'compact' : ''} ${settings.reducedMotion ? 'reduced-motion' : 'animation-' + (settings.animationIntensity || 'high')} ${settings.customBackground ? 'custom-bg' : ''}`}
        style={{
          ...(settings.accentColor ? { '--primary': settings.accentColor, '--cyan': settings.accentColor } : {}),
          ...(settings.customBackground ? { backgroundImage: `url(${settings.customBackground})` } : {})
        } as React.CSSProperties}>
      <div className="noise" />
      <div className="aurora aura-a" />
      <div className="aurora aura-b" />
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
        ) : (!entered && route.view !== 'login') ? (
          <AuthShell onEnter={() => { setEntered(true); window.location.hash = '#view=login'; }} progression={progression} />
        ) : !user ? (
          <LoginUI />
        ) : user && !settings.onboarded ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <motion.main key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="world-shell">
            <Suspense fallback={null}>
            </Suspense>
            <TopBar 
              progression={progression} 
              profile={profileState} 
              onOpenSettings={() => setSettingsOpen(true)}
              activeSession={activeSession}
              activeSessionElapsed={activeSessionElapsed}
              onOpenActiveSession={() => {
                if (activeSession) {
                  navigate({ view: 'skill_detail', id: activeSession.skillId })
                }
              }}
            />
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
                            if (chatState.mutedUsers?.includes(m.senderId)) return false
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
                  <ErrorBoundary>
                  <AnimatePresence mode="wait">
                    {route.view === 'dashboard' && <Dashboard profile={profileState} progression={progression} projects={projectState} goals={goalState} skills={skillState} badges={badgeState} friendState={friendState} chatState={chatState} incomingRequestsCount={incomingRequests.length} unreadMessagesCount={incomingMessages.filter(m => !chatState.mutedUsers?.includes(m.senderId) && new Date(m.timestamp) > new Date(chatState.lastRead[m.senderId] || '1970-01-01')).length} onNavigate={navigate} />}
                    {route.view === 'profile' && <ProfilePanel profile={profileState} progression={progression} skills={skillState} goals={goalState} onEditProfile={() => navigate({ view: 'edit_profile' })} />}
                    {route.view === 'edit_profile' && <EditProfilePanel profile={profileState} achievements={achievementState} badges={badgeState} projects={projectState} skills={skillState} dynamicMilestones={evaluateDynamicMilestones(progression, skillState)} userId={user?.id} onClose={() => navigate({ view: 'profile' })} onProfileChange={setProfileState} onSaveProfile={async (updatedProfile) => {
                      setProfileState(updatedProfile)
                      if (typeof window !== 'undefined') {
                        window.localStorage.setItem('futureme-profile', JSON.stringify(updatedProfile))
                      }
                      if (user) {
                        const success = await saveProfile(user.id, updatedProfile)
                        if (success) {
                          push('Profile saved successfully', 'info')
                        } else {
                          push('Failed to save profile to database', 'info')
                        }
                      }
                      navigate({ view: 'profile' })
                    }} />}
                    {route.view === 'projects' && <ProjectsPanel projects={projectState} activeProject={activeProject} onSelectProject={(p) => navigate({ view: 'project_detail', id: p.id })} onMarkComplete={markProjectCompleted} onDeleteProject={deleteProject} />}
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
                    {route.view === 'skill_detail' && <SkillDetail 
                      skill={skillState.find(s => s.id === route.id)!} 
                      onBack={goBack} 
                      onUpdateNotes={updateSkillNotes} 
                      onStartSession={(subtopic) => {
                        const dist = allTimeDistributions[route.id]?.[subtopic.title];
                        const trueDifficulty = dist?.intentionalDifficulty || subtopic.difficulty || 'Normal';
                        const tMins = dist?.teachingMinutes || 60;
                        const sMins = dist?.solvingBaselineMinutes?.[trueDifficulty] || 25;
                        const updatedSubtopic = { ...subtopic, difficulty: trueDifficulty };
                        
                        setActiveSession({
                          skillId: route.id,
                          subtopic: updatedSubtopic,
                          baselineTime: tMins + sMins,
                          teachingMinutes: tMins,
                          solvingBaselineMinutes: sMins,
                          startTime: Date.now(),
                          totalPausedSeconds: 0,
                          lastPauseTime: null,
                          isActive: true
                        })
                        navigate({ view: 'goals' })
                      }}
                      onCloseSession={() => {
                        // Just closing modal, session keeps running
                      }}
                      activeSession={activeSession}
                    />}
                    {route.view === 'goals' && <GoalsPanel 
                      goals={goalState} 
                      onCompleteActiveSession={completeActiveSession}
                      onCancelActiveSession={cancelActiveSession}
                      activeSession={activeSession}
                      activeSessionElapsed={activeSessionElapsed}
                      onAddGoal={addGoal} 
                      onRemoveGoal={removeGoal} 

                      onCompleteGoal={markGoalCompleted} 
                    />}

                    {route.view === 'achievements' && <AchievementsPanel achievements={achievementState} badges={badgeState} dynamicMilestones={evaluateDynamicMilestones(progression, skillState)} onSelectAchievement={(id) => navigate({ view: 'achievement_detail', id })} onSelectBadge={(id) => navigate({ view: 'badge_detail', id })} />}
                    {route.view === 'achievement_detail' && <AchievementDetail achievement={achievementState.find(a => a.id === route.id)!} onBack={goBack} />}
                    {route.view === 'badge_detail' && <BadgeDetail badge={badgeState.find(b => b.id === route.id)!} onBack={goBack} />}
                    {route.view === 'friends' && (
                        <FriendsPanel
                          onlineUsers={onlineUsers}
                          friendState={friendState}
                          incomingRequests={incomingRequests}
                          onOpenSearch={() => setUserSearchOpen(true)}
                          onAccept={async (id) => {
                            // Find the request ID
                            try {
                              const network = await fetchSocialNetwork(user!.id)
                              const request = network.incomingRequests.find((r: any) => r.sender_id === id)
                              if (request) {
                                await acceptFriendRequest(request.id)
                                setFriendState((prev: FriendState) => ({ relationships: [...prev.relationships.filter(r => r.userId !== id), { userId: id, status: 'accepted', createdAt: new Date().toISOString() }] }))
                                setIncomingRequests(prev => prev.filter(r => r !== id))
                                push('Friend request accepted!', 'info')
                              }
                            } catch (err: any) {
                              push('Failed to accept request.', 'info')
                            }
                          }}
                          onReject={async (id) => {
                            try {
                              const network = await fetchSocialNetwork(user!.id)
                              const request = network.incomingRequests.find((r: any) => r.sender_id === id)
                              if (request) {
                                await rejectFriendRequest(request.id)
                                setFriendState((prev: FriendState) => ({ relationships: prev.relationships.filter((r) => r.userId !== id) }))
                                setIncomingRequests(prev => prev.filter(r => r !== id))
                                push('Friend request rejected.', 'info')
                              }
                            } catch (err: any) {
                              push('Failed to reject request.', 'info')
                            }
                          }}
                          onRemove={async (id) => {
                            try {
                              await removeFriend(id)
                              setFriendState((prev: FriendState) => ({ relationships: prev.relationships.filter((r) => r.userId !== id) }))
                              push('Friend removed.', 'info')
                            } catch (err: any) {
                              push('Failed to remove friend.', 'info')
                            }
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
                        onSendMessage={async (receiverId, content) => {
                          const msgId = Math.random().toString(36).substring(7)
                          const timestamp = new Date().toISOString()
                          
                          try {
                            const newMsg = await sendChatMessage(receiverId, msgId, content, timestamp)
                            if (newMsg) {
                              setChatState(prev => ({ ...prev, messages: [...(prev.messages || []), newMsg] }))
                            }
                          } catch (err: any) {
                            console.error("SEND MESSAGE RPC FAILED:", err);
                            // If it fails (e.g. blocked), keep it in the UI as a failed message.
                            const failedMsg = {
                              id: msgId,
                              conversationId: [user?.id || '', receiverId].sort().join('_'),
                              senderId: user?.id || '',
                              receiverId,
                              content,
                              timestamp,
                              isFailed: true
                            }
                            setChatState(prev => ({ ...prev, messages: [...(prev.messages || []), failedMsg] }))
                          }
                        }}
                        onEditMessage={(messageId, newContent) => {
                          setChatState(prev => ({
                            ...prev,
                            messages: (prev.messages || []).map(m => m.id === messageId ? { ...m, content: newContent, editedAt: new Date().toISOString() } : m)
                          }))
                        }}
                        onDeleteForMe={(messageId) => {
                          setChatState(prev => ({
                            ...prev,
                            hiddenMessages: [...(prev.hiddenMessages || []), messageId]
                          }))
                        }}
                        onDeleteForEveryone={(messageId) => {
                          setChatState(prev => ({
                            ...prev,
                            messages: (prev.messages || []).map(m => m.id === messageId ? { ...m, deletedForEveryone: true, content: '' } : m)
                          }))
                        }}
                        onMarkRead={(friendId, timestamp) => {
                          setChatState(prev => ({ ...prev, lastRead: { ...(prev.lastRead || {}), [friendId]: timestamp } }))
                        }}
                        onToggleMute={(friendId) => {
                          setChatState(prev => {
                            const muted = prev.mutedUsers || []
                            return { ...prev, mutedUsers: muted.includes(friendId) ? muted.filter(id => id !== friendId) : [...muted, friendId] }
                          })
                        }}
                        onToggleBlock={(friendId) => {
                          setChatState(prev => {
                            const blocked = prev.blockedUsers || []
                            const newState = { ...prev, blockedUsers: blocked.includes(friendId) ? blocked.filter(id => id !== friendId) : [...blocked, friendId] }
                            if (user) saveChatState(user.id, newState)
                            return newState
                          })
                        }}
                        onClearChat={(friendId) => {
                          setChatState(prev => ({
                            ...prev,
                            clearedChats: { ...(prev.clearedChats || {}), [friendId]: new Date().toISOString() }
                          }))
                        }}
                        activeFriendId={activeFriendIdForChat}
                        onSetActiveFriendId={setActiveFriendIdForChat}
                        onOpenProfile={(id) => { setViewingUserId(id); setUserSearchOpen(true) }}
                        onlineUsers={onlineUsers}
                      />
                    )}

                    {route.view === 'future' && (
                      <TimelinePanel milestones={milestones} futureMilestones={generateFutureMilestones(progression, projectState, skillState, goalState)} timelineEvents={generateTimelineEvents(projectState, skillState, achievementState)} onNavigateSection={selectSection} />
                    )}
                    {route.view === 'career_world' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <HUD progression={progression} completedGoals={completedGoals} masteredSkills={masteredSkills} earnedBadges={earnedBadges} />
                        <CareerWorld activeSection={route.view as SectionId} onSelectSection={selectSection} progression={progression} profile={profileState} />
                      </div>
                    )}

                  </AnimatePresence>
                  </ErrorBoundary>
                </motion.section>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
      
      {goalReminder && (
        <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'var(--bg-surface)', padding: '1.5rem 2rem', borderRadius: '16px', minWidth: '350px', border: '1px solid var(--cyan)', textAlign: 'center', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
            <button 
              onClick={() => setGoalReminder(null)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>Goal Reminder</h3>
            <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              You planned to work on <strong>'{goalReminder.title}'</strong> today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setGoalReminder(null)} 
                style={{ flex: 1, padding: '0.75rem', background: 'var(--cyan)', color: '#000', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Okay
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <SettingsDrawer 
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        onSignOut={signOut}
        profile={profileState}
        userId={user?.id}
        projects={projectState}
        onAddProjects={(newProjs) => setProjectState(prev => [...newProjs, ...prev])}
        onAddLanguages={(langs) => {
          langs.forEach(lang => {
            // Because state updates are batched, we should check against a robust resolved name if possible.
            // However, addSkill uses functional updates which is safe. We will rely on addSkill handling the generation.
            // But wait, addSkill just takes a Skill object! Let's build the complete skill object here.
            if (!skillState.some(s => s.name.toLowerCase() === lang.toLowerCase() || s.canonicalName?.toLowerCase() === lang.toLowerCase())) {
              const resolved = resolveSkill(lang);
              const subtopics = resolved ? generateSubtopicsForSkill(resolved) : [];
              
              addSkill({
                id: crypto.randomUUID(),
                name: resolved?.canonicalName || lang,
                canonicalName: resolved?.canonicalName,
                progress: 0,
                status: 'LEARNING',
                started: new Date().toISOString(),
                completed: '',
                relatedProjects: [],
                notes: '',
                subtopics: subtopics,
                isIndependent: true,
                activeDomains: resolved ? [resolved.primaryDomainId, ...(resolved.secondaryDomainIds || [])] : []
              })
            }
          })
        }}
        onUpdateProjects={(updatedProjs) => {
          setProjectState(prev => prev.map(p => updatedProjs.find(u => u.id === p.id) || p))
        }}
        onAddEvidences={(evidences) => { 
          console.log(`[XP Pipeline] onAddEvidences called with ${evidences.length} evidences`);
          const uniqueSkillNames = Array.from(new Set(evidences.map(e => e.skill)));
          console.log(`[XP Pipeline] Unique skills to process:`, uniqueSkillNames);
          
          setProgression((p) => {
             let finalXpToAward = 0;
             const newClaims: string[] = [];
             
             uniqueSkillNames.forEach(skillName => {
                let existing = skillState.find(s => s.canonicalName === skillName || s.name.toLowerCase() === skillName.toLowerCase());
                let subtopics = existing?.subtopics;
                
                if (!subtopics || subtopics.length === 0) {
                   const resolved = resolveSkill(skillName);
                   if (resolved) subtopics = generateSubtopicsForSkill(resolved);
                }
                
                if (!subtopics || subtopics.length === 0) return;
                
                const skillEvidences = evidences.filter(ev => ev.skill === skillName || (ev.skill && ev.skill.toLowerCase() === skillName.toLowerCase()));
                const completedThisRun = new Set<string>();
                
                skillEvidences.forEach(ev => {
                   const st = subtopics!.find(t => t.title === ev.subtopic);
                   if (st) {
                      const rewardKey = `subtopic_${st.id}`;
                      const alreadyClaimed = p.claimedRewards?.includes(rewardKey);
                      
                      console.log(`[XP Pipeline] Matched evidence '${ev.subtopic}' -> Subtopic '${st.title}' (status: ${st.status}, claimed: ${alreadyClaimed})`);
                      
                      // Even if the UI shows it as 'Learning', we trust claimedRewards.
                      if (st.status !== 'Completed' && !completedThisRun.has(st.id) && !alreadyClaimed) {
                         completedThisRun.add(st.id);
                         const baseXP = st.baseXP || 88;
                         const prime = Math.floor(baseXP * 2.5);
                         const focused = Math.floor(baseXP * 1.75);
                         const extended = Math.floor(baseXP * 1.0);
                         const averageXp = Math.floor((prime + focused + extended) / 3);
                         
                         finalXpToAward += averageXp;
                         newClaims.push(rewardKey);
                         console.log(`[XP Pipeline] Awarding +${averageXp} XP for completing '${st.title}'`);
                      }
                   } else {
                      console.log(`[XP Pipeline] WARNING: Evidence subtopic '${ev.subtopic}' did NOT match any existing subtopic in skill '${skillName}'`);
                   }
                });
             });
             
             if (finalXpToAward > 0) {
                 console.log(`[XP Pipeline] Total XP to award: +${finalXpToAward}`);
                 setTimeout(() => {
                     push(`Auto-completed subtopics! +${finalXpToAward} XP`, 'xp');
                     playSoundEffect('unlock', settings.soundEffects);
                 }, 0);
                 return {
                     ...p,
                     xp: p.xp + finalXpToAward,
                     claimedRewards: [...(p.claimedRewards || []), ...newClaims]
                 };
             } else {
                 console.log(`[XP Pipeline] No new XP to award (already completed or no matches).`);
             }
             return p;
          });

          setSkillState(prev => {
             let nextState = [...prev];
             uniqueSkillNames.forEach(skillName => {
                let existingIdx = nextState.findIndex(s => s.canonicalName === skillName || s.name.toLowerCase() === skillName.toLowerCase());
                
                let skill: Skill;
                if (existingIdx !== -1) {
                   skill = { ...nextState[existingIdx] };
                   
                   if (!skill.subtopics || skill.subtopics.length === 0) {
                      const resolved = resolveSkill(skillName);
                      if (resolved) {
                         skill.subtopics = generateSubtopicsForSkill(resolved);
                         skill.canonicalName = resolved.canonicalName;
                         if (!skill.activeDomains) skill.activeDomains = [resolved.primaryDomainId];
                         if (skill.isIndependent === undefined) skill.isIndependent = true;
                      }
                   }
                } else {
                   const resolved = resolveSkill(skillName);
                   if (!resolved) return;
                   const subtopics = generateSubtopicsForSkill(resolved);
                   skill = {
                      id: crypto.randomUUID(),
                      name: resolved.canonicalName || skillName,
                      canonicalName: resolved.canonicalName,
                      progress: 0,
                      status: 'LEARNING',
                      started: new Date().toISOString(),
                      completed: '',
                      relatedProjects: [],
                      notes: 'Auto-detected from GitHub',
                      subtopics,
                      isIndependent: true,
                      activeDomains: [resolved.primaryDomainId]
                   };
                   nextState.push(skill);
                   existingIdx = nextState.length - 1;
                }
                
                const skillEvidences = evidences.filter(ev => ev.skill === skill.canonicalName || ev.skill === skill.name || (ev.skill && ev.skill.toLowerCase() === skill.name.toLowerCase()));
                if (skillEvidences.length === 0) {
                   nextState[existingIdx] = skill;
                   return;
                }
                
                const subtopics = skill.subtopics || [];
                const newSubtopics = [...subtopics];
                let newlyCompleted = 0;
                
                skillEvidences.forEach(ev => {
                   const subtopicIdx = newSubtopics.findIndex(st => st.title === ev.subtopic);
                   if (subtopicIdx !== -1) {
                      const st = newSubtopics[subtopicIdx];
                      const hasFingerprint = st.evidence?.some(e => e.fingerprint === ev.fingerprint);
                      
                      if (!hasFingerprint) {
                         const isAlreadyCompleted = st.status === 'Completed';
                         const updatedSt = {
                            ...st,
                            evidence: [...(st.evidence || []), { file: ev.filename, strength: ev.strength, fingerprint: ev.fingerprint }]
                         };
                         
                         if (!isAlreadyCompleted) {
                            updatedSt.status = 'Completed';
                            updatedSt.completionTimeMinutes = 100;
                            newlyCompleted++;
                            console.log(`[XP Pipeline] SkillState: Marked subtopic '${st.title}' as Completed.`);
                         }
                         
                         newSubtopics[subtopicIdx] = updatedSt;
                      }
                   }
                });
                
                const completedCount = newSubtopics.filter(st => st.status === 'Completed').length;
                const totalCount = newSubtopics.length;
                const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                
                const status = progress === 100 ? 'MASTERED' : 'LEARNING';
                
                console.log(`[XP Pipeline] SkillState: Skill '${skill.name}' updated. Newly completed: ${newlyCompleted}. Progress: ${progress}%. Status: ${status}`);
                nextState[existingIdx] = { ...skill, subtopics: newSubtopics, progress, status };
             });
             return nextState;
          });
        }}
        onRemoveGithubData={() => {
           setProjectState(prev => prev.filter(p => p.provider !== 'github'));
           
           setSkillState(prev => prev.map(skill => {
              if (!skill.subtopics) return skill;
              
              const newSubtopics = skill.subtopics.map(st => {
                 if (!st.evidence) return st;
                 const newEvidence = st.evidence.filter(e => !e.fingerprint?.startsWith('github|'));
                 return { ...st, evidence: newEvidence };
              });
              
              // Note: We deliberately do not reset completion status or deduct XP here to prevent
              // punishing the user for manual progress or prior legitimate completions,
              // matching the requirement to preserve unrelated learning data.
              
              return { ...skill, subtopics: newSubtopics };
           }));

           import('./lib/supabase').then(({ supabase }) => {
              if (supabase) {
                 supabase.auth.getUser().then(({ data: { user } }) => {
                    if (user) {
                       supabase.from('external_projects').delete().eq('user_id', user.id).eq('provider', 'github').then(() => {
                          push('GitHub account and imported repositories removed', 'info');
                       });
                    } else {
                       push('GitHub repositories removed locally', 'info');
                    }
                 });
              } else {
                 push('GitHub repositories removed locally', 'info');
              }
           });
        }}
      />


      <UserSearch 
        open={userSearchOpen} 
        onClose={() => setUserSearchOpen(false)} 
        onSelectUser={(userId) => { setViewingUserId(userId); setUserSearchOpen(false) }}
        activeUserId={user?.id}
        friendState={friendState}
        onSendRequest={async (id) => {
          if (id === user?.id) return
          try {
            await sendFriendRequest(id)
            setFriendState((prev: FriendState) => ({ relationships: [...prev.relationships, { userId: id, status: 'pending_outgoing', createdAt: new Date().toISOString() }] }))
            push('Friend request sent!', 'info')
          } catch (err: any) {
            push(err.message || 'Failed to send request.', 'info')
          }
        }}
      />
      <PublicProfileViewer
        userId={viewingUserId}
        activeUserId={user?.id}
        friendState={friendState}
        chatState={chatState}
        onlineUsers={onlineUsers}
        onToggleBlock={(friendId) => {
          setChatState(prev => {
            const blocked = prev.blockedUsers || []
            const newState = { ...prev, blockedUsers: blocked.includes(friendId) ? blocked.filter(id => id !== friendId) : [...blocked, friendId] }
            if (user) saveChatState(user.id, newState)
            return newState
          })
        }}
        onToggleMute={(friendId) => {
          setChatState(prev => {
            const muted = prev.mutedUsers || []
            const newState = { ...prev, mutedUsers: muted.includes(friendId) ? muted.filter(id => id !== friendId) : [...muted, friendId] }
            if (user) saveChatState(user.id, newState)
            return newState
          })
        }}
        onSendRequest={async (id) => {
          if (id === user?.id) return
          try {
            await sendFriendRequest(id)
            setFriendState((prev: FriendState) => {
              if (prev.relationships.find((r) => r.userId === id)) return prev
              return { relationships: [...prev.relationships, { userId: id, status: 'pending_outgoing', createdAt: new Date().toISOString() }] }
            })
            push('Friend request sent!', 'info')
          } catch (err: any) {
            push(err.message || 'Failed to send request.', 'info')
          }
        }}
        onRemoveFriend={async (id) => {
          try {
            await removeFriend(id)
            setFriendState((prev: FriendState) => ({ relationships: prev.relationships.filter((r) => r.userId !== id) }))
            push('Friend removed.', 'info')
          } catch (err: any) {
            push('Failed to remove friend.', 'info')
          }
        }}
        onMessage={(id) => {
          setActiveFriendIdForChat(id)
          navigate({ view: 'chat' })
        }}
        onClose={() => setViewingUserId(null)}
      />
      <Toasts toasts={toasts} onDismiss={dismiss} />
      {dataLoaded && <Celebration xp={progression.xp} />}
      </div>
    </MotionConfig>
  )
}

export default App





