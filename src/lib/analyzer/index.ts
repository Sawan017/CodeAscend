import type { TechnologyDetector } from './types'
import { javascriptDetector } from './rules/javascript.ts'
import { typescriptDetector } from './rules/typescript.ts'
import { pythonDetector } from './rules/python.ts'
import { javaDetector } from './rules/java.ts'
import { cppDetector } from './rules/cpp.ts'
import { htmlDetector, cssDetector } from './rules/web.ts'
import { reactDetector } from './rules/react.ts'
import { nodejsDetector, expressDetector } from './rules/backend.ts'
import { sqlDetector, dockerDetector, jestDetector, pandasDetector, pytorchDetector } from './rules/misc.ts'

export const DETECTORS: TechnologyDetector[] = [
  javascriptDetector,
  typescriptDetector,
  pythonDetector,
  javaDetector,
  cppDetector,
  htmlDetector,
  cssDetector,
  reactDetector,
  nodejsDetector,
  expressDetector,
  sqlDetector,
  dockerDetector,
  jestDetector,
  pandasDetector,
  pytorchDetector
]

export function getDetectorsForFile(filename: string): TechnologyDetector[] {
  return DETECTORS.filter(detector => 
    detector.extensions.some(ext => filename.endsWith(ext) || filename === ext)
  )
}
