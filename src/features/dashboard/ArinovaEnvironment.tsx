import React, { useEffect, useState } from 'react';

// ============================================================================
// SUPPLIED ASSETS COMPOSITOR
// ============================================================================

// Car Extractor Component
const CarSprite = ({ isNight, isLtoR, carIndex, style }: { isNight: boolean, isLtoR: boolean, carIndex: number, style?: React.CSSProperties }) => {
  // Row 0: Day L->R
  // Row 1: Day R->L
  // Row 2: Night L->R
  // Row 3: Night R->L
  const rowIndex = (isNight ? 2 : 0) + (isLtoR ? 0 : 1);
  const colIndex = carIndex % 6; // 6 car types

  return (
    <div style={{
      width: '8vw', height: '6vw',
      minWidth: '60px', minHeight: '45px',
      backgroundImage: 'url(/assets/supplied/cars.png)',
      backgroundSize: '600% 400%',
      backgroundPosition: `${(colIndex * 100) / 5}% ${(rowIndex * 100) / 3}%`,
      ...style
    }} />
  );
};

export const ArinovaEnvironment: React.FC = () => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsNight(n => !n);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`supplied-landscape-scene ${isNight ? 'is-night' : 'is-day'}`}
         style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .supplied-landscape-scene {
          --sky-top: #bae6fd;
          --sky-bottom: #f0fdfa;
          --world-filter: brightness(1) contrast(1) sepia(0);
          --sun-moon-y: 10%;
          --stars-opacity: 0;
        }
        .supplied-landscape-scene.is-night {
          --sky-top: #020617;
          --sky-bottom: #1e3a8a;
          --world-filter: brightness(0.4) contrast(1.1) sepia(0.2) hue-rotate(180deg) saturate(1.2);
          --sun-moon-y: 15%;
          --stars-opacity: 1;
        }

        .transition-all { transition: all 4s ease-in-out; }
        .transition-filter { transition: filter 4s ease-in-out; }
        
        .layer { position: absolute; background-repeat: no-repeat; }
        
        @keyframes drift { from { transform: translateX(0); } to { transform: translateX(-5vw); } }
        @keyframes float-cloud { from { transform: translateX(-20vw); } to { transform: translateX(120vw); } }
        @keyframes sway { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 1; } }
        @keyframes water-flow { 0% { opacity: 0.1; } 50% { opacity: 0.4; } 100% { opacity: 0.1; } }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}} />

      {/* 1. SKY */}
      <div className="transition-all" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--sky-top), var(--sky-bottom))' }} />

      {/* STARS (Night) */}
      <div className="transition-all" style={{ position: 'absolute', inset: 0, opacity: 'var(--stars-opacity)' }}>
         <svg width="100%" height="100%">
           {[...Array(50)].map((_, i) => (
             <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 60}%`} r={Math.random() * 1.5 + 0.5} fill="#fff" 
                     style={{ animation: `twinkle 4s infinite ${Math.random() * 2}s` }} />
           ))}
         </svg>
      </div>

      {/* CLOUDS */}
      <div style={{
        position: 'absolute', top: '10%', left: 0, width: '20vw', height: '15vh',
        background: 'rgba(255,255,255,0.8)', filter: 'blur(30px)', borderRadius: '50%',
        opacity: isNight ? 0.2 : 0.8, animation: 'float-cloud 80s linear infinite'
      }} />

      {/* GLOBAL SCENE COMPOSITE */}
      <div className="transition-filter" style={{ position: 'absolute', inset: 0, filter: 'var(--world-filter)' }}>
        
        {/* 2. DISTANT MOUNTAINS */}
        <div className="layer" style={{
          top: '15vh', left: '-5vw', width: '110vw', height: '50vh',
          backgroundImage: 'url(/assets/supplied/mountains.png)',
          backgroundSize: 'cover', backgroundPosition: 'bottom center',
          animation: 'drift 80s linear infinite alternate'
        }} />

        {/* 3. TERRAIN / VALLEY */}
        <div className="layer" style={{
          bottom: 0, left: '-2vw', width: '104vw', height: '60vh',
          backgroundImage: 'url(/assets/supplied/terrain.png)',
          backgroundSize: '100% 100%', backgroundPosition: 'center bottom',
          animation: 'drift 60s linear infinite alternate'
        }} />

        {/* 4. RIVER */}
        <div className="layer" style={{
          bottom: 0, left: '-2vw', width: '104vw', height: '60vh',
          backgroundImage: 'url(/assets/supplied/river.png)',
          backgroundSize: '100% 100%', backgroundPosition: 'center bottom',
          animation: 'drift 60s linear infinite alternate'
        }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', animation: 'water-flow 4s ease-in-out infinite' }} />
        </div>

        {/* 5. ROAD & FENCES */}
        <div className="layer" style={{
          bottom: 0, left: '-2vw', width: '104vw', height: '60vh',
          backgroundImage: 'url(/assets/supplied/road.png)',
          backgroundSize: '100% 100%', backgroundPosition: 'center bottom',
          animation: 'drift 60s linear infinite alternate'
        }}>
          
          {/* 6. CARS - Animated exactly along the road path! */}
          <div style={{ position: 'absolute', inset: 0 }}>
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               {/* Centerline Path mapping the visual road curve. Percentages used in CSS offset-path below. */}
             </svg>

             {/* Car 1: L-to-R */}
             <div style={{ position: 'absolute', left: '-4vw', top: '-3vw', offsetPath: 'path("M 0 550 C 300 550, 400 350, 600 550 S 800 750, 1000 650")', animation: 'carDrive 20s linear infinite' }}>
               <CarSprite isNight={isNight} isLtoR={true} carIndex={0} style={{ offsetRotate: 'auto 90deg' }} />
               <style>{`@keyframes carDrive { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }`}</style>
             </div>

             {/* Car 2: R-to-L */}
             <div style={{ position: 'absolute', left: '-4vw', top: '-3vw', offsetPath: 'path("M 1000 650 C 800 650, 700 850, 500 650 S 300 350, 0 450")', animation: 'carDrive 25s linear infinite', animationDelay: '-12s' }}>
               <CarSprite isNight={isNight} isLtoR={false} carIndex={3} style={{ offsetRotate: 'auto -90deg' }} />
             </div>
             
             {/* Car 3: L-to-R */}
             <div style={{ position: 'absolute', left: '-4vw', top: '-3vw', offsetPath: 'path("M 0 550 C 300 550, 400 350, 600 550 S 800 750, 1000 650")', animation: 'carDrive 22s linear infinite', animationDelay: '-5s' }}>
               <CarSprite isNight={isNight} isLtoR={true} carIndex={4} style={{ offsetRotate: 'auto 90deg' }} />
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
