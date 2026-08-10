import type { TopicComplexity, SubtopicProgress } from '../types'

export const SUBTOPIC_CONFIG = {
  Simple: {
    baseTime: 20,
    times: { Easy: 30, Normal: 20, Hard: 15 },
    xp: { Easy: 20, Normal: 30, Hard: 40 }
  },
  Medium: {
    baseTime: 30,
    times: { Easy: 45, Normal: 30, Hard: 20 },
    xp: { Easy: 35, Normal: 50, Hard: 65 }
  },
  Hard: {
    baseTime: 60,
    times: { Easy: 90, Normal: 60, Hard: 40 },
    xp: { Easy: 60, Normal: 80, Hard: 105 }
  },
  'Very Hard': {
    baseTime: 90,
    times: { Easy: 120, Normal: 90, Hard: 60 },
    xp: { Easy: 90, Normal: 120, Hard: 160 }
  }
}

const generateId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, '-')

const predefinedMappings: Record<string, { title: string; complexity: TopicComplexity }[]> = {
  javascript: [
    { title: 'Variables & Data Types', complexity: 'Simple' },
    { title: 'Functions', complexity: 'Medium' },
    { title: 'Arrays & Objects', complexity: 'Medium' },
    { title: 'DOM Manipulation', complexity: 'Medium' },
    { title: 'Events', complexity: 'Simple' },
    { title: 'Promises', complexity: 'Hard' },
    { title: 'Async/Await', complexity: 'Medium' },
    { title: 'Modules', complexity: 'Simple' },
    { title: 'Error Handling', complexity: 'Medium' },
    { title: 'Event Loop & Concurrency', complexity: 'Very Hard' }
  ],
  react: [
    { title: 'Components & Props', complexity: 'Simple' },
    { title: 'State & useState', complexity: 'Medium' },
    { title: 'useEffect & Lifecycle', complexity: 'Hard' },
    { title: 'Context API', complexity: 'Medium' },
    { title: 'Routing', complexity: 'Medium' },
    { title: 'Custom Hooks', complexity: 'Hard' },
    { title: 'Performance Optimization', complexity: 'Very Hard' },
    { title: 'State Management (Redux/Zustand)', complexity: 'Very Hard' }
  ],
  python: [
    { title: 'Syntax & Variables', complexity: 'Simple' },
    { title: 'Data Structures (Lists, Dicts, Sets)', complexity: 'Medium' },
    { title: 'Functions & Lambdas', complexity: 'Medium' },
    { title: 'Classes & OOP', complexity: 'Hard' },
    { title: 'File Handling', complexity: 'Medium' },
    { title: 'Exception Handling', complexity: 'Medium' },
    { title: 'Decorators', complexity: 'Hard' },
    { title: 'Generators & Iterators', complexity: 'Very Hard' }
  ],
  backend: [
    { title: 'HTTP & APIs', complexity: 'Simple' },
    { title: 'Routing & Middleware', complexity: 'Medium' },
    { title: 'Database Design', complexity: 'Hard' },
    { title: 'Authentication (JWT/OAuth)', complexity: 'Very Hard' },
    { title: 'WebSockets', complexity: 'Hard' },
    { title: 'Caching (Redis)', complexity: 'Medium' },
    { title: 'Message Queues', complexity: 'Very Hard' }
  ]
}

const fallbackMapping: { title: string; complexity: TopicComplexity }[] = [
  { title: 'Fundamentals & Setup', complexity: 'Simple' },
  { title: 'Core Concepts', complexity: 'Medium' },
  { title: 'Best Practices & Patterns', complexity: 'Medium' },
  { title: 'Advanced Topics', complexity: 'Hard' },
  { title: 'Real-world Architecture', complexity: 'Very Hard' }
]

export const generateSubtopicsForSkill = (skillName: string): SubtopicProgress[] => {
  const normalized = skillName.toLowerCase().trim()
  
  // Find a matching key or use fallback
  const mappingKey = Object.keys(predefinedMappings).find(key => normalized.includes(key))
  const mapping = mappingKey ? predefinedMappings[mappingKey] : fallbackMapping

  return mapping.map((topic) => ({
    id: generateId(topic.title),
    title: topic.title,
    complexity: topic.complexity,
    status: 'Not Started'
  }))
}

export const calculateSkillProgress = (subtopics: SubtopicProgress[]): number => {
  if (!subtopics || subtopics.length === 0) return 0
  
  let earnedPoints = 0
  let totalPoints = 0

  const complexityWeight: Record<TopicComplexity, number> = {
    'Simple': 1,
    'Medium': 2,
    'Hard': 3,
    'Very Hard': 4
  }

  subtopics.forEach(t => {
    const weight = complexityWeight[t.complexity]
    totalPoints += weight
    if (t.status === 'Completed') {
      earnedPoints += weight
    }
  })

  if (totalPoints === 0) return 0
  return Math.round((earnedPoints / totalPoints) * 100)
}
