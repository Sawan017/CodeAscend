import type { DynamicMilestone } from '../types'

// Helper to define milestone template without dynamic progress
export type MilestoneDef = Omit<DynamicMilestone, 'progressValue' | 'isUnlocked'>

export const milestoneDefinitions: MilestoneDef[] = [
  // Learning Milestones (Skills)
  { id: 'm-learn-1', title: 'First Steps', description: 'Master your first skill.', category: 'Learning', icon: 'BookOpen', targetValue: 1, xpReward: 50, tier: 'bronze' },
  { id: 'm-learn-5', title: 'Getting the Hang of It', description: 'Master 5 different skills.', category: 'Learning', icon: 'BookOpen', targetValue: 5, xpReward: 150, tier: 'bronze' },
  { id: 'm-learn-10', title: 'Avid Learner', description: 'Master 10 different skills.', category: 'Learning', icon: 'Library', targetValue: 10, xpReward: 300, tier: 'silver' },
  { id: 'm-learn-25', title: 'Knowledge Sponge', description: 'Master 25 different skills.', category: 'Learning', icon: 'Library', targetValue: 25, xpReward: 1000, tier: 'gold' },
  { id: 'm-learn-50', title: 'Scholar', description: 'Master 50 different skills.', category: 'Learning', icon: 'GraduationCap', targetValue: 50, xpReward: 2500, tier: 'diamond' },
  { id: 'm-learn-100', title: 'Polymath', description: 'Master 100 different skills.', category: 'Learning', icon: 'BrainCircuit', targetValue: 100, xpReward: 5000, tier: 'mythic' },

  // Learning Milestones (Topics)
  { id: 'm-topic-1', title: 'Topic Initiated', description: 'Master your first topic entirely.', category: 'Learning', icon: 'Layers', targetValue: 1, xpReward: 50, tier: 'bronze' },
  { id: 'm-topic-5', title: 'Broad Horizons', description: 'Master 5 different topics.', category: 'Learning', icon: 'Layers', targetValue: 5, xpReward: 200, tier: 'bronze' },
  { id: 'm-topic-10', title: 'Deep Diver', description: 'Master 10 different topics.', category: 'Learning', icon: 'Layers', targetValue: 10, xpReward: 500, tier: 'silver' },
  { id: 'm-topic-25', title: 'Subject Matter Expert', description: 'Master 25 different topics.', category: 'Learning', icon: 'BookMarked', targetValue: 25, xpReward: 1500, tier: 'gold' },
  { id: 'm-topic-50', title: 'Walking Encyclopedia', description: 'Master 50 different topics.', category: 'Learning', icon: 'BookMarked', targetValue: 50, xpReward: 3000, tier: 'diamond' },

  // Knowledge Checks (Completed)
  { id: 'm-kc-1', title: 'First Test', description: 'Complete your first Knowledge Check.', category: 'Knowledge', icon: 'FileText', targetValue: 1, xpReward: 20, tier: 'bronze' },
  { id: 'm-kc-10', title: 'Quiz Taker', description: 'Complete 10 Knowledge Checks.', category: 'Knowledge', icon: 'FileText', targetValue: 10, xpReward: 100, tier: 'bronze' },
  { id: 'm-kc-25', title: 'Knowledge Seeker', description: 'Complete 25 Knowledge Checks.', category: 'Knowledge', icon: 'ClipboardList', targetValue: 25, xpReward: 250, tier: 'silver' },
  { id: 'm-kc-50', title: 'Test Veteran', description: 'Complete 50 Knowledge Checks.', category: 'Knowledge', icon: 'ClipboardList', targetValue: 50, xpReward: 500, tier: 'gold' },
  { id: 'm-kc-100', title: 'Exam Master', description: 'Complete 100 Knowledge Checks.', category: 'Knowledge', icon: 'ClipboardCheck', targetValue: 100, xpReward: 1000, tier: 'diamond' },

  // Knowledge Checks (Passed)
  { id: 'm-kc-pass-1', title: 'Passing Grade', description: 'Pass your first Knowledge Check.', category: 'Knowledge', icon: 'CheckCircle', targetValue: 1, xpReward: 30, tier: 'bronze' },
  { id: 'm-kc-pass-10', title: 'Consistent Performer', description: 'Pass 10 Knowledge Checks.', category: 'Knowledge', icon: 'CheckCircle', targetValue: 10, xpReward: 150, tier: 'silver' },
  { id: 'm-kc-pass-25', title: 'High Achiever', description: 'Pass 25 Knowledge Checks.', category: 'Knowledge', icon: 'CheckSquare', targetValue: 25, xpReward: 400, tier: 'gold' },
  { id: 'm-kc-pass-50', title: 'A-Student', description: 'Pass 50 Knowledge Checks.', category: 'Knowledge', icon: 'CheckSquare', targetValue: 50, xpReward: 1000, tier: 'diamond' },
  
  // Knowledge Checks (Perfect Scores)
  { id: 'm-kc-perf-1', title: 'Flawless', description: 'Get a perfect 100 on a Knowledge Check.', category: 'Knowledge', icon: 'Target', targetValue: 1, xpReward: 100, tier: 'silver' },
  { id: 'm-kc-perf-5', title: 'Sharpshooter', description: 'Get 5 perfect scores on Knowledge Checks.', category: 'Knowledge', icon: 'Target', targetValue: 5, xpReward: 300, tier: 'gold' },
  { id: 'm-kc-perf-10', title: 'Unstoppable Mind', description: 'Get 10 perfect scores on Knowledge Checks.', category: 'Knowledge', icon: 'Bullseye', targetValue: 10, xpReward: 750, tier: 'diamond' },
  { id: 'm-kc-perf-25', title: 'Omniscient', description: 'Get 25 perfect scores on Knowledge Checks.', category: 'Knowledge', icon: 'Bullseye', targetValue: 25, xpReward: 2000, tier: 'mythic' },

  // Coding (Completed)
  { id: 'm-code-1', title: 'Hello World', description: 'Attempt your first coding challenge.', category: 'Coding', icon: 'Code', targetValue: 1, xpReward: 20, tier: 'bronze' },
  { id: 'm-code-10', title: 'Keyboard Warrior', description: 'Attempt 10 coding challenges.', category: 'Coding', icon: 'Code', targetValue: 10, xpReward: 100, tier: 'bronze' },
  { id: 'm-code-25', title: 'Coder in Training', description: 'Attempt 25 coding challenges.', category: 'Coding', icon: 'Terminal', targetValue: 25, xpReward: 300, tier: 'silver' },
  { id: 'm-code-50', title: 'Hacker', description: 'Attempt 50 coding challenges.', category: 'Coding', icon: 'Terminal', targetValue: 50, xpReward: 600, tier: 'gold' },
  { id: 'm-code-100', title: 'Code Monkey', description: 'Attempt 100 coding challenges.', category: 'Coding', icon: 'TerminalSquare', targetValue: 100, xpReward: 1500, tier: 'diamond' },

  // Coding (Passed)
  { id: 'm-code-pass-1', title: 'It Compiles!', description: 'Pass your first coding challenge successfully.', category: 'Coding', icon: 'Laptop', targetValue: 1, xpReward: 50, tier: 'bronze' },
  { id: 'm-code-pass-10', title: 'Bug Squasher', description: 'Pass 10 coding challenges.', category: 'Coding', icon: 'Laptop', targetValue: 10, xpReward: 200, tier: 'silver' },
  { id: 'm-code-pass-25', title: 'Logic Master', description: 'Pass 25 coding challenges.', category: 'Coding', icon: 'MonitorCheck', targetValue: 25, xpReward: 500, tier: 'gold' },
  { id: 'm-code-pass-50', title: 'Software Engineer', description: 'Pass 50 coding challenges.', category: 'Coding', icon: 'MonitorCheck', targetValue: 50, xpReward: 1200, tier: 'diamond' },
  { id: 'm-code-pass-100', title: 'Architect', description: 'Pass 100 coding challenges.', category: 'Coding', icon: 'Server', targetValue: 100, xpReward: 3000, tier: 'mythic' },

  // XP Accumulation
  { id: 'm-xp-1', title: 'The Beginning', description: 'Started Arinova journey.', category: 'XP', icon: 'Sparkles', targetValue: 1, xpReward: 500, tier: 'bronze' },
  { id: 'm-xp-1k', title: 'Rising Star', description: 'Accumulate 1,000 XP.', category: 'XP', icon: 'Sparkles', targetValue: 1000, xpReward: 100, tier: 'bronze' },
  { id: 'm-xp-5k', title: 'Dedicated', description: 'Accumulate 5,000 XP.', category: 'XP', icon: 'Star', targetValue: 5000, xpReward: 500, tier: 'silver' },
  { id: 'm-xp-10k', title: 'High Roller', description: 'Accumulate 10,000 XP.', category: 'XP', icon: 'Star', targetValue: 10000, xpReward: 1000, tier: 'gold' },
  { id: 'm-xp-25k', title: 'Power User', description: 'Accumulate 25,000 XP.', category: 'XP', icon: 'Zap', targetValue: 25000, xpReward: 2000, tier: 'diamond' },
  { id: 'm-xp-50k', title: 'Ascended', description: 'Accumulate 50,000 XP.', category: 'XP', icon: 'Zap', targetValue: 50000, xpReward: 4000, tier: 'diamond' },
  { id: 'm-xp-100k', title: 'Legendary', description: 'Accumulate 100,000 XP.', category: 'XP', icon: 'Crown', targetValue: 100000, xpReward: 10000, tier: 'mythic' },

  // Level Progression
  { id: 'm-lvl-5', title: 'Novice', description: 'Reach Level 5.', category: 'XP', icon: 'ChevronUp', targetValue: 5, xpReward: 150, tier: 'bronze' },
  { id: 'm-lvl-10', title: 'Adept', description: 'Reach Level 10.', category: 'XP', icon: 'ChevronUp', targetValue: 10, xpReward: 300, tier: 'silver' },
  { id: 'm-lvl-25', title: 'Expert', description: 'Reach Level 25.', category: 'XP', icon: 'ChevronsUp', targetValue: 25, xpReward: 1000, tier: 'gold' },
  { id: 'm-lvl-50', title: 'Master', description: 'Reach Level 50.', category: 'XP', icon: 'ChevronsUp', targetValue: 50, xpReward: 2500, tier: 'diamond' },
  { id: 'm-lvl-100', title: 'Grandmaster', description: 'Reach Level 100.', category: 'XP', icon: 'Mountain', targetValue: 100, xpReward: 5000, tier: 'mythic' },

  // Streaks
  { id: 'm-streak-3', title: 'Warming Up', description: 'Maintain a 3-day learning streak.', category: 'Streak', icon: 'Flame', targetValue: 3, xpReward: 50, tier: 'bronze' },
  { id: 'm-streak-7', title: 'On Fire', description: 'Maintain a 7-day learning streak.', category: 'Streak', icon: 'Flame', targetValue: 7, xpReward: 150, tier: 'bronze' },
  { id: 'm-streak-14', title: 'Unbreakable', description: 'Maintain a 14-day learning streak.', category: 'Streak', icon: 'Flame', targetValue: 14, xpReward: 300, tier: 'silver' },
  { id: 'm-streak-30', title: 'Monthly Devotion', description: 'Maintain a 30-day learning streak.', category: 'Streak', icon: 'CalendarDays', targetValue: 30, xpReward: 1000, tier: 'gold' },
  { id: 'm-streak-60', title: 'Habitual Learner', description: 'Maintain a 60-day learning streak.', category: 'Streak', icon: 'CalendarDays', targetValue: 60, xpReward: 2500, tier: 'diamond' },
  { id: 'm-streak-100', title: 'Century Club', description: 'Maintain a 100-day learning streak.', category: 'Streak', icon: 'CalendarClock', targetValue: 100, xpReward: 5000, tier: 'mythic' },
  { id: 'm-streak-365', title: 'A Year of Code', description: 'Maintain a 365-day learning streak.', category: 'Streak', icon: 'Infinity', targetValue: 365, xpReward: 25000, tier: 'mythic' },

  // Exploration
  { id: 'm-explore-1', title: 'Curious Mind', description: 'Start your first topic.', category: 'Exploration', icon: 'Compass', targetValue: 1, xpReward: 20, tier: 'bronze' },
  { id: 'm-explore-10', title: 'Explorer', description: 'Start 10 different topics.', category: 'Exploration', icon: 'Compass', targetValue: 10, xpReward: 150, tier: 'silver' },
  { id: 'm-explore-25', title: 'Wanderer', description: 'Start 25 different topics.', category: 'Exploration', icon: 'Map', targetValue: 25, xpReward: 400, tier: 'gold' },
  { id: 'm-explore-50', title: 'Pioneer', description: 'Start 50 different topics.', category: 'Exploration', icon: 'Map', targetValue: 50, xpReward: 1000, tier: 'diamond' },

  // Special Combinations (computed logic)
  { id: 'm-spec-1', title: 'Consistency King', description: 'Achieve a 14-day streak and 1,000 XP.', category: 'Special', icon: 'Trophy', targetValue: 1, xpReward: 500, tier: 'gold' },
  { id: 'm-spec-2', title: 'All-Rounder', description: 'Master 10 skills and pass 10 coding challenges.', category: 'Special', icon: 'Hexagon', targetValue: 1, xpReward: 1000, tier: 'diamond' },
  { id: 'm-spec-3', title: 'Perfectionist', description: 'Achieve 10 perfect scores and master 5 topics.', category: 'Special', icon: 'Medal', targetValue: 1, xpReward: 2000, tier: 'mythic' }
]
