export interface ConceptEvidence {
  domain: string
  skill: string
  topic: string
  subtopic: string
  filename: string
  evidenceType: string
  strength: 'strong' | 'weak'
  fingerprint: string
  matchSnippet?: string
}

export interface AnalysisResult {
  languagesDetected: string[]
  evidences: ConceptEvidence[]
}

export interface TechnologyRule {
  topic: string
  subtopic: string
  pattern: RegExp
}

export interface TechnologyDetector {
  name: string // Maps to canonicalName in learningData, e.g., 'JavaScript', 'React', 'Docker'
  extensions: string[] // can also include specific filenames like 'Dockerfile'
  rules: TechnologyRule[]
  stripComments?: (content: string) => string
}
