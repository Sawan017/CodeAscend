import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Cylinder, TorusKnot } from '@react-three/drei'
import * as THREE from 'three'

export function LevelUpScene(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group {...props}>
      <group ref={groupRef}>
        {/* Energy core / Torus knot */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <TorusKnot args={[2, 0.5, 128, 32]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1} roughness={0.2} metalness={0.8} wireframe />
          </TorusKnot>
        </Float>
        
        {/* Ascending platforms representing levels/progression */}
        {Array.from({ length: 7 }).map((_, i) => (
          <Float key={i} speed={1} rotationIntensity={0.1} floatIntensity={0.5} position={[
            Math.sin(i * Math.PI * 0.4) * 5, 
            -5 + i * 1.5, 
            Math.cos(i * Math.PI * 0.4) * 5
          ]}>
            <Cylinder args={[1.5, 1.5, 0.2, 32]}>
              <meshStandardMaterial color="#0a0d14" transparent opacity={0.9} roughness={0.1} metalness={0.9} />
            </Cylinder>
            <Cylinder args={[1.6, 1.6, 0.05, 32]}>
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
            </Cylinder>
          </Float>
        ))}
      </group>
    </group>
  )
}
