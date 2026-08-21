import type { TechnologyDetector } from '../types'

export const javaDetector: TechnologyDetector = {
  name: 'Java',
  extensions: ['.java'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'Core Syntax', subtopic: 'Primitives', pattern: /\b(?:int|double|float|char|boolean|byte|short|long)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*;/g },
    { topic: 'Core Syntax', subtopic: 'Strings', pattern: /\bString\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/g },
    { topic: 'Core Syntax', subtopic: 'Arrays', pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\[\]\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*new\b|\bnew\s+[a-zA-Z_][a-zA-Z0-9_]*\[/g },
    { topic: 'Core Syntax', subtopic: 'Methods', pattern: /\b(?:public|private|protected)\s+(?:static\s+)?[a-zA-Z_][a-zA-Z0-9_<>]*\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*\{/g }
  ]
}
