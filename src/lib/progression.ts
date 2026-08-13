import type { Achievement, Badge, Goal, NameTier, Progression, Project, Skill, DynamicMilestone } from '../types'
import { milestoneDefinitions } from '../data/milestoneData'

/**
 * XP / Level system  —  floor(500 * (N-1)^1.6)
 *
 * Calibrated to the actual skill XP economy:
 *   Easy PRIME ≈ 250 XP · Normal PRIME ≈ 771 XP · Hard PRIME ≈ 2150 XP
 *
 * Level curve benchmarks:
 *   L1  → 0 XP       gap +500     (2 Easy-PRIME sessions, or 1 Normal)
 *   L2  → 500 XP     gap +1,015   (~2 Normal-PRIME sessions)
 *   L3  → 1,515 XP   gap +1,384
 *   L5  → 4,594 XP   gap +1,972   (~3 Normal-PRIME sessions)
 *   L10 → 16,817 XP  gap +3,088   (~5 Normal / ~2 Hard-PRIME sessions)
 *   L20 → 55,587 XP  gap +4,754   (~7 Normal / ~3 Hard-PRIME sessions)
 *   L30 → 109,346 XP gap +6,096   (~8 Normal / ~3 Hard-PRIME sessions)
 *   L50 → 253,095 XP gap +8,314   (~11 Normal / ~4 Hard-PRIME sessions)
 *   L75 → 489,486 XP gap +10,626  (~14 Normal / ~5 Hard-PRIME sessions)
 *   L100 → 779,805 XP gap +12,641 (~17 Normal / ~6 Hard-PRIME sessions)
 *
 * L1 = 0 XP. Player XP is preserved — only the level interpretation changes.
 * All downstream functions (calculateLevel, calculateProgressToNextLevel,
 * progress bars, level-up checks) derive from xpForLevel, so this is the
 * only place that needs to change.
 */

const XP_BASE = 500
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

/**
 * Calculates the minimum required learning time before a task's Knowledge Check can be unlocked.
 * It is derived from the existing PRIME limit of the task.
 * Default policy is 35% of the PRIME duration, clamped between 5 minutes and 45 minutes to prevent absurd bounds.
 */
export function calculateMinimumVerificationTime(primeLimitSeconds: number): number {
  const minSeconds = Math.floor(primeLimitSeconds * 0.35);
  // Clamp between 5 minutes and 45 minutes
  return Math.max(5 * 60, Math.min(45 * 60, minSeconds));
}

export function evaluateDynamicMilestones(progression: Progression, skills: Skill[]): DynamicMilestone[] {
  const masteredSkills = skills.filter((s) => s.status === 'MASTERED').length
  const topicsMastered = skills.reduce((total, skill) => {
    if (!skill.subtopics) return total
    const mastered = skill.subtopics.filter(s => s.status === 'Completed').length === skill.subtopics.length && skill.subtopics.length > 0
    return total + (mastered ? 1 : 0)
  }, 0)
  
  const topicsStarted = skills.reduce((total, skill) => {
    if (!skill.subtopics) return total
    const started = skill.subtopics.some(s => s.status !== 'Not Started')
    return total + (started ? 1 : 0)
  }, 0)

  const todayStr = new Date().toISOString().slice(0, 10)

  return milestoneDefinitions.map(def => {
    let progressValue = 0

    // Match definition ID to specific stats
    if (def.id.startsWith('m-learn-')) {
      progressValue = masteredSkills
    } else if (def.id.startsWith('m-topic-')) {
      progressValue = topicsMastered
    } else if (def.id.startsWith('m-kc-perf-')) {
      progressValue = progression.perfectScores || 0
    } else if (def.id.startsWith('m-kc-')) {
      progressValue = progression.knowledgeChecksCompleted || 0
    } else if (def.id.startsWith('m-code-pass-')) {
      progressValue = progression.codingChallengesPassed || 0
    } else if (def.id.startsWith('m-code-')) {
      progressValue = progression.codingChallengesCompleted || 0
    } else if (def.id.startsWith('m-xp-')) {
      progressValue = progression.xp
    } else if (def.id.startsWith('m-lvl-')) {
      progressValue = calculateLevel(progression.xp)
    } else if (def.id.startsWith('m-streak-')) {
      progressValue = progression.longestStreak || progression.streak || 0 // use whichever is highest for milestones
    } else if (def.id.startsWith('m-explore-')) {
      progressValue = topicsStarted
    } else if (def.id === 'm-spec-1') {
      progressValue = (progression.streak >= 14 && progression.xp >= 1000) ? 1 : 0
    } else if (def.id === 'm-spec-2') {
      progressValue = (masteredSkills >= 10 && (progression.codingChallengesPassed || 0) >= 10) ? 1 : 0
    } else if (def.id === 'm-spec-3') {
      progressValue = ((progression.perfectScores || 0) >= 10 && topicsMastered >= 5) ? 1 : 0
    }

    const isUnlocked = progressValue >= def.targetValue

    return {
      ...def,
      progressValue,
      isUnlocked,
      dateUnlocked: isUnlocked ? todayStr : undefined // Ideally read from stored list to not overwrite dates, but this is a purely derived state for now
    }
  })
}