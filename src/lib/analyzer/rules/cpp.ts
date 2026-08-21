import type { TechnologyDetector } from '../types'

export const cppDetector: TechnologyDetector = {
  name: 'C++',
  extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'Core Language', subtopic: 'Types', pattern: /\b(?:int|double|float|char|bool)\s+[a-zA-Z_][a-zA-Z0-9_]*\s*;/g },
    { topic: 'Core Language', subtopic: 'Functions', pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*\{/g },
    { topic: 'Core Language', subtopic: 'Namespaces', pattern: /\bnamespace\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\{|\busing\s+namespace\s+[a-zA-Z_][a-zA-Z0-9_]*;/g },
    { topic: 'Core Language', subtopic: 'Header Files', pattern: /#include\s*[<"][a-zA-Z0-9_.]+[^>"]*[>"]/g }
  ]
}
