import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { LandingEnvironment } from './Environment'
import { SceneCamera } from './SceneCamera'
import { HeroScene } from './Scenes/HeroScene'
import { LearnScene } from './Scenes/LearnScene'
import { BuildScene } from './Scenes/BuildScene'
import { LevelUpScene } from './Scenes/LevelUpScene'
import { FutureScene } from './Scenes/FutureScene'
import { HtmlOverlays } from './HtmlOverlays'

export function LandingExperience({ handleAction }: { handleAction: () => void }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030407' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Cap pixel ratio for performance
      >
        <color attach="background" args={['#030407']} />
        <fog attach="fog" args={['#030407', 10, 80]} />
        
        <Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.25} distance={1.5}>
            <LandingEnvironment />
            <SceneCamera />
            
            {/* 3D Scenes spaced along the Z-axis */}
            <group>
              <HeroScene />
              <LearnScene position={[0, 0, -25]} />
              <BuildScene position={[0, 0, -50]} />
              <LevelUpScene position={[0, 0, -75]} />
              <FutureScene position={[0, 0, -100]} />
            </group>

            {/* HTML Overlays synchronized with scroll */}
            <HtmlOverlays handleAction={handleAction} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  )
}
