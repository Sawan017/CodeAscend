import type { TechnologyDetector } from '../types'

export const nodejsDetector: TechnologyDetector = {
  name: 'Node.js',
  extensions: ['.js', '.ts'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'Core Modules', subtopic: 'fs (File System)', pattern: /\b(?:require\s*\(\s*['"]fs['"]\s*\)|from\s*['"]fs['"])\b/g },
    { topic: 'Core Modules', subtopic: 'path', pattern: /\b(?:require\s*\(\s*['"]path['"]\s*\)|from\s*['"]path['"])\b/g },
    { topic: 'Core Modules', subtopic: 'http', pattern: /\b(?:require\s*\(\s*['"]http['"]\s*\)|from\s*['"]http['"])\b/g },
    { topic: 'Core Modules', subtopic: 'events (Event Emitter)', pattern: /\bEventEmitter\b/g },
    { topic: 'Module Systems', subtopic: 'CommonJS (require)', pattern: /\brequire\s*\(/g },
    { topic: 'Module Systems', subtopic: 'ES Modules (import)', pattern: /\bimport\s+.*?from\s+['"]/g },
  ]
}

export const expressDetector: TechnologyDetector = {
  name: 'Express.js',
  extensions: ['.js', '.ts'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'Routing', subtopic: 'Route Methods', pattern: /\.(?:get|post|put|delete|patch)\s*\(\s*['"]/g },
    { topic: 'Routing', subtopic: 'Express Router', pattern: /\bexpress\.Router\s*\(/g },
    { topic: 'Middleware', subtopic: 'Application-Level', pattern: /\.use\s*\(/g },
    { topic: 'Request & Response', subtopic: 'Status Codes', pattern: /\.status\s*\(\s*[0-9]{3}\s*\)/g },
    { topic: 'Request & Response', subtopic: 'Sending JSON/HTML', pattern: /\.json\s*\(/g },
  ]
}
