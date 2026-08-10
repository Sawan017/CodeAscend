import type { Settings } from '../types'

/**
 * Returns animation variants that respect the user's motion settings.
 * - reducedMotion: true  -> disables all motion (opacity only)
 * - animationIntensity: low/medium/high -> scales distance and duration
 */
export function getMotionVariants(settings: Settings) {
  const reduced = settings.reducedMotion
  const intensity = settings.animationIntensity

  const distance = reduced ? 0 : intensity === 'low' ? 6 : intensity === 'medium' ? 12 : 18
  const duration = reduced ? 0 : intensity === 'low' ? 0.2 : intensity === 'medium' ? 0.35 : 0.55

  return {
    fadeUp: (delay = 0) => ({
      initial: reduced ? { opacity: 0 } : { opacity: 0, y: distance },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0 },
      transition: { duration, delay },
    }),
    fadeIn: (delay = 0) => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: reduced ? 0 : 0.3, delay },
    }),
    scaleIn: (delay = 0) => ({
      initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0 },
      transition: { duration, delay },
    }),
    slideInRight: {
      initial: reduced ? { opacity: 0 } : { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 },
      transition: { type: 'spring', stiffness: 220, damping: 24 },
    },
  }
}

export const defaultSettings: Settings = {
  animationIntensity: 'high',
  reducedMotion: false,
  soundEffects: false,
  theme: 'dark',
  streakTracking: true,
}
