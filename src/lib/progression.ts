import type { Achievement, Badge, Goal, NameTier, Progression, Project, Skill } from '../types'

/**
 * XP / Level system
 * Uses a cumulative threshold curve: early levels are fast, later levels
 * take progressively more XP. Level N requires floor(120 * (N-1)^1.6) XP.
 * Level 8 ≈ 3,000 XP. Level 1 = 0 XP.
 */

const XP_BASE = 120
const XP_EXPONENT = 1.6

export const XP_REWARDS = {
  skillPractice: 20,
  skillMastered: 120,
  projectCompleted: 150,
  goalEasy: 150,
  goalMedium: 250,
  goalHard: 400,
  achievement: 60,
  badge: 80,
  challenge: 100,
} as const

export const DIFFICULTY_MULTIPLIER: Record<'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Extreme', number> = {
  Easy: 1,
  Normal: 1.5,
  Hard: 2,
  Expert: 3,
  Extreme: 4.5,
}

/**
 * Level-based name color tiers.
 * LEVEL 1-4: Soft White
 * LEVEL 5-9: Cyan
 * LEVEL 10-19: Electric Blue
 * LEVEL 20-29: Violet
 * LEVEL 30-49: Purple/Gold premium gradient
 * LEVEL 50-74: Rare animated treatment
 * LEVEL 75+: Mythic/Legendary treatment
 */
export function getNameTier(level: number): NameTier {
  if (level >= 75) return 'Mythic'
  if (level >= 50) return 'Legend'
  if (level >= 30) return 'Master'
  if (level >= 20) return 'Veteran'
  if (level >= 10) return 'Expert'
  if (level >= 5) return 'Adept'
  return 'Novice'
}

export function getNameColorClass(level: number): string {
  const tier = getNameTier(level)
  switch (tier) {
    case 'Novice': return 'name-novice'
    case 'Adept': return 'name-adept'
    case 'Expert': return 'name-expert'
    case 'Veteran': return 'name-veteran'
    case 'Master': return 'name-master'
    case 'Legend': return 'name-legend'
    case 'Mythic': return 'name-mythic'
    default: return 'name-novice'
  }
}

/** Returns the total XP required to reach level N. */
function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(XP_BASE * Math.pow(level - 1, XP_EXPONENT))
}

export function calculateLevel(xp: number): number {
  let level = 1
  while (xp >= xpForLevel(level + 1)) level++
  return level
}

export function calculateProgressToNextLevel(xp: number) {
  const level = calculateLevel(xp)
  const currentFloor = xpForLevel(level)
  const nextFloor = xpForLevel(level + 1)
  const progress = nextFloor > currentFloor
    ? ((xp - currentFloor) / (nextFloor - currentFloor)) * 100
    : 100
  return {
    level,
    currentXp: xp,
    requiredXp: nextFloor,
    progress: Math.min(100, Math.max(0, progress)),
  }
}

export function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value))
}

/**
 * Calculates the XP awarded for completing a goal.
 * - Base reward from XP_REWARDS by difficulty.
 * - Early completion (before deadline) earns a 1.5x bonus.
 * - Late completion earns only 50%.
 */
// Goal XP calculation removed as Goals are now pure To-Dos

export function isGoalOverdue(goal: Goal) {
  if (goal.status === 'COMPLETED') return false
  const target = new Date(goal.targetDate).getTime()
  if (Number.isNaN(target)) return false
  return Date.now() > target
}

export function daysUntilDeadline(goal: Goal) {
  const target = new Date(goal.targetDate).getTime()
  if (Number.isNaN(target)) return null
  return Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24))
}

export function computeStreak(currentStreak: number, lastActiveDate?: string) {
  const today = new Date().toISOString().slice(0, 10)
  const todayMs = new Date(today).getTime()
  const lastMs = lastActiveDate ? new Date(lastActiveDate).getTime() : NaN
  const dayMs = 1000 * 60 * 60 * 24

  if (!lastActiveDate || Number.isNaN(lastMs)) {
    return { newStreak: 1, lastDate: today }
  }

  const diffDays = Math.round((todayMs - lastMs) / dayMs)

  if (diffDays === 0) {
    return { newStreak: currentStreak || 1, lastDate: today }
  }

  if (diffDays === 1) {
    return { newStreak: (currentStreak || 0) + 1, lastDate: today }
  }

  return { newStreak: 1, lastDate: today }
}

export function formatDate(iso: string) {
  if (!iso) return 'N/A'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}


/**
 * Checks rules for unlocked badges and achievements based on current progression state.
 */
export function evaluateAchievementsAndBadges(
  progression: Progression,
  goals: Goal[],
  projects: Project[],
  skills: Skill[],
  achievements: Achievement[],
  badges: Badge[]
) {
  const currentLevel = calculateLevel(progression.xp)
  const completedGoalsCount = goals.filter((g) => g.status === 'COMPLETED').length
  const completedProjectsCount = projects.filter((p) => p.completed || p.status === 'COMPLETED').length
  const masteredSkillsCount = skills.filter((s) => s.status === 'MASTERED').length
  const todayStr = new Date().toISOString().slice(0, 10)

  const newUnlockedAchievements: Achievement[] = []
  const newEarnedBadges: Badge[] = []

  const updatedBadges = badges.map((badge) => {
    if (badge.earned) return badge
    let earnedNow = false

    if (badge.id === 'first-step' && completedGoalsCount >= 1) earnedNow = true
    if (badge.id === 'level-5' && currentLevel >= 5) earnedNow = true
    if (badge.id === 'level-10' && currentLevel >= 10) earnedNow = true
    if (badge.id === 'project-master' && completedProjectsCount >= 3) earnedNow = true
    if (badge.id === 'streak-7' && progression.streak >= 7) earnedNow = true

    if (earnedNow) {
      const updated = { ...badge, earned: true, dateEarned: todayStr }
      newEarnedBadges.push(updated)
      return updated
    }
    return badge
  })

  const updatedAchievements = achievements.map((ach) => {
    if (ach.unlocked) return ach
    let unlockedNow = false

    if (ach.id === 'first-website' && completedProjectsCount >= 1) unlockedNow = true
    if (ach.id === 'first-react' && (completedProjectsCount >= 1 || masteredSkillsCount >= 1)) unlockedNow = true
    if (ach.id === 'first-fullstack' && completedProjectsCount >= 2) unlockedNow = true
    if (ach.id === 'portfolio-deployed' && completedProjectsCount >= 1) unlockedNow = true

    if (unlockedNow) {
      const updated = { ...ach, unlocked: true, dateUnlocked: todayStr }
      newUnlockedAchievements.push(updated)
      return updated
    }
    return ach
  })

  return {
    updatedBadges,
    updatedAchievements,
    newEarnedBadges,
    newUnlockedAchievements,
  }
}