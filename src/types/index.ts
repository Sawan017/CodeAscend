export type SectionId = 'dashboard' | 'profile' | 'projects' | 'learning' | 'goals' | 'achievements' | 'future' | 'friends' | 'chat'

export type SkillStatus = 'LOCKED' | 'LEARNING' | 'MASTERED'
export type GoalStatus = 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type GoalPriority = 'High' | 'Medium' | 'Low'
export type GoalDifficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'Extreme'
export type ProjectStatus = 'PLANNING' | 'BUILDING' | 'COMPLETED'
export type BadgeRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
export type ThemeMode = 'dark' | 'light' | 'system' | 'midnight' | 'aurora'
export type NameTier = 'Novice' | 'Adept' | 'Expert' | 'Veteran' | 'Master' | 'Legend' | 'Mythic'

export interface UserProfile {
  id?: string
  userId?: string
  username: string
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
  progress: number
  status: SkillStatus
  started: string
  completed: string
  relatedProjects: string[]
  notes: string
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
  progress: number
  priority: GoalPriority
  difficulty: GoalDifficulty
  xpReward: number
  deadline: string
  milestones: string[]
  status: GoalStatus
  relatedProject: string
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
}

export interface Settings {
  animationIntensity: 'low' | 'medium' | 'high'
  reducedMotion: boolean
  soundEffects: boolean
  theme: ThemeMode
  streakTracking: boolean
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



export type Route = { view: SectionId } | { view: 'project_detail', id: string } | { view: 'goal_detail', id: string } | { view: 'skill_detail', id: string } | { view: 'achievement_detail', id: string } | { view: 'badge_detail', id: string };
