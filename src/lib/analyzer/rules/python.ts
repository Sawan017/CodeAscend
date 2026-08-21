import type { TechnologyDetector } from '../types'

export const pythonDetector: TechnologyDetector = {
  name: 'Python',
  extensions: ['.py'],
  // Strip Python single line comments '#' and docstrings ''' or """
  stripComments: (content: string) => content.replace(/(?:'''[\s\S]*?'''|"""[\s\S]*?""")|#.*/g, ''),
  rules: [
    { topic: 'Syntax & Types', subtopic: 'Variables', pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\s*=[^=]/g },
    { topic: 'Syntax & Types', subtopic: 'Strings', pattern: /["'].*?["']/g },
    { topic: 'Syntax & Types', subtopic: 'Booleans', pattern: /\b(?:True|False)\b/g },
    { topic: 'Syntax & Types', subtopic: 'Type Hinting', pattern: /\bdef\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*:\s*[a-zA-Z_]+/g }, // basic type hints in def
    { topic: 'Functions', subtopic: 'Decorators', pattern: /@[a-zA-Z_][a-zA-Z0-9_.]*\s*\n\s*def\s+/g }
  ]
}
