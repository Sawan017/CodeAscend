import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollStore } from './scrollStore'

export function CameraRig() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0
      
      setScrollProgress(progress)
      scrollStore.set(progress)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const currentProgress = useRef(0)
  
  // Starting point and end point
  const startZ = 5
  const endZ = -50
  const pathLength = startZ - endZ
  
  useFrame((state, delta) => {
    // Smoother catch-up (dampening factor 2.0 for slow, cinematic feel)
    const newProgress = THREE.MathUtils.damp(currentProgress.current, scrollProgress, 2.0, delta)
    currentProgress.current = newProgress
    
    // Linearly interpolate Z position
    const targetZ = startZ - (pathLength * currentProgress.current)
    
    // Add subtle bobbing motion to make it feel like floating rather than a rail
    const bobOffset = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
    
    // Update camera
    state.camera.position.set(0, 4 + bobOffset, targetZ)
    
    // Always look straight ahead (slight downward angle to see floor reflections)
    const targetLookAt = new THREE.Vector3(0, 3, targetZ - 10)
    state.camera.lookAt(targetLookAt)
  })

  return null
}
