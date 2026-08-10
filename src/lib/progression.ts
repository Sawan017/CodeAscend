import type { Goal, NameTier } from '../types'

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
export function calculateGoalXp(goal: Goal, completedDate: string) {
  const base = goal.xpReward ?? XP_REWARDS.goalMedium
  const multiplier = DIFFICULTY_MULTIPLIER[goal.difficulty ?? 'Normal']
  const deadline = new Date(goal.deadline).getTime()
  const complete = new Date(completedDate).getTime()
  if (Number.isNaN(deadline)) return Math.round(base * multiplier)
  if (complete <= deadline) return Math.round(base * multiplier * 1.5)
  return Math.round(base * multiplier * 0.5)
}

export function isGoalOverdue(goal: Goal) {
  if (goal.status === 'COMPLETED') return false
  const deadline = new Date(goal.deadline).getTime()
  if (Number.isNaN(deadline)) return false
  return Date.now() > deadline
}

export function daysUntilDeadline(goal: Goal) {
  const deadline = new Date(goal.deadline).getTime()
  if (Number.isNaN(deadline)) return null
  return Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24))
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