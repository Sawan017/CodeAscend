import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Line, Text } from '@react-three/drei'
import * as THREE from 'three'

export function LearnScene(props: JSX.IntrinsicElements['group']) {
  // Scatter nodes widely across X, Y, and importantly Z so the camera flies *through* them
  const nodes = [
    { pos: new THREE.Vector3(-6, 3, 10), color: "#f0db4f", label: "JavaScript" },
    { pos: new THREE.Vector3(5, -2, 5), color: "#e34c26", label: "HTML" },
    { pos: new THREE.Vector3(0, 4, 0), color: "#61dafb", label: "React" },
    { pos: new THREE.Vector3(-4, -4, -5), color: "#3178c6", label: "TypeScript" },
    { pos: new THREE.Vector3(6, 2, -10), color: "#264de4", label: "CSS" },
    { pos: new THREE.Vector3(-2, 5, -15), color: "#4479a1", label: "SQL" },
    { pos: new THREE.Vector3(3, -5, -20), color: "#83cd29", label: "Node.js" },
    { pos: new THREE.Vector3(-5, 0, -25), color: "#06b6d4", label: "System Design" },
  ]

  const lines = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].pos.distanceTo(nodes[j].pos) < 15) {
        lines.push([nodes[i].pos, nodes[j].pos])
      }
    }
  }

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group {...props}>
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={node.pos.toArray()}>
            <Sphere args={[0.5, 32, 32]}>
              <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.8} roughness={0.2} metalness={0.8} />
            </Sphere>
            <Sphere args={[0.8, 16, 16]}>
              <meshBasicMaterial color={node.color} transparent opacity={0.1} wireframe />
            </Sphere>
            
            <Text position={[0, -1, 0]} fontSize={0.5} color={node.color} anchorX="center" anchorY="middle" fillOpacity={0.8}>
              {node.label}
            </Text>
          </Float>
        ))}

        {lines.map((points, i) => (
          <Line
            key={i}
            points={points}
            color="#06b6d4"
            lineWidth={1.5}
            transparent
            opacity={0.15}
          />
        ))}
      </group>
    </group>
  )
}
