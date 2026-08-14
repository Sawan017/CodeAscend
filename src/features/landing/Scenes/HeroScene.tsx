import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Torus, MeshTransmissionMaterial, Sparkles, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

export function HeroScene(props: JSX.IntrinsicElements['group']) {
  const coreRef = useRef<THREE.Group>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (coreRef.current && outerRingRef.current && innerRingRef.current) {
      const t = state.clock.elapsedTime
      // Extremely slow, elegant rotation
      coreRef.current.rotation.y = t * 0.05
      coreRef.current.rotation.x = Math.sin(t * 0.1) * 0.1
      
      outerRingRef.current.rotation.x = t * 0.08
      outerRingRef.current.rotation.y = t * 0.06
      
      innerRingRef.current.rotation.x = t * -0.05
      innerRingRef.current.rotation.z = t * 0.07
    }
  })

  return (
    <group {...props}>
      {/* 
        Positioned to the right and deep into the scene 
        so it doesn't overlap centered text. 
        Occupies 20-30% of screen. 
      */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={coreRef} position={[4, 0, -15]} scale={1.5}>
          {/* Elegant Abstract Core (Octahedron) */}
          <Octahedron args={[1.5, 0]}>
            <MeshTransmissionMaterial 
              backside 
              resolution={256} 
              thickness={0.2} 
              roughness={0.1} 
              transmission={0.95} 
              ior={1.1} 
              color="#a855f7" 
            />
          </Octahedron>
          
          {/* Inner Energy */}
          <Octahedron args={[0.5, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} wireframe />
          </Octahedron>

          {/* Thin, sophisticated layered rings */}
          <Torus ref={outerRingRef} args={[2.5, 0.01, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.3} />
          </Torus>
          <Torus ref={innerRingRef} args={[2.0, 0.02, 16, 100]} rotation={[-Math.PI / 4, 0, 0]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} transparent opacity={0.5} />
          </Torus>
          
          {/* Localized small energy nodes around core */}
          <Sparkles count={50} scale={4} size={1} speed={0.1} color="#06b6d4" opacity={0.6} />
        </group>
      </Float>
      
      {/* Midground Spatial Structures (Distant and subtle) */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-5, 3, -25]} scale={0.5} rotation={[0, Math.PI / 4, 0]}>
          <Octahedron args={[2, 0]}>
            <meshStandardMaterial color="#1a1f2e" transparent opacity={0.4} roughness={0.3} metalness={0.8} />
          </Octahedron>
          <Torus args={[3, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} transparent opacity={0.2} />
          </Torus>
        </group>
      </Float>

      {/* Foreground: only a few subtle particles passing by the camera */}
      <Sparkles count={150} scale={15} size={1} speed={0.05} opacity={0.2} color="#ffffff" position={[0, 0, -2]} />
    </group>
  )
}
