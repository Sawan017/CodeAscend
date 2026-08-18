import type {
  Achievement,
  Badge,
  Goal,
  Milestone,
  Project,
  Progression,
  Skill,
  SkillNode,
  TimelineEvent,
  UserProfile,
  FutureMilestone,
} from '../types'

export const profile: UserProfile = {
  username: 'player',
  displayName: 'Player',
  avatar: '',
  bio: 'Building skills. Building projects. Building my future.',
  title: 'CSE Student & Developer',
  introduction:
    'I am building a career through focused practice, ambitious projects, and a deep curiosity for systems that matter.',
  education: 'Computer Science student shaping a strong foundation in software engineering and product thinking.',
  focus: 'Frontend craft, modern web architecture, and practical AI-assisted development.',
  technologies: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'Python'],
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  contact: 'hello@futureme.dev',
  contactPublic: false,
  level: 8,
  xp: 3000,
}



export const projects: Project[] = []

export const skills: Skill[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    progress: 84,
    status: 'MASTERED',
    started: '2024-01-12',
    completed: '2025-02-10',
    relatedProjects: ['futureme'],
    notes: 'Comfortable with syntax, DOM, async flows, and practical debugging.',
  },
  {
    id: 'react',
    name: 'React',
    progress: 76,
    status: 'LEARNING',
    started: '2025-03-01',
    completed: '',
    relatedProjects: ['futureme', 'command-center'],
    notes: 'Building strong component patterns and modern UI systems.',
  },
  {
    id: 'backend',
    name: 'Backend',
    progress: 41,
    status: 'LEARNING',
    started: '2025-05-18',
    completed: '',
    relatedProjects: ['command-center'],
    notes: 'Exploring APIs, databases, and robust server-side structure.',
  },
  {
    id: 'ai-ml',
    name: 'AI / ML',
    progress: 28,
    status: 'LEARNING',
    started: '2025-07-04',
    completed: '',
    relatedProjects: ['ai-studio'],
    notes: 'Studying practical models, data flow, and experimentation loops.',
  },
]

export const skillTree: SkillNode[] = [
  {
    id: 'javascript-root',
    title: 'JavaScript',
    skillId: 'javascript',
    children: [
      { id: 'dom', title: 'DOM', children: [] },
      { id: 'events', title: 'Events', children: [] },
      { id: 'async', title: 'Async JS', children: [] },
      { id: 'modules', title: 'Modules', children: [] },
    ],
  },
  {
    id: 'react-root',
    title: 'React',
    skillId: 'react',
    children: [
      { id: 'components', title: 'Components', children: [] },
      { id: 'props', title: 'Props', children: [] },
      { id: 'hooks', title: 'Hooks', children: [] },
      { id: 'state', title: 'State', children: [] },
    ],
  },
  {
    id: 'backend-root',
    title: 'Backend',
    skillId: 'backend',
    children: [
      { id: 'node', title: 'Node.js', children: [] },
      { id: 'apis', title: 'APIs', children: [] },
      { id: 'database', title: 'Databases', children: [] },
    ],
  },
  {
    id: 'ai-root',
    title: 'AI / ML',
    skillId: 'ai-ml',
    children: [
      { id: 'python', title: 'Python', children: [] },
      { id: 'numpy', title: 'NumPy', children: [] },
      { id: 'pandas', title: 'Pandas', children: [] },
    ],
  },
]

export const goals: Goal[] = [
  {
    id: 'react-comfort',
    title: 'Become comfortable with React',
    description: 'Build fluent component thinking and ship a polished interface from idea to execution.',
    category: 'Learning',
    languageId: 'react',
    priority: 'High',
    targetDate: '2026-11-01',
    milestones: ['Finish a real component system', 'Ship a polished UI', 'Refactor with reusable patterns'],
    status: 'IN_PROGRESS',
    notes: 'Most progress comes from consistent UI iteration and design decisions.',
  },
  {
    id: 'five-projects',
    title: 'Build 5 serious projects',
    description: 'Create projects that reflect depth, polish, and real problem solving.',
    category: 'Projects',
    languageId: 'typescript',
    priority: 'High',
    targetDate: '2027-03-01',
    milestones: ['Build one full-stack app', 'Ship one AI-assisted tool', 'Publish one polished landing experience'],
    status: 'ACTIVE',
    notes: 'The portfolio is becoming a living archive rather than a static summary.',
  },
  {
    id: 'internship',
    title: 'Get an internship',
    description: 'Prepare a practical story, application system, and visible proof of impact.',
    category: 'Career',
    languageId: 'backend',
    priority: 'High',
    targetDate: '2027-01-01',
    milestones: ['Polish projects', 'Improve GitHub presence', 'Start targeted applications'],
    status: 'ACTIVE',
    notes: 'Networking and clear outcomes matter as much as raw skill.',
  },
]

export const badges: Badge[] = [
  {
    id: 'first-step',
    icon: '🟢',
    title: 'FIRST STEP',
    description: 'Completed your first goal.',
    rarity: 'Common',
    earned: true,
    dateEarned: '2025-10-10',
    requirement: 'Complete your first goal',
  },
  {
    id: 'level-5',
    icon: '🔷',
    title: 'LEVEL 5',
    description: 'Reached level 5.',
    rarity: 'Uncommon',
    earned: true,
    dateEarned: '2026-01-15',
    requirement: 'Reach level 5',
  },
  {
    id: 'level-10',
    icon: '💎',
    title: 'LEVEL 10',
    description: 'Reached level 10.',
    rarity: 'Rare',
    earned: false,
    requirement: 'Reach level 10',
  },
  {
    id: 'project-master',
    icon: '🛠️',
    title: 'PROJECT MASTER',
    description: 'Completed 3 projects.',
    rarity: 'Epic',
    earned: false,
    requirement: 'Complete 3 projects',
  },
  {
    id: 'streak-7',
    icon: '🔥',
    title: '7-DAY STREAK',
    description: 'Maintained a 7-day activity streak.',
    rarity: 'Uncommon',
    earned: false,
    requirement: 'Maintain a 7-day streak',
  },
]

export const achievements: Achievement[] = [
  {
    id: 'journey-begins',
    icon: '✨',
    title: 'Journey Begins',
    description: 'Your journey starts here. Create your account and take your first step toward mastery.',
    unlockCondition: 'Create your account',
    unlocked: false,
    xpReward: 500,
  },
  {
    id: 'first-website',
    icon: '◉',
    title: 'FIRST WEBSITE',
    description: 'Built a first polished digital experience that felt real.',
    unlockCondition: 'Complete your first shipped web experience',
    unlocked: false,
  },
  {
    id: 'first-react',
    icon: '✦',
    title: 'FIRST REACT PROJECT',
    description: 'Turned component thinking into a working interface.',
    unlockCondition: 'Complete a React-based project',
    unlocked: false,
  },
  {
    id: 'first-fullstack',
    icon: '⬢',
    title: 'FIRST FULL-STACK PROJECT',
    description: 'Connected a frontend and backend into a real product flow.',
    unlockCondition: 'Finish a full-stack build',
    unlocked: false,
  },
  {
    id: 'portfolio-deployed',
    icon: '⬡',
    title: 'PORTFOLIO DEPLOYED',
    description: 'Took the work from local files to a live public experience.',
    unlockCondition: 'Deploy a public version',
    unlocked: false,
  },
]

export const milestones: Milestone[] = [
  { id: 'm-2026', year: '2026', title: 'Build React fluency', description: 'Move from tutorials into serious UI systems.', locked: false, category: 'Learning' },
  { id: 'm-2027', year: '2027', title: 'Become full-stack', description: 'Bridge client-side craft with backend confidence.', locked: true, category: 'Career' },
  { id: 'm-2028', year: '2028', title: 'Launch a major product', description: 'Create something that solves a real-world problem.', locked: true, category: 'Build' },
]

export const futureMilestones: FutureMilestone[] = [
  { id: 'fm-2026', year: '2026', title: 'Build React fluency', description: 'Move from tutorials into serious UI systems.', locked: false, category: 'Learning', relatedSkillId: 'react' },
  { id: 'fm-2027', year: '2027', title: 'Become full-stack', description: 'Bridge client-side craft with backend confidence.', locked: true, category: 'Career', relatedGoalId: 'five-projects' },
  { id: 'fm-2028', year: '2028', title: 'Launch a major product', description: 'Create something that solves a real-world problem.', locked: true, category: 'Build', relatedGoalId: 'internship' },
]

export const timelineEvents: TimelineEvent[] = [
  { id: 't-1', date: '2024', title: 'Started JavaScript', description: 'Built confidence through practice and problem solving.', category: 'Learning', relatedSkill: 'JavaScript' },
  { id: 't-2', date: '2025', title: 'Built first serious project', description: 'Shifted from exercises to product-minded builds.', category: 'Project', relatedProject: 'command-center', relatedSkill: 'React' },
  { id: 't-3', date: '2025', title: 'Learned React', description: 'Moved into component-based thinking and UI systems.', category: 'Learning', relatedSkill: 'React' },
  { id: 't-5', date: '2026', title: 'Exploring backend', description: 'Started connecting interfaces to durable systems.', category: 'Learning', relatedProject: 'command-center', relatedSkill: 'Backend' },
  { id: 't-6', date: '2027', title: 'Internship', description: 'A major step toward real professional impact.', category: 'Career', relatedProject: 'ai-studio', relatedSkill: 'AI / ML' },
]

export const initialProgression: Progression = {
  xp: 3000,
  level: 8,
  projectsCompleted: 1,
  goalsCompleted: 0,
  skillsMastered: 1,
  achievements: 1,
  badges: 2,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: undefined,
}
