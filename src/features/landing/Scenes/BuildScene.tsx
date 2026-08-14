import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Box, Edges } from '@react-three/drei'
import * as THREE from 'three'

export function BuildScene(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  return (
    <group {...props} ref={groupRef}>
      {/* Abstract floating panels representing projects/workspaces */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={[-4, 0, 0]}>
        <mesh rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[4, 6, 0.1]} />
          <meshStandardMaterial color="#0a0d14" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
          <Edges color="#a855f7" />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6} position={[4, 1, -2]}>
        <mesh rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[5, 3, 0.1]} />
          <meshStandardMaterial color="#0a0d14" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
          <Edges color="#06b6d4" />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[0, -3, -4]}>
        <mesh rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[6, 4, 0.1]} />
          <meshStandardMaterial color="#0a0d14" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
          <Edges color="#ffffff" />
        </mesh>
      </Float>
      
      {/* Small floating "data" fragments */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2} position={[
          (Math.random() - 0.5) * 15, 
          (Math.random() - 0.5) * 10, 
          (Math.random() - 0.5) * 10
        ]}>
          <Box args={[0.2, 0.05, 0.2]}>
            <meshBasicMaterial color={Math.random() > 0.5 ? "#06b6d4" : "#a855f7"} />
          </Box>
        </Float>
      ))}
    </group>
  )
}
