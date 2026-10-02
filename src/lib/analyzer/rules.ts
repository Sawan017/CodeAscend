import type { TechnologyDetector } from './types';


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


export const sqlDetector: TechnologyDetector = {
  name: 'SQL',
  extensions: ['.sql'],
  stripComments: (content: string) => content.replace(/--.*|\/\*[\s\S]*?\*\//g, ''),
  rules: [
    { topic: 'Data Querying (DQL)', subtopic: 'SELECT Statements', pattern: /\bSELECT\b/gi },
    { topic: 'Data Querying (DQL)', subtopic: 'Filtering (WHERE, LIKE, IN)', pattern: /\bWHERE\b|\bLIKE\b|\bIN\b/gi },
    { topic: 'Data Manipulation (DML)', subtopic: 'INSERT', pattern: /\bINSERT\s+INTO\b/gi },
    { topic: 'Data Definition (DDL)', subtopic: 'CREATE TABLE', pattern: /\bCREATE\s+TABLE\b/gi },
    { topic: 'Joins & Set Operations', subtopic: 'INNER JOIN', pattern: /\bINNER\s+JOIN\b|\bJOIN\b/gi },
    { topic: 'Joins & Set Operations', subtopic: 'LEFT/RIGHT JOIN', pattern: /\bLEFT\s+(?:OUTER\s+)?JOIN\b|\bRIGHT\s+(?:OUTER\s+)?JOIN\b/gi },
    { topic: 'Aggregations & Grouping', subtopic: 'GROUP BY', pattern: /\bGROUP\s+BY\b/gi },
  ]
}

export const dockerDetector: TechnologyDetector = {
  name: 'Docker',
  extensions: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml'],
  stripComments: (content: string) => content.replace(/#.*/g, ''),
  rules: [
    { topic: 'Image Building', subtopic: 'Dockerfile Instructions (FROM, RUN, CMD, ENTRYPOINT)', pattern: /^(?:FROM|RUN|CMD|ENTRYPOINT|ENV|EXPOSE)\b/gm },
    { topic: 'Docker Compose', subtopic: 'Services', pattern: /^services:/gm },
    { topic: 'Docker Compose', subtopic: 'Networks & Volumes in Compose', pattern: /^(?:networks|volumes):/gm },
  ]
}

export const jestDetector: TechnologyDetector = {
  name: 'Jest',
  extensions: ['.test.js', '.spec.js', '.test.ts', '.spec.ts', '.test.jsx', '.spec.tsx'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''),
  rules: [
    { topic: 'Test Structure', subtopic: 'describe, it, test', pattern: /\b(?:describe|it|test)\s*\(/g },
    { topic: 'Test Structure', subtopic: 'Matchers (expect)', pattern: /\bexpect\s*\(/g },
    { topic: 'Mocking', subtopic: 'Mock Functions (jest.fn)', pattern: /\bjest\.fn\s*\(\)/g },
    { topic: 'Mocking', subtopic: 'Spying (jest.spyOn)', pattern: /\bjest\.spyOn\s*\(/g },
  ]
}

export const pandasDetector: TechnologyDetector = {
  name: 'Pandas',
  extensions: ['.py', '.ipynb'],
  stripComments: (content: string) => content.replace(/(?:'''[\s\S]*?'''|"""[\s\S]*?""")|#.*/g, ''),
  rules: [
    { topic: 'Core Structures', subtopic: 'DataFrames', pattern: /\bpd\.DataFrame\b/g },
    { topic: 'Data I/O', subtopic: 'Reading CSV/Excel/JSON', pattern: /\bpd\.read_(?:csv|excel|json|sql)\b/g },
    { topic: 'Data Manipulation', subtopic: 'Handling Missing Data (dropna, fillna)', pattern: /\.(?:dropna|fillna)\s*\(/g },
    { topic: 'Aggregation & Grouping', subtopic: 'GroupBy', pattern: /\.groupby\s*\(/g },
  ]
}

export const pytorchDetector: TechnologyDetector = {
  name: 'PyTorch',
  extensions: ['.py', '.ipynb'],
  stripComments: (content: string) => content.replace(/(?:'''[\s\S]*?'''|"""[\s\S]*?""")|#.*/g, ''),
  rules: [
    { topic: 'PyTorch Foundations', subtopic: 'Tensors', pattern: /\btorch\.tensor\b|\btorch\.zeros\b|\btorch\.ones\b/g },
    { topic: 'Neural Networks (torch.nn)', subtopic: 'Modules (nn.Module)', pattern: /\bnn\.Module\b/g },
    { topic: 'Neural Networks (torch.nn)', subtopic: 'Layers (Linear, Conv2d)', pattern: /\bnn\.(?:Linear|Conv2d|ReLU|Sequential)\b/g },
    { topic: 'Optimization (torch.optim)', subtopic: 'Optimizers', pattern: /\btorch\.optim\.(?:Adam|SGD)\b/g },
  ]
}


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


export const htmlDetector: TechnologyDetector = {
  name: 'HTML',
  extensions: ['.html', '.htm'],
  stripComments: (content: string) => content.replace(/<!--[\s\S]*?-->/g, ''),
  rules: [
    { topic: 'Document Structure', subtopic: 'Doctype', pattern: /<!DOCTYPE\s+html>/i },
    { topic: 'Document Structure', subtopic: 'Head & Body', pattern: /<head>[\s\S]*?<\/head>|<body>[\s\S]*?<\/body>/gi },
    { topic: 'Document Structure', subtopic: 'Meta Tags', pattern: /<meta\s+[^>]*>/gi },
    { topic: 'Document Structure', subtopic: 'Linking Assets', pattern: /<link\s+[^>]*rel=["']stylesheet["'][^>]*>|<script\s+[^>]*src=["'][^"']*["'][^>]*>/gi }
  ]
}

export const cssDetector: TechnologyDetector = {
  name: 'CSS',
  extensions: ['.css'],
  stripComments: (content: string) => content.replace(/\/\*[\s\S]*?\*\//g, ''),
  rules: [
    { topic: 'Styling Fundamentals', subtopic: 'Selectors & Specificity', pattern: /(?:^|\})[^{\n]+\s*\{/g }, // Basic matching of CSS selectors
    { topic: 'Styling Fundamentals', subtopic: 'Box Model', pattern: /\b(?:margin|padding|border|width|height)\s*:/gi },
    { topic: 'Styling Fundamentals', subtopic: 'Colors & Gradients', pattern: /\b(?:color|background-color)\s*:|\blinear-gradient\s*\(/gi },
    { topic: 'Styling Fundamentals', subtopic: 'Typography', pattern: /\b(?:font-family|font-size|font-weight|line-height|text-align)\s*:/gi }
  ]
}


