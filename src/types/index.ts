export type SectionId = 'dashboard' | 'profile' | 'projects' | 'learning' | 'goals' | 'achievements' | 'future' | 'friends' | 'chat' | 'career_world' | 'login' | 'settings'

export type SkillStatus = 'LOCKED' | 'LEARNING' | 'MASTERED'
export type GoalStatus = 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type GoalPriority = 'High' | 'Medium' | 'Low'
export type GoalDifficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Extreme'
export type ProjectStatus = 'PLANNING' | 'BUILDING' | 'COMPLETED'
export type BadgeRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
export type ThemeMode = 'dark' | 'light' | 'system' | 'midnight' | 'aurora'
export type NameTier = 'Novice' | 'Adept' | 'Expert' | 'Veteran' | 'Master' | 'Legend' | 'Mythic'

export type TopicSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Very Large'
export type TopicComplexity = 'Simple' | 'Medium' | 'Hard' | 'Very Hard'
export type SubtopicDifficulty = 'Easy' | 'Normal' | 'Hard'
export type SubtopicStatus = 'Not Started' | 'Learning' | 'Completed'

export type SkillType = 'PROGRAMMING_LANGUAGE' | 'COMPUTER_SCIENCE' | 'DSA' | 'DAA' | 'DEVELOPMENT' | 'FRAMEWORK' | 'DATABASE' | 'DEVOPS_CLOUD' | 'AI_ML' | 'LANGUAGE_SPECIFIC' | 'OTHER'

export interface AIRecommendation {
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'
  confidence: number
  reason: string
}

export interface SubtopicProgress {
  id: string
  title: string
  domain?: string
  category?: string
  priority?: GoalPriority
  size?: TopicSize
  complexity: TopicComplexity
  baseTime?: number
  baseXP?: number
  status: SubtopicStatus
  difficulty?: SubtopicDifficulty
  estimatedTime?: number
  xpReward?: number
  startedAt?: string
  completedAt?: string
  completionTimeMinutes?: number
  aiRecommendation?: AIRecommendation
}

export interface UserProfile {
  id?: string
  userId?: string
  username: string
  arinova_id?: string
  displayName: string
  avatar?: string
  bio?: string
  title: string
  introduction: string
  education: string
  focus: string
  technologies: string[]
  github: string
  linkedin: string
  contact: string
  contactPublic: boolean
  level: number
  xp: number
  createdAt?: string
}

export interface Language {
  id: string
  name: string
  icon: string
  xp: number
  level: number
  color: string
}

export interface LanguageSkill {
  id: string
  languageId: string
  name: string
  progress: number
  status: SkillStatus
  started: string
  completed: string
  notes: string
}

export interface Project {
  id: string
  name: string
  description: string
  image: string
  technologies: string[]
  languageId?: string
  status: ProjectStatus
  progress: number
  github: string
  demo: string
  features: string[]
  whatILearned: string[]
  startDate?: string
  completed?: boolean
  completedDate?: string
}

export interface Skill {
  id: string
  name: string
  canonicalName?: string
  type?: SkillType
  progress: number
  status: SkillStatus
  started: string
  completed: string
  relatedProjects: string[]
  notes: string
  subtopics?: SubtopicProgress[]
  isIndependent?: boolean
  activeDomains?: string[]
}

export interface SkillNode {
  id: string
  title: string
  children: SkillNode[]
  skillId?: string
}

export interface Goal {
  id: string
  title: string
  description: string
  category: string
  languageId?: string
  priority: GoalPriority
  targetDate: string
  notificationSent?: boolean
  milestones: string[]
  status: GoalStatus
  notes: string
  completedDate?: string
  createdAt?: string
}

export interface Milestone {
  id: string
  year: string
  title: string
  description: string
  locked: boolean
  category: string
}

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlockCondition: string
  unlocked: boolean
  dateUnlocked?: string
}

export interface Badge {
  id: string
  icon: string
  title: string
  description: string
  rarity: BadgeRarity
  earned: boolean
  dateEarned?: string
  requirement: string
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  category: string
  relatedProject: string
  relatedSkill: string
}

export interface FutureMilestone {
  id: string
  year: string
  title: string
  description: string
  locked: boolean
  category: string
  relatedGoalId?: string
  relatedSkillId?: string
}

export interface XPTransaction {
  id: string
  userId: string
  amount: number
  source: string
  description: string
  timestamp: string
}

export interface Progression {
  xp: number
  level: number
  projectsCompleted: number
  goalsCompleted: number
  skillsMastered: number
  achievements: number
  badges: number
  streak: number
  longestStreak: number
  lastActiveDate?: string
  knowledgeChecksCompleted?: number
  knowledgeChecksPassed?: number
  perfectScores?: number
  codingChallengesCompleted?: number
  codingChallengesPassed?: number
}

export type MilestoneCategory = 'All' | 'Learning' | 'Coding' | 'Knowledge' | 'XP' | 'Streak' | 'Exploration' | 'Special'

export interface DynamicMilestone {
  id: string
  title: string
  description: string
  category: MilestoneCategory
  icon: string
  targetValue: number
  progressValue: number
  isUnlocked: boolean
  dateUnlocked?: string
  xpReward?: number
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond' | 'mythic'
}

export interface Settings {
  animationIntensity: 'low' | 'medium' | 'high'
  reducedMotion: boolean
  soundEffects: boolean
  theme: ThemeMode
  streakTracking: boolean
  onboarded?: boolean
  activePathways?: string[]
}

export interface FriendRelationship {
  userId: string
  status: 'pending_outgoing' | 'pending_incoming' | 'accepted'
  createdAt: string
}

export interface FriendState {
  relationships: FriendRelationship[]
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  deleted?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  lastRead: Record<string, string> // friendId -> timestamp
}



export type Route = { view: SectionId } | { view: 'project_detail', id: string } | { view: 'skill_detail', id: string } | { view: 'achievement_detail', id: string } | { view: 'badge_detail', id: string };

export interface PathwayDefinition {
  id: string
  name: string
  description: string
  aliases: string[]
  canonicalName?: string
}

export interface ActiveSessionState {
  skillId: string
  subtopic: SubtopicProgress
  baselineTime: number // in minutes (total)
  teachingMinutes?: number
  solvingBaselineMinutes?: number
  startTime: number // timestamp
  totalPausedSeconds: number
  lastPauseTime: number | null
  isActive: boolean
}
