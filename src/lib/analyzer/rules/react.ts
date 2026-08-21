import type { TechnologyDetector } from '../types'

export const reactDetector: TechnologyDetector = {
  name: 'React',
  extensions: ['.jsx', '.tsx', '.js', '.ts'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'State & Effects', subtopic: 'useState', pattern: /\buseState\s*\(/g },
    { topic: 'State & Effects', subtopic: 'useEffect', pattern: /\buseEffect\s*\(/g },
    { topic: 'Advanced Hooks', subtopic: 'useContext', pattern: /\buseContext\s*\(/g },
    { topic: 'Advanced Hooks', subtopic: 'useReducer', pattern: /\buseReducer\s*\(/g },
    { topic: 'Advanced Hooks', subtopic: 'useRef', pattern: /\buseRef\s*\(/g },
    { topic: 'Advanced Hooks', subtopic: 'useMemo', pattern: /\buseMemo\s*\(/g },
    { topic: 'Advanced Hooks', subtopic: 'useCallback', pattern: /\buseCallback\s*\(/g },
    { topic: 'Component Architecture', subtopic: 'JSX Syntax', pattern: /<\s*[A-Z][a-zA-Z0-9]*[^>]*>/g },
  ]
}
