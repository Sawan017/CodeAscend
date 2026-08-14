import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { LandingEnvironment } from './Environment'
import { SceneCamera } from './SceneCamera'
import { HeroScene } from './Scenes/HeroScene'
import { LearnScene } from './Scenes/LearnScene'
import { BuildScene } from './Scenes/BuildScene'
import { LevelUpScene } from './Scenes/LevelUpScene'
import { BadgeScene } from './Scenes/BadgeScene'
import { FutureScene } from './Scenes/FutureScene'
import { HtmlOverlays } from './HtmlOverlays'

export function LandingExperience({ handleAction }: { handleAction: () => void }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030407' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }} // Antialias false because postprocessing handles it or we disable for perf
        dpr={[1, 1.5]} // Capped for postprocessing performance
      >
        <color attach="background" args={['#010204']} />
        
        <Suspense fallback={null}>
          <ScrollControls pages={10} damping={0.25} distance={1.2}>
            <LandingEnvironment />
            <SceneCamera />
            
            {/* 3D Scenes spaced heavily along the Z-axis for a long journey */}
            <group>
              <HeroScene position={[0, 0, 0]} />
              <LearnScene position={[0, 0, -40]} />
              <BuildScene position={[0, 0, -80]} />
              <LevelUpScene position={[0, 0, -120]} />
              <BadgeScene position={[0, 0, -160]} />
              <FutureScene position={[0, 0, -200]} />
            </group>

            {/* HTML Overlays synchronized with scroll */}
            <HtmlOverlays handleAction={handleAction} />
          </ScrollControls>

          <EffectComposer>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
