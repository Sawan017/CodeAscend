import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function HeroScene(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    }
  })

  return (
    <group {...props} ref={groupRef}>
      {/* Central massive structure */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, -10]}>
          <octahedronGeometry args={[5, 0]} />
          <meshStandardMaterial color="#0a0d14" roughness={0.1} metalness={0.8} wireframe />
        </mesh>
      </Float>

      {/* Glowing inner core */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[2, 32, 32]} position={[0, 0, -10]}>
          <MeshDistortMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} distort={0.4} speed={2} />
        </Sphere>
      </Float>

      {/* Floating abstract shards */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={2} floatIntensity={2}>
          <Box 
            args={[Math.random() * 2, Math.random() * 0.2, Math.random() * 2]} 
            position={[
              (Math.random() - 0.5) * 20, 
              (Math.random() - 0.5) * 20, 
              -15 + (Math.random() - 0.5) * 10
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          >
            <meshStandardMaterial color="#1a1f2e" transparent opacity={0.6} roughness={0.2} metalness={0.9} />
          </Box>
        </Float>
      ))}
    </group>
  )
}
