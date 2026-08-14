import { useRef } from 'react'
import type { JSX } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

export function LearnScene(props: JSX.IntrinsicElements['group']) {
  const nodes = [
    { pos: new THREE.Vector3(-4, 2, 0), color: "#f0db4f", label: "JavaScript" },
    { pos: new THREE.Vector3(4, 3, -2), color: "#61dafb", label: "React" },
    { pos: new THREE.Vector3(0, -3, 2), color: "#3178c6", label: "TypeScript" },
    { pos: new THREE.Vector3(-5, -2, -3), color: "#e34c26", label: "HTML" },
    { pos: new THREE.Vector3(5, -1, 1), color: "#264de4", label: "CSS" },
    { pos: new THREE.Vector3(0, 4, -4), color: "#4479a1", label: "SQL" },
  ]

  // Draw lines connecting the nodes (simple network)
  const lines = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].pos.distanceTo(nodes[j].pos) < 8) {
        lines.push([nodes[i].pos, nodes[j].pos])
      }
    }
  }

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group {...props}>
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={node.pos.toArray()}>
            <Sphere args={[0.5, 32, 32]}>
              <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
            </Sphere>
            {/* Soft outer glow */}
            <Sphere args={[0.7, 16, 16]}>
              <meshBasicMaterial color={node.color} transparent opacity={0.2} wireframe />
            </Sphere>
          </Float>
        ))}

        {lines.map((points, i) => (
          <Line
            key={i}
            points={points}
            color="#06b6d4"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        ))}
      </group>
    </group>
  )
}
