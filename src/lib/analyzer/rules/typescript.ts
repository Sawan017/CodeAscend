import type { TechnologyDetector } from '../types'

export const typescriptDetector: TechnologyDetector = {
  name: 'TypeScript',
  extensions: ['.ts', '.tsx'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    // Type System
    { topic: 'Type System', subtopic: 'Primitive Types', pattern: /:\s*(?:string|number|boolean)\b/g },
    { topic: 'Type System', subtopic: 'Arrays & Tuples', pattern: /:\s*[a-zA-Z]+\[\]|:\s*\[[a-zA-Z\s,]+\]/g },
    { topic: 'Type System', subtopic: 'Any & Unknown', pattern: /:\s*(?:any|unknown)\b/g },
    { topic: 'Type System', subtopic: 'Enums', pattern: /\benum\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\{/g },

    // Inherit some basic rules from JS that apply to TS since TS is a superset
    { topic: 'Variables', subtopic: 'Variables (let/const)', pattern: /\b(?:let|const)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(?::|=[^>])/g },
    { topic: 'Functions', subtopic: 'Arrow Functions', pattern: /\(.*?\)\s*(?::\s*[a-zA-Z_]+)?\s*=>\s*\{?/g },
  ]
}
