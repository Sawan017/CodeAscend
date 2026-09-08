import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export const Environment2D: React.FC = () => {
  const [isNight, setIsNight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTheme = () => {
      const shell = document.querySelector('.app-shell');
      if (shell) {
        const isDark = shell.classList.contains('dark') || shell.classList.contains('midnight');
        setIsNight(isDark);
      }
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    const shell = document.querySelector('.app-shell');
    if (shell) observer.observe(shell, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      
      // Animate Parallax Layers
      gsap.to('.layer-10', { backgroundPositionX: '-=1000', duration: 180, repeat: -1, ease: 'none' }); // Sky
      gsap.to('.layer-09', { backgroundPositionX: '-=1000', duration: 150, repeat: -1, ease: 'none' });
      gsap.to('.layer-08', { backgroundPositionX: '-=1000', duration: 120, repeat: -1, ease: 'none' });
      gsap.to('.layer-07', { backgroundPositionX: '-=1000', duration: 90, repeat: -1, ease: 'none' });
      gsap.to('.layer-06', { backgroundPositionX: '-=1000', duration: 60, repeat: -1, ease: 'none' });
      gsap.to('.layer-04', { backgroundPositionX: '-=1000', duration: 40, repeat: -1, ease: 'none' });
      gsap.to('.layer-02', { backgroundPositionX: '-=1000', duration: 25, repeat: -1, ease: 'none' }); // Bushes
      gsap.to('.layer-01', { backgroundPositionX: '-=1000', duration: 20, repeat: -1, ease: 'none' }); // Mist
      
      // Particles
      gsap.to('.layer-05', { backgroundPositionX: '-=1000', duration: 100, repeat: -1, ease: 'none' });
      gsap.to('.layer-03', { backgroundPositionX: '-=1000', duration: 50, repeat: -1, ease: 'none' });

      // Cars
      gsap.fromTo('.car-1', { x: -300 }, { x: '110vw', duration: 12, repeat: -1, ease: 'none', delay: 2 });
      gsap.fromTo('.car-2', { x: -400 }, { x: '110vw', duration: 15, repeat: -1, ease: 'none', delay: 8 });
      gsap.to('.vehicle', { y: '-=3', duration: 0.15, yoyo: true, repeat: -1, ease: 'sine.inOut' });

      // Rotating overlay wheels
      gsap.to('.overlay-wheel', { rotation: 360, duration: 0.5, repeat: -1, ease: 'none' });

      // Night transition elements
      gsap.to('.night-overlay', { opacity: isNight ? 0.75 : 0, duration: 2.5, ease: 'sine.inOut' });
      gsap.to('.headlight', { opacity: isNight ? 0.8 : 0, duration: 2.5, ease: 'sine.inOut' });
      
    }, containerRef);
    return () => ctx.revert();
  }, [isNight]);

  return (
    <div ref={containerRef} className="env-container" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 0, pointerEvents: 'none', overflow: 'hidden', backgroundColor: '#818cf8'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .env-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-repeat: repeat-x;
          background-size: auto 100%;
          background-position-x: 0px;
          bottom: 0;
        }
        .vehicle-container {
          position: absolute;
          bottom: 12%; 
          left: 0;
          z-index: 10;
        }
        .vehicle {
          position: relative;
        }
        .car-img {
          height: 120px;
          width: auto;
        }
        .overlay-wheel {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1e293b;
          border: 3px dashed #64748b;
          bottom: 10px;
        }
        .headlight {
          position: absolute;
          right: -120px;
          bottom: 20px;
          width: 150px;
          height: 40px;
          background: linear-gradient(90deg, rgba(253,224,71,0.6) 0%, rgba(253,224,71,0) 100%);
          clip-path: polygon(0 40%, 100% 0, 100% 100%, 0 60%);
          opacity: 0;
        }
      `}} />

      {/* Layer 10: Sky */}
      <div className="env-layer layer-10" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/10_Sky.png")' }} />
      {/* Layer 09: Far Forest */}
      <div className="env-layer layer-09" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/09_Forest.png")' }} />
      {/* Layer 08 */}
      <div className="env-layer layer-08" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/08_Forest.png")' }} />
      {/* Layer 07 */}
      <div className="env-layer layer-07" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/07_Forest.png")' }} />
      {/* Layer 06 */}
      <div className="env-layer layer-06" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/06_Forest.png")' }} />
      
      {/* Layer 05: Particles */}
      <div className="env-layer layer-05" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/05_Particles.png")' }} />
      
      {/* Layer 04: Mid Forest */}
      <div className="env-layer layer-04" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/04_Forest.png")' }} />
      
      {/* Layer 03: Particles */}
      <div className="env-layer layer-03" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/03_Particles.png")' }} />

      {/* Cars driving on the path between bushes and forest */}
      <div className="vehicle-container car-1">
        <div className="vehicle">
          {/* Side view of Car 1 */}
          <img src="/assets/home-world/vehicles/cars/pack/car01/car01_0002.png" className="car-img" alt="car" />
          <div className="overlay-wheel" style={{ left: '30px' }} />
          <div className="overlay-wheel" style={{ left: '145px' }} />
          <div className="headlight" />
        </div>
      </div>

      <div className="vehicle-container car-2">
        <div className="vehicle">
          {/* Side view of Pickup Truck */}
          <img src="/assets/home-world/vehicles/cars/pack/pickupTruck01/pickuptruck01_0002.png" className="car-img" alt="truck" />
          <div className="overlay-wheel" style={{ left: '35px' }} />
          <div className="overlay-wheel" style={{ left: '160px' }} />
          <div className="headlight" />
        </div>
      </div>

      {/* Layer 02: Bushes (Foreground) */}
      <div className="env-layer layer-02" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/02_Bushes.png")', zIndex: 11 }} />
      
      {/* Layer 01: Mist (Foreground Over Everything) */}
      <div className="env-layer layer-01" style={{ backgroundImage: 'url("/assets/home-world/env/parallax-forest/blue/01_Mist.png")', opacity: 0.6, zIndex: 12 }} />

      {/* Night mode color filter / darkness overlay */}
      <div className="night-overlay" style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(to bottom, #020617 0%, #1e1b4b 60%, #064e3b 100%)',
        mixBlendMode: 'multiply',
        zIndex: 20
      }} />
    </div>
  );
};
