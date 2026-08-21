import type { TechnologyDetector } from '../types'

export const javascriptDetector: TechnologyDetector = {
  name: 'JavaScript',
  extensions: ['.js', '.jsx'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'Variables', subtopic: 'Variables (let/const)', pattern: /\b(?:let|const)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/g },
    { topic: 'Functions', subtopic: 'Arrow Functions', pattern: /\(.*?\)\s*=>\s*\{?/g },
    { topic: 'Promises', subtopic: 'Promises', pattern: /\bnew\s+Promise\b|\bPromise\.(?:all|race|resolve|reject)\b|\.then\s*\(/g },
    { topic: 'Async/Await', subtopic: 'async/await', pattern: /\basync\s+function\b|\basync\s*\(.*?\)\s*=>|\bawait\s+/g },
    { topic: 'Classes', subtopic: 'Classes', pattern: /\bclass\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(?:extends\s+[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\{/g },
    { topic: 'Modules', subtopic: 'ES Modules (import/export)', pattern: /\bimport\s+.*?from\s+['"]|export\s+(?:default\s+)?(?:const|let|function|class)\b/g },
    { topic: 'Arrays', subtopic: 'Array Methods (map, filter, reduce)', pattern: /\.map\s*\(/g },
    { topic: 'Arrays', subtopic: 'Array Methods (map, filter, reduce)', pattern: /\.filter\s*\(/g },
    { topic: 'Arrays', subtopic: 'Array Methods (map, filter, reduce)', pattern: /\.reduce\s*\(/g },
    { topic: 'DOM', subtopic: 'DOM Manipulation', pattern: /document\.querySelector|document\.getElementById|document\.createElement/g },
    { topic: 'Events', subtopic: 'Event Listeners', pattern: /\.addEventListener\s*\(/g },
    { topic: 'APIs', subtopic: 'Fetch API/XHR', pattern: /\bfetch\s*\(/g }
  ]
}
