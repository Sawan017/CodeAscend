// A single massive, unified environment.
// No random generation, just composed monolithic architecture.
export function MonolithicDive() {
  return (
    <group>
      {/* Ground - vast reflective plain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial 
          color="#030408" 
          roughness={0.1} 
          metalness={0.8} 
        />
      </mesh>

      {/* --- The Canyon of Architecture --- */}
      {/* 
        We are building a canyon along the Z-axis.
        Camera path: starts at Z=50, dives to Z=-100.
      */}

      {/* Opening Monoliths (Z = 40 to Z = 20) */}
      <mesh position={[-20, 15, 30]} castShadow receiveShadow>
        <boxGeometry args={[15, 35, 20]} />
        <meshStandardMaterial color="#080a10" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[25, 20, 25]} castShadow receiveShadow>
        <boxGeometry args={[12, 45, 18]} />
        <meshStandardMaterial color="#06080d" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Mid-Canyon Walls (Z = 10 to Z = -30) */}
      {/* Left Wall Segment */}
      <mesh position={[-18, 25, -10]} castShadow receiveShadow>
        <boxGeometry args={[10, 55, 40]} />
        <meshStandardMaterial color="#05060a" roughness={0.25} metalness={0.75} />
      </mesh>
      <mesh position={[-22, 10, -5]} castShadow receiveShadow>
        <boxGeometry args={[8, 25, 50]} />
        <meshStandardMaterial color="#0a0c14" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Right Wall Segment */}
      <mesh position={[20, 30, -5]} castShadow receiveShadow>
        <boxGeometry args={[14, 65, 35]} />
        <meshStandardMaterial color="#040508" roughness={0.15} metalness={0.85} />
      </mesh>
      <mesh position={[14, 15, -20]} castShadow receiveShadow>
        <boxGeometry args={[6, 35, 20]} />
        <meshStandardMaterial color="#070912" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* The Narrows (Z = -40 to Z = -70) */}
      {/* Archway / Bridge over the path */}
      <mesh position={[0, 40, -50]} castShadow receiveShadow>
        <boxGeometry args={[40, 4, 15]} />
        <meshStandardMaterial color="#030406" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[-15, 20, -50]} castShadow receiveShadow>
        <boxGeometry args={[8, 40, 15]} />
        <meshStandardMaterial color="#050608" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[15, 20, -50]} castShadow receiveShadow>
        <boxGeometry args={[8, 40, 15]} />
        <meshStandardMaterial color="#050608" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Final Approach Columns (Z = -75 to Z = -95) */}
      <mesh position={[-8, 10, -80]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 25, 16]} />
        <meshStandardMaterial color="#080a12" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[8, 10, -85]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 25, 16]} />
        <meshStandardMaterial color="#080a12" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[-8, 10, -90]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 25, 16]} />
        <meshStandardMaterial color="#080a12" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[8, 10, -95]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 25, 16]} />
        <meshStandardMaterial color="#080a12" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* --- The Destination / Focal Point (Z = -110) --- */}
      {/* A massive floating ring / portal emitting a gentle glow */}
      <mesh position={[0, 10, -110]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[8, 0.4, 32, 64]} />
        <meshStandardMaterial 
          color="#3366cc" 
          emissive="#2244aa"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>
      
      {/* Light coming from the portal */}
      <pointLight position={[0, 10, -108]} color="#66aaff" intensity={5} distance={50} />

      {/* Ambient glowing accents in the canyon to provide depth and scale */}
      <mesh position={[-12, 1, 20]}>
        <boxGeometry args={[0.2, 5, 0.2]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <pointLight position={[-12, 3, 20]} color="#00ffff" intensity={1} distance={15} />

      <mesh position={[13, 1, -10]}>
        <boxGeometry args={[0.2, 8, 0.2]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <pointLight position={[13, 4, -10]} color="#00ffff" intensity={1.5} distance={20} />

      <mesh position={[-10, 1, -60]}>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <pointLight position={[-10, 2, -60]} color="#00ffff" intensity={1} distance={15} />

    </group>
  );
}
