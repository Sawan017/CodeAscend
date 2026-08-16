import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Image, MeshReflectorMaterial, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function JourneyEnvironment() {
  const fogColor = useMemo(() => new THREE.Color('#050810'), [])
  const lightColor = useMemo(() => new THREE.Color('#ffffff'), [])

  return (
    <group>
      {/* Subtle cinematic lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Directional light to catch the floor */}
      <directionalLight 
        position={[20, 30, 20]} 
        intensity={0.5} 
        color={lightColor}
      />
      
      {/* Deep cinematic fog to blend the horizon */}
      <fog attach="fog" args={[fogColor, 10, 60]} />
      <color attach="background" args={['#050810']} />

      {/* 
        ACT I: TRADITIONAL CHINA 
        Positioned at Z = -10
      */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Image 
          url="/traditional.jpg"
          transparent
          opacity={1}
          position={[0, 4, -10]}
          scale={[24, 13.5]} // 16:9 ratio
        />
      </Float>

      {/* 
        ACT II: TRANSFORMATION 
        Positioned at Z = -35
      */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Image 
          url="/transformation.jpg"
          transparent
          opacity={1}
          position={[0, 4, -35]}
          scale={[24, 13.5]}
        />
      </Float>

      {/* 
        ACT III: MODERN CHINA 
        Positioned at Z = -60
      */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Image 
          url="/modern.jpg"
          transparent
          opacity={1}
          position={[0, 4, -60]}
          scale={[24, 13.5]}
        />
      </Float>

      {/* 
        3D DEPTH: INFINITE REFLECTIVE FLOOR
        Provides a premium cinematic grounding for the images.
      */}
      <mesh position={[0, -3, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 150]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#151515"
          metalness={0.8}
          roughness={0.2}
          mirror={1}
        />
      </mesh>
      
      {/* Subtle floating particles for atmospheric depth */}
      <AtmosphericDust />
    </group>
  )
}

function AtmosphericDust() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40     // x
      pos[i * 3 + 1] = Math.random() * 20         // y
      pos[i * 3 + 2] = -Math.random() * 80 + 10   // z
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
      particlesRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.5
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}
