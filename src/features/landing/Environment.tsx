import { Stars, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function LandingEnvironment() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow ambient rotation for the whole environment
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#06b6d4" />
      <directionalLight position={[-10, -20, -10]} intensity={1} color="#a855f7" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={50} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={50} size={2} speed={0.4} opacity={0.3} color="#06b6d4" />
      <Sparkles count={200} scale={50} size={1.5} speed={0.2} opacity={0.2} color="#a855f7" />
    </group>
  )
}
