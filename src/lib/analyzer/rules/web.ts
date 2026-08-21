import type { TechnologyDetector } from '../types'

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
