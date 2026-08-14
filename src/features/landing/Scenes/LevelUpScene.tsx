import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Cylinder, TorusKnot, Text } from '@react-three/drei'
import * as THREE from 'three'

export function LevelUpScene(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group {...props}>
      <group ref={groupRef}>
        
        {/* Deep Z-axis pathway of XP/Levels */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Float key={i} speed={1} rotationIntensity={0.1} floatIntensity={0.5} position={[
            Math.sin(i * Math.PI * 0.3) * 6, 
            -4 + (i % 3), 
            i * -4 // Spread across Z to fly through
          ]}>
            <Cylinder args={[2, 2, 0.1, 64]}>
              <meshStandardMaterial color="#0a0d14" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
            </Cylinder>
            <Cylinder args={[2.1, 2.1, 0.02, 64]}>
              <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
            </Cylinder>
            <Text position={[0, 0.5, 0]} fontSize={0.8} color="#a855f7" anchorX="center" anchorY="middle" rotation={[-Math.PI/2, 0, 0]} fillOpacity={0.5}>
              LVL {i + 1}
            </Text>
          </Float>
        ))}

        {/* Central Energy core at the end of the pathway */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[0, 0, -50]}>
          <TorusKnot args={[4, 1, 256, 64]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1} roughness={0.1} metalness={0.9} wireframe />
          </TorusKnot>
        </Float>
        
      </group>
    </group>
  )
}
