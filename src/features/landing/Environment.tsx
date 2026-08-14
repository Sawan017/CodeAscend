import { Stars, Sparkles, Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function LandingEnvironment() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow ambient rotation for the whole environment
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <group>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#06b6d4" />
      <directionalLight position={[-10, -20, -10]} intensity={1.5} color="#a855f7" />
      <pointLight position={[0, 0, -100]} intensity={3} color="#ffffff" distance={200} />
      
      {/* Deep Space Fog */}
      <fog attach="fog" args={['#010204', 10, 120]} />

      <group ref={groupRef}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Continuous particle stream spanning the Z-axis */}
        <Sparkles count={1000} scale={[40, 40, 250]} size={1.5} speed={0.2} opacity={0.3} color="#06b6d4" position={[0, 0, -100]} />
        <Sparkles count={500} scale={[60, 60, 250]} size={2} speed={0.1} opacity={0.2} color="#a855f7" position={[0, 0, -100]} />

        {/* Massive Distant Abstract Silhouettes (Monoliths) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <Box 
            key={i}
            args={[5 + Math.random() * 10, 100, 10 + Math.random() * 20]} 
            position={[
              (Math.random() - 0.5) * 150, 
              -50 + Math.random() * 20, 
              -50 - Math.random() * 150
            ]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            {/* Using a very dark color that catches specular highlights, but mostly acts as a silhouette */}
            <meshStandardMaterial color="#000000" roughness={0.4} metalness={0.9} />
          </Box>
        ))}
      </group>
    </group>
  )
}
