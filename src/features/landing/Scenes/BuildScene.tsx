import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Box, Edges, Text } from '@react-three/drei'
import * as THREE from 'three'

export function BuildScene(props: JSX.IntrinsicElements['group']) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5
    }
  })

  // Spread project frames across Z so camera flies past them
  return (
    <group {...props} ref={groupRef}>
      {/* Frame 1 */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={[-6, 2, 5]}>
        <mesh rotation={[0, Math.PI / 8, 0]}>
          <boxGeometry args={[6, 4, 0.1]} />
          <meshPhysicalMaterial color="#0a0d14" transparent opacity={0.6} roughness={0.1} metalness={0.8} transmission={0.5} />
          <Edges color="#a855f7" />
          <Text position={[0, 0, 0.1]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
            {`function buildProject() {\n  return success;\n}`}
          </Text>
        </mesh>
      </Float>

      {/* Frame 2 */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6} position={[6, -1, -5]}>
        <mesh rotation={[0, -Math.PI / 6, 0]}>
          <boxGeometry args={[5, 7, 0.1]} />
          <meshPhysicalMaterial color="#0a0d14" transparent opacity={0.6} roughness={0.1} metalness={0.8} transmission={0.5} />
          <Edges color="#06b6d4" />
          <Text position={[0, 0, 0.1]} fontSize={0.25} color="#06b6d4" anchorX="center" anchorY="middle">
            {`<Container>\n  <UI />\n</Container>`}
          </Text>
        </mesh>
      </Float>

      {/* Frame 3 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-4, -3, -15]}>
        <mesh rotation={[-Math.PI / 12, Math.PI / 12, 0]}>
          <boxGeometry args={[7, 4, 0.1]} />
          <meshPhysicalMaterial color="#0a0d14" transparent opacity={0.6} roughness={0.1} metalness={0.8} transmission={0.5} />
          <Edges color="#ffffff" />
          <Text position={[0, 0, 0.1]} fontSize={0.4} color="#a855f7" anchorX="center" anchorY="middle">
            SELECT * FROM future;
          </Text>
        </mesh>
      </Float>
      
      {/* Small floating data fragments flowing around */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2} position={[
          (Math.random() - 0.5) * 20, 
          (Math.random() - 0.5) * 15, 
          (Math.random() - 0.5) * 30
        ]}>
          <Box args={[0.2, 0.05, 0.2]}>
            <meshBasicMaterial color={Math.random() > 0.5 ? "#06b6d4" : "#a855f7"} />
          </Box>
        </Float>
      ))}
    </group>
  )
}
