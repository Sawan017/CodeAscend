import type { TechnologyDetector } from './types'
import {
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
} from './rules'

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
