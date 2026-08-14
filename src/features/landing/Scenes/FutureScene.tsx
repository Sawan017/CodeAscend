import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Ring, Sphere, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export function FutureScene(props: JSX.IntrinsicElements['group']) {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      coreRef.current.scale.set(scale, scale, scale)
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = state.clock.elapsedTime * 0.05
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group {...props}>
      {/* Colossal glowing core / portal */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
        <Sphere ref={coreRef} args={[10, 64, 64]} position={[0, 0, -20]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} roughness={0} metalness={1} />
        </Sphere>
      </Float>

      {/* Massive orbiting concentric rings */}
      <group ref={ringsRef} position={[0, 0, -20]}>
        <Ring args={[15, 15.5, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.6} />
        </Ring>
        <Ring args={[22, 22.5, 64]} rotation={[Math.PI / 4, 0, 0]}>
          <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.4} />
        </Ring>
        <Ring args={[30, 30.5, 64]} rotation={[-Math.PI / 4, 0, 0]}>
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.1} />
        </Ring>
      </group>
      
      {/* Dense magical particle field around the portal */}
      <Sparkles count={500} scale={100} size={2} speed={0.2} opacity={0.5} color="#ffffff" position={[0, 0, 0]} />
    </group>
  )
}
