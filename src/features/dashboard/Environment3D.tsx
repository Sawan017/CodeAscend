import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars, Clouds, Cloud, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- Parallax Camera Controller ---
const CameraController = () => {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame(() => {
    // Subtle ease toward target position
    const targetX = mouse.current.x * 2;
    const targetY = mouse.current.y * 1 + 5;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 5, 0);
  });

  return null;
};

// --- Night Sky / Stars ---
const MovingStars = () => {
  const starsRef = useRef<any>(null);
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
      starsRef.current.rotation.x += 0.00005;
    }
  });
  return <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
};

// --- Main Environment Component ---
export const Environment3D: React.FC = () => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const shell = document.querySelector('.app-shell');
      if (shell) {
        const isDark = shell.classList.contains('dark') || shell.classList.contains('midnight');
        const isLight = shell.classList.contains('light');
        if (isDark) setIsNight(true);
        else if (isLight) setIsNight(false);
        else setIsNight(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    const shell = document.querySelector('.app-shell');
    if (shell) {
      observer.observe(shell, { attributes: true, attributeFilter: ['class'] });
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      background: isNight ? '#030407' : 'transparent'
    }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
        <CameraController />
        
        <ambientLight intensity={isNight ? 0.1 : 0.8} />
        
        {isNight ? (
          <>
            <MovingStars />
            {/* Subtle moonlight */}
            <directionalLight position={[10, 20, -10]} intensity={0.6} color="var(--secondary)" />
            <directionalLight position={[-10, 10, 10]} intensity={0.2} color="#4c1d95" />
            {/* Ambient magic dust for night */}
            <Sparkles count={100} scale={50} size={2} speed={0.2} opacity={0.3} color="#A7F3D0" />
          </>
        ) : (
          <>
            {/* Warm daylight sky */}
            <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.2} azimuth={0.25} rayleigh={2} />
            <directionalLight position={[100, 20, 100]} intensity={1.5} color="#FDE047" />
            <directionalLight position={[-10, 10, 10]} intensity={0.4} color="#bae6fd" />
            {/* Ambient pollen/dust for day */}
            <Sparkles count={150} scale={50} size={3} speed={0.3} opacity={0.2} color="#FDE68A" />
          </>
        )}

        {/* Clouds with natural volumetric rendering */}
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud segments={30} bounds={[30, 5, 10]} volume={20} color={isNight ? "#1e293b" : "#ffffff"} position={[-15, 12, -30]} speed={0.15} opacity={isNight ? 0.2 : 0.8} />
          <Cloud segments={40} bounds={[30, 8, 15]} volume={25} color={isNight ? "#0f172a" : "#f8fafc"} position={[20, 15, -40]} speed={0.2} opacity={isNight ? 0.3 : 0.9} />
          <Cloud segments={20} bounds={[15, 4, 5]} volume={10} color={isNight ? "#334155" : "#e2e8f0"} position={[0, 10, -20]} speed={0.1} opacity={isNight ? 0.15 : 0.6} />
        </Clouds>

        {/* 
            NOTE: Mountains, roads, cars, water, fish, and NPCs have been strictly omitted. 
            The installed .riv assets were inspected and found to be identical placeholder stubs,
            and no actual 3D models were available. Fake CSS geometry has NOT been used.
        */}
      </Canvas>
    </div>
  );
};

