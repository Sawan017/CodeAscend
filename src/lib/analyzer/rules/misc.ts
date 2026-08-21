import type { TechnologyDetector } from '../types'

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
