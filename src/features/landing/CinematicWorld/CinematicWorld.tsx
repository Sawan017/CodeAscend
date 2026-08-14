import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Easing function for smooth transitions
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // Total particles
  const count = 15000
  const tempObject = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  // Initialize random offsets and properties per particle
  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        random: Math.random(),
        random2: Math.random(),
        random3: Math.random(),
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 40,
        heightOffset: (Math.random() - 0.5) * 50
      })
    }
    return arr
  }, [count])

  // Get scroll progress native
  const getScrollProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    return maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0
  }

  // Smooth progress state to avoid jitter
  const progressRef = useRef(0)

  // WebGL render loop
  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Smooth scroll progress
    const targetProgress = getScrollProgress()
    progressRef.current = THREE.MathUtils.damp(progressRef.current, targetProgress, 4, delta)
    const progress = progressRef.current

    // Convert progress (0-1) to era (0-6)
    const eraProgress = progress * 6.0
    const currentEra = Math.floor(eraProgress)
    const nextEra = Math.min(currentEra + 1, 6)
    const blend = easeInOutCubic(eraProgress - currentEra)
    const time = state.clock.getElapsedTime()

    // Premium high-end palette for 7 eras
    // A cinematic warm-to-cool progression
    const colors = [
      new THREE.Color(0.85, 0.85, 0.90), // Era 0: Frost White / Silver (Era 1)
      new THREE.Color(0.80, 0.65, 0.15), // Era 1: Soft Gold / Champagne
      new THREE.Color(0.85, 0.35, 0.05), // Era 2: Burnt Orange / Amber
      new THREE.Color(0.60, 0.05, 0.10), // Era 3: Deep Ruby / Crimson
      new THREE.Color(0.30, 0.05, 0.50), // Era 4: Deep Amethyst / Purple
      new THREE.Color(0.05, 0.15, 0.70), // Era 5: Cobalt / Deep Blue
      new THREE.Color(0.00, 0.85, 1.00)  // Era 6: Futuristic Cyan (Era 7)
    ]
    
    const colorA = colors[currentEra]
    const colorB = colors[nextEra]
    const currentColor = colorA.clone().lerp(colorB, blend)

    // Camera movement based on scroll
    state.camera.position.y = THREE.MathUtils.lerp(10, 0, progress)
    state.camera.position.z = THREE.MathUtils.lerp(40, 20, progress)
    state.camera.lookAt(0, 0, 0)

    for (let i = 0; i < count; i++) {
      const p = particles[i]
      
      // Calculate positions for each era
      
      // ERA 0: Foundation (Organic flowing landscape/mountains)
      const nx0 = (p.random - 0.5) * 80
      const nz0 = (p.random2 - 0.5) * 80
      const ny0 = Math.sin(nx0 * 0.1 + time * 0.5) * 5 + Math.cos(nz0 * 0.1 - time * 0.3) * 5 - 10
      const pos0 = new THREE.Vector3(nx0, ny0, nz0)

      // ERA 1: Build (Architectural grid/pillars)
      const colSpacing = 8
      const colX = Math.round((p.random - 0.5) * 10) * colSpacing
      const colZ = Math.round((p.random2 - 0.5) * 10) * colSpacing
      const isPillar = p.random3 > 0.5
      let pos1 = new THREE.Vector3(colX, p.heightOffset, colZ)
      if (!isPillar) {
         pos1.set(
           (p.random - 0.5) * 100,
           -15 + p.random3 * 2,
           (p.random2 - 0.5) * 100
         )
      }

      // ERA 2: Systems (Rotating gears/cylinders)
      const gearRadius = 15 + p.random * 10
      // Reduce speed to roughly 15-25% and add parallax based on radius
      const gearSpeed = 0.15 + (gearRadius / 25) * 0.1
      const gearAngle = p.angle + time * gearSpeed * (p.random2 > 0.5 ? 1 : -1)
      const pos2 = new THREE.Vector3(
        Math.cos(gearAngle) * gearRadius,
        (p.random3 - 0.5) * 20 + Math.sin(time * 0.2 + p.id) * 1.5, // subtle continuous vertical float
        Math.sin(gearAngle) * gearRadius
      )

      // ERA 3: Execution (Data matrix/grid)
      const gridStep = 4
      const gx = Math.round((p.random - 0.5) * 20) * gridStep
      const gy = Math.round((p.random3 - 0.5) * 20) * gridStep
      const gz = Math.round((p.random2 - 0.5) * 20) * gridStep
      const pulse = Math.sin(time * 1 + gx * 0.1) * 2 // Slowed down from 5 to 1
      const pos3 = new THREE.Vector3(gx, gy + pulse, gz)

      // ERA 4: Mastery (Focused Vortex)
      const spiralRadius = p.random * 15
      const spiralAngle = p.angle + time * 0.5
      const spiralY = (p.random3 - 0.5) * 40
      const twistedAngle = spiralAngle + spiralY * 0.2 // Twist based on height
      const pos4 = new THREE.Vector3(
        Math.cos(twistedAngle) * spiralRadius,
        spiralY,
        Math.sin(twistedAngle) * spiralRadius
      )

      // ERA 5: Signature (DNA Double Helix)
      const helixRadius = 12 + p.random * 4
      const helixY = (p.random3 - 0.5) * 40
      // Create two intertwined strands by adding PI to half the particles
      const helixAngle = helixY * 0.3 + time * 1.2 + (p.random2 > 0.5 ? Math.PI : 0)
      const pos5 = new THREE.Vector3(
        Math.cos(helixAngle) * helixRadius,
        helixY,
        Math.sin(helixAngle) * helixRadius
      )
      
      // ERA 6: Next (Sleek abstract orbit - moved from 6th)
      const ringRadius = 25 + p.random * 15
      const orbitAngle = p.angle + time * 0.2
      const pos6 = new THREE.Vector3(
        Math.cos(orbitAngle) * ringRadius,
        Math.sin(orbitAngle * 3 + time) * 5,
        Math.sin(orbitAngle) * ringRadius
      )

      // Interpolate positions based on progress
      const getPos = (era: number) => {
        if (era === 0) return pos0
        if (era === 1) return pos1
        if (era === 2) return pos2
        if (era === 3) return pos3
        if (era === 4) return pos4
        if (era === 5) return pos5
        return pos6
      }

      const pA = getPos(currentEra)
      const pB = getPos(nextEra)
      
      const finalPos = pA.lerp(pB, blend)
      
      // Add subtle noise
      finalPos.x += Math.sin(time + p.id) * 0.1
      finalPos.y += Math.cos(time + p.id * 2) * 0.1
      finalPos.z += Math.sin(time * 0.5 + p.id) * 0.1

      tempObject.position.copy(finalPos)
      
      // Look at center or orient dynamically
      tempObject.lookAt(0, 0, 0)
      
      // Scale based on distance
      const dist = finalPos.distanceTo(state.camera.position)
      let scale = Math.max(0.01, 1 - dist / 100) * (0.2 + p.random * 0.3)
      
      // Reduce particle count in Era 3 (index 2) by shrinking 40% of them to zero
      if (p.random > 0.6) {
        const distToEra3 = Math.abs(eraProgress - 2);
        const scaleMultiplier = THREE.MathUtils.clamp(distToEra3, 0, 1);
        scale *= scaleMultiplier;
      }

      tempObject.scale.set(scale, scale, scale)
      
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)

      // Colors
      const intensity = Math.max(0.2, Math.sin(time * 2 + p.id * 0.1))
      tempColor.copy(currentColor).multiplyScalar(intensity + 0.5)
      meshRef.current.setColorAt(i, tempColor)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Premium minimal geometry (octahedron for technical feel) */}
      <octahedronGeometry args={[0.5, 0]} />
      <meshBasicMaterial 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

export function CinematicWorld() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', inset: 0, zIndex: 0, background: '#030407' }}>
      <Canvas 
        camera={{ position: [0, 10, 40], fov: 45 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
        dpr={[1, 2]} // clamp pixel ratio for performance
      >
        <color attach="background" args={['#030407']} />
        <fog attach="fog" args={['#030407', 20, 80]} />
        <ParticleField />
      </Canvas>
    </div>
  )
}
