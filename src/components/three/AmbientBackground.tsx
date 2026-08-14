import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Utility to generate random points in a sphere
function generateParticles(count: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 20 * Math.cbrt(Math.random())
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos(2 * Math.random() - 1)
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const count = 1500
  const positions = useMemo(() => generateParticles(count), [count])

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 50
      ref.current.rotation.y -= delta / 75
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#06b6d4" // Cyan matching the premium theme
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  )
}

export default function AmbientBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }}>
      <Canvas camera={{ position: [0, 0, 15] }} dpr={[1, 1.5]}>
        <ParticleField />
      </Canvas>
    </div>
  )
}
