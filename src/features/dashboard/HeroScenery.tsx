import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Mountain, TreePine } from 'lucide-react';
import './HeroScenery.css';

export const HeroScenery = () => {
  const [weather, setWeather] = useState<'clear' | 'cloudy'>('clear');

  useEffect(() => {
    const states: ('clear' | 'cloudy')[] = ['clear', 'cloudy'];
    const durations = [35000, 25000]; // Smooth 60s cycle
    let step = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const next = () => {
      setWeather(states[step]);
      timeout = setTimeout(() => {
        step = (step + 1) % states.length;
        next();
      }, durations[step]);
    };
    
    next();
    return () => clearTimeout(timeout);
  }, []);

  const stars = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    top: Math.random() * 60 + '%',
    left: Math.random() * 100 + '%',
    size: Math.random() * 2 + 1 + 'px',
    delay: Math.random() * 5 + 's',
    dur: Math.random() * 3 + 2 + 's'
  }));

  return (
    <div className={`hero-landscape weather-${weather}`}>
      {/* Z=0: Base Glows */}
      <div className="hero-glow glow-1" />
      <div className="hero-glow glow-2" />

      {/* Z=2: Night Sky Stars */}
      <div className="scenery-stars">
        {stars.map(s => (
          <div key={s.id} className="scenery-star" style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur
          }} />
        ))}
      </div>

      {/* Z=3: Sun/Moon (BEHIND CLOUDS) */}
      <div className="celestial-body-container">
        <Sun size={90} className="scenery-sun" />
        <div className="scenery-moon" />
      </div>

      {/* Z=4: Clouds (IN FRONT OF SUN/MOON) */}
      <div className="scenery-clouds">
        <Cloud size={70} className="scenery-cloud cloud-1" />
        <Cloud size={50} className="scenery-cloud cloud-2" />
        <Cloud size={85} className="scenery-cloud cloud-3" />
        <Cloud size={45} className="scenery-cloud cloud-4" />
      </div>

      {/* Z=5: Mountains */}
      <div className="scenery-mountains">
        <Mountain size={180} className="scenery-mountain mountain-1" />
        <Mountain size={220} className="scenery-mountain mountain-2" />
      </div>

      {/* Z=6: Trees */}
      <div className="scenery-trees">
        <TreePine size={70} className="scenery-tree tree-1" />
        <TreePine size={50} className="scenery-tree tree-2" />
        <TreePine size={90} className="scenery-tree tree-3" />
        <TreePine size={60} className="scenery-tree tree-4" />
      </div>
    </div>
  );
};
