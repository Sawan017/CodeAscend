import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Ring, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export function FutureScene(props: JSX.IntrinsicElements['group']) {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      coreRef.current.scale.set(scale, scale, scale)
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = state.clock.elapsedTime * 0.1
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group {...props}>
      {/* Central glowing core / portal */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere ref={coreRef} args={[3, 64, 64]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} roughness={0} metalness={1} />
        </Sphere>
      </Float>

      {/* Orbiting concentric rings */}
      <group ref={ringsRef}>
        <Ring args={[4.5, 4.6, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.8} />
        </Ring>
        <Ring args={[6.5, 6.6, 64]} rotation={[Math.PI / 4, 0, 0]}>
          <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.5} />
        </Ring>
        <Ring args={[8.5, 8.6, 64]} rotation={[-Math.PI / 4, 0, 0]}>
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.2} />
        </Ring>
      </group>
    </group>
  )
}
