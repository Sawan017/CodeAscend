import type { Achievement, Badge, Goal, Progression, Project, Settings, Skill, UserProfile } from '../types'

const STORAGE_KEYS = {
  progression: 'futureme-progression',
  goals: 'futureme-goals',
  skills: 'futureme-skills',
  projects: 'futureme-projects',
  achievements: 'futureme-achievements',
  badges: 'futureme-badges',
  settings: 'futureme-settings',
  profile: 'futureme-profile',
  friends: 'futureme-friends',
  chat: 'futureme-chat',
  activeSession: 'futureme-activesession',
}

export function loadProgression<T>(fallback: T, key: keyof typeof STORAGE_KEYS): T {
  if (typeof window === 'undefined') return fallback
  const serialized = window.localStorage.getItem(STORAGE_KEYS[key])
  if (!serialized) return fallback
  try {
    return JSON.parse(serialized) as T
  } catch {
    return fallback
  }
}

export function saveProgression<T>(value: T, key: keyof typeof STORAGE_KEYS) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
}

import { resolveSkill } from '../data/learningData'

export function loadInitialState() {
  return {
    progression: loadProgression<Progression>({ xp: 0, level: 1, projectsCompleted: 0, goalsCompleted: 0, skillsMastered: 0, achievements: 0, badges: 0, streak: 0, longestStreak: 0, lastActiveDate: undefined, knowledgeChecksCompleted: 0, knowledgeChecksPassed: 0, perfectScores: 0, codingChallengesCompleted: 0, codingChallengesPassed: 0 }, 'progression'),
    goals: loadProgression<Goal[]>([], 'goals'),
    skills: (() => {
      const loaded = loadProgression<Skill[]>([], 'skills')
      let changed = false
      const migrated = loaded.map(skill => {
        let cleanName = skill.name
        if (cleanName.toUpperCase().endsWith(' LEARNING')) {
          cleanName = cleanName.substring(0, cleanName.length - 9).trim()
          changed = true
        } else if (cleanName.toUpperCase().endsWith('LEARNING')) {
          cleanName = cleanName.substring(0, cleanName.length - 8).trim()
          changed = true
        }
        if (!skill.canonicalName || changed) {
          const resolved = resolveSkill(cleanName)
          changed = true
          if (!('curriculum' in resolved)) {
            return skill
          }
          return { ...skill, name: resolved.canonicalName, canonicalName: resolved.canonicalName, type: resolved.type, id: resolved.id }
        }
        return skill
      })
      if (changed && typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(migrated))
      return migrated
    })(),
    projects: loadProgression<Project[]>([], 'projects'),
    achievements: loadProgression<Achievement[]>([], 'achievements'),
    badges: loadProgression<Badge[]>([], 'badges'),
    settings: loadProgression<Settings>({ animationIntensity: 'high', reducedMotion: false, soundEffects: false, theme: 'dark', streakTracking: true, onboarded: false }, 'settings'),
    profile: loadProgression<UserProfile>({ username: 'player', displayName: 'Player', avatar: '', bio: '', title: 'Developer', introduction: 'Building skills. Building projects. Building my future.', education: 'Computer Science student', focus: 'Frontend craft and product thinking', technologies: ['TypeScript', 'React'], github: 'https://github.com', linkedin: 'https://linkedin.com', contact: 'hello@futureme.dev', contactPublic: false, level: 1, xp: 0 }, 'profile'),
    friends: loadProgression<import('../types').FriendState>({ relationships: [] }, 'friends'),
    chat: loadProgression<import('../types').ChatState>({ messages: [], lastRead: {} }, 'chat'),
    activeSession: loadProgression<import('../types').ActiveSessionState | null>(null, 'activeSession'),
  }
}

export function getEmptyState() {
  return {
    progression: { xp: 0, level: 1, projectsCompleted: 0, goalsCompleted: 0, skillsMastered: 0, achievements: 0, badges: 0, streak: 0, longestStreak: 0, lastActiveDate: undefined, knowledgeChecksCompleted: 0, knowledgeChecksPassed: 0, perfectScores: 0, codingChallengesCompleted: 0, codingChallengesPassed: 0 } as Progression,
    goals: [] as Goal[],
    skills: [] as Skill[],
    projects: [] as Project[],
    achievements: [] as Achievement[],
    badges: [] as Badge[],
    settings: { animationIntensity: 'high', reducedMotion: false, soundEffects: false, theme: 'dark', streakTracking: true, onboarded: false } as Settings,
    profile: { username: 'player', displayName: 'Player', avatar: '', bio: '', title: 'Developer', introduction: 'Building skills. Building projects. Building my future.', education: 'Computer Science student', focus: 'Frontend craft and product thinking', technologies: ['TypeScript', 'React'], github: 'https://github.com', linkedin: 'https://linkedin.com', contact: 'hello@futureme.dev', contactPublic: false, level: 1, xp: 0 } as UserProfile,
    friends: { relationships: [] } as import('../types').FriendState,
    chat: { messages: [], lastRead: {} } as import('../types').ChatState,
  }
}

export function clearStorage() {
  if (typeof window === 'undefined') return
  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key)
  })
}
