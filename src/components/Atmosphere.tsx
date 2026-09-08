import React from 'react';

// Position blobs distinctly to avoid milky mixing
const BLOBS = [
  // 1: Top Left - Blue
  { id: 1, size: '80vmax', top: '-30%', left: '-20%', anim: 'drift1', dur: '32s', var: '--mesh-1' },
  // 2: Bottom Left - Green/Teal
  { id: 2, size: '85vmax', top: '45%', left: '-10%', anim: 'drift2', dur: '40s', var: '--mesh-2' },
  // 3: Center Edge - Yellow/Crimson
  { id: 3, size: '75vmax', top: '15%', left: '35%', anim: 'drift3', dur: '35s', var: '--mesh-3' },
  // 4: Bottom Right - Orange/Amber
  { id: 4, size: '90vmax', top: '50%', left: '45%', anim: 'drift4', dur: '45s', var: '--mesh-4' },
  // 5: Top Right - Violet
  { id: 5, size: '85vmax', top: '-25%', left: '55%', anim: 'drift5', dur: '36s', var: '--mesh-5' },
  // 6: Edge - Cyan/Indigo
  { id: 6, size: '65vmax', top: '30%', left: '75%', anim: 'drift6', dur: '38s', var: '--mesh-6' }
];

const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: (Math.random() * 4 + 4) + 'px',
  top: (Math.random() * 120 - 10) + '%',
  left: (Math.random() * 120 - 10) + '%',
  dur: (Math.random() * 20 + 25) + 's',
  delay: (Math.random() * -40) + 's',
  colorVar: `--part-${(i % 4) + 1}`,
  anim: i % 2 === 0 ? 'floatUpRight' : 'floatUpLeft'
}));

export const Atmosphere = () => {
  return (
    <div className="atmosphere-layer">
      <div className="atmosphere-blobs">
        {BLOBS.map(b => (
          <div key={b.id} className="mesh-blob" style={{
            width: b.size, height: b.size, top: b.top, left: b.left,
            background: `radial-gradient(circle at center, var(${b.var}) 0%, transparent 55%)`,
            animation: `${b.anim} ${b.dur} infinite alternate ease-in-out`
          }} />
        ))}
      </div>
      <div className="atmosphere-particles">
        {PARTICLES.map(p => (
          <div key={p.id} className="mesh-particle" style={{
            width: p.size, height: p.size, top: p.top, left: p.left,
            background: `var(${p.colorVar})`,
            animation: `${p.anim} ${p.dur} infinite linear`,
            animationDelay: p.delay
          }} />
        ))}
      </div>
    </div>
  );
};
