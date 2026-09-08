import React from 'react';
import { ChromaKeyImage } from '../../components/ChromaKeyImage';

// ARINOVA PREMIUM ORIGINAL BADGES
const defs = (content: string) => `<defs>\n${content}\n</defs>`;
const lg = (id: string, colors: string[], x1=0, y1=0, x2=0, y2=1) => 
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
  ${colors.map((c, i) => `<stop offset="${Math.round((i/(colors.length-1))*100)}%" stop-color="${c}" />`).join('\n')}
  </linearGradient>`;
const rg = (id: string, colors: string[]) => 
  `<radialGradient id="${id}">
  ${colors.map((c, i) => `<stop offset="${Math.round((i/(colors.length-1))*100)}%" stop-color="${c}" />`).join('\n')}
  </radialGradient>`;
const filterGlow = (id: string, color: string) => 
  `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="3" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
  </filter>`;

const rarityPals: Record<string, any> = {
  bronze: {
    base: ['#2A1610', '#5D3A1A', '#8E5A28'],
    metal: ['#B87333', '#CD7F32', '#E69A5C', '#CD7F32'],
    energy: ['#D35400', '#F39C12', '#FAD7A1'],
    accent: '#E67E22',
    glow: 'rgba(211, 84, 0, 0.6)'
  },
  silver: {
    base: ['#1A202C', '#2D3748', '#4A5568'],
    metal: ['#A0AEC0', '#CBD5E0', '#EDF2F7', '#CBD5E0'],
    energy: ['#3182CE', '#63B3ED', '#EBF8FF'],
    accent: '#90CDF4',
    glow: 'rgba(49, 130, 206, 0.6)'
  },
  gold: {
    base: ['#3E2700', '#744210', '#975A16'],
    metal: ['#D69E2E', '#ECC94B', '#FEFCBF', '#ECC94B'],
    energy: ['#DD6B20', '#F6E05E', '#FFFFF0'],
    accent: '#F6E05E',
    glow: 'rgba(221, 107, 32, 0.6)'
  },
  diamond: {
    base: ['#0A2540', '#153E75', '#2B6CB0'],
    metal: ['#4299E1', '#90CDF4', '#EBF8FF', '#90CDF4'],
    energy: ['#00B5D8', '#4FD1C5', '#E6FFFA'],
    accent: '#4FD1C5',
    glow: 'rgba(0, 181, 216, 0.6)'
  },
  mythic: {
    base: ['#2D1436', '#4A1C40', '#702459'],
    metal: ['#9F7AEA', '#D6BCFA', '#FAF5FF', '#D6BCFA'],
    energy: ['#ED64A6', '#F687B3', '#FFF5F7'],
    accent: '#F687B3',
    glow: 'rgba(237, 100, 166, 0.6)'
  }
};

export const BadgeArtwork = ({ title, image, isLocked = false, size = 64, tier = 'bronze' }: { title: string, image?: string, isLocked?: boolean, size?: number, tier?: string }) => {
  // Use AI Generated Images for these specific badges
  if (image) {
    return (
      <div style={{ 
        width: size, 
        height: size, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <ChromaKeyImage 
          src={image} 
          alt={title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            opacity: isLocked ? 0.4 : 1,
            filter: isLocked ? 'grayscale(80%)' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
          }} 
        />
        {isLocked && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            background: 'var(--bg-surface)',
            borderRadius: '50%',
            padding: '4px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            color: 'var(--text-secondary)'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        )}
      </div>
    );
  }

  const content = React.useMemo(() => {
    const pal = rarityPals[tier] || rarityPals.bronze;
    const id = title.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + tier;
    
    let customDefs = '';
    customDefs += lg(`base-${id}`, pal.base, 0, 0, 1, 1);
    customDefs += lg(`metal-${id}`, pal.metal, 0, 0, 1, 1);
    customDefs += lg(`metal-rev-${id}`, pal.metal, 1, 1, 0, 0);
    customDefs += rg(`en-${id}`, pal.energy);
    customDefs += filterGlow(`glow-${id}`, pal.glow);

    let paths = '';
    const t = title.toLowerCase();

    // === XP / ASCENSION / LEVEL SERIES ===
    if (t === 'the beginning') {
      paths += `<circle cx="50" cy="50" r="42" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<circle cx="50" cy="50" r="32" fill="none" stroke="url(#metal-rev-${id})" stroke-width="6" stroke-dasharray="10 5" />`;
      paths += `<path d="M 50 20 L 75 80 L 25 80 Z" fill="url(#en-${id})" opacity="0.8" />`;
      paths += `<circle cx="50" cy="65" r="12" fill="url(#metal-${id})" />`;
      paths += `<circle cx="50" cy="65" r="5" fill="url(#base-${id})" />`;
    }
    else if (t === 'rising star') {
      paths += `<path d="M 50 5 L 62 38 L 95 50 L 62 62 L 50 95 L 38 62 L 5 50 L 38 38 Z" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="3" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 50 25 L 56 44 L 75 50 L 56 56 L 50 75 L 44 56 L 25 50 L 44 44 Z" fill="url(#en-${id})" />`;
      paths += `<circle cx="50" cy="50" r="10" fill="url(#metal-rev-${id})" />`;
    }
    else if (t === 'dedicated') {
      paths += `<path d="M 15 20 L 50 5 L 85 20 L 85 55 C 85 80 50 95 50 95 C 50 95 15 80 15 55 Z" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="6" stroke-linejoin="round" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 30 35 L 70 35 L 70 50 C 70 70 50 80 50 80 C 50 80 30 70 30 50 Z" fill="url(#metal-rev-${id})" />`;
      paths += `<rect x="45" y="25" width="10" height="45" fill="url(#en-${id})" />`;
    }
    else if (t === 'high roller') {
      paths += `<polygon points="25,25 75,25 90,50 75,75 25,75 10,50" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<polygon points="35,35 65,35 75,50 65,65 35,65 25,50" fill="none" stroke="url(#en-${id})" stroke-width="6" />`;
      paths += `<circle cx="50" cy="50" r="14" fill="url(#metal-rev-${id})" />`;
      paths += `<circle cx="50" cy="50" r="6" fill="url(#en-${id})" />`;
    }
    else if (t === 'power user') {
      paths += `<circle cx="50" cy="50" r="44" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="5" filter="url(#glow-${id})"/>`;
      for(let i=0; i<8; i++) {
         const ang = i * Math.PI / 4;
         paths += `<line x1="50" y1="50" x2="${50 + Math.cos(ang)*40}" y2="${50 + Math.sin(ang)*40}" stroke="url(#metal-rev-${id})" stroke-width="4" />`;
      }
      paths += `<circle cx="50" cy="50" r="22" fill="url(#en-${id})" />`;
      paths += `<circle cx="50" cy="50" r="12" fill="url(#base-${id})" />`;
    }
    else if (t === 'ascended' || t === 'novice' || t === 'adept' || t === 'expert' || t === 'master' || t === 'grandmaster' || t === 'legendary') {
      const edges = t==='novice'? 3 : t==='adept'? 4 : t==='expert'? 5 : t==='master'? 6 : t==='grandmaster'? 8 : 12;
      let pts = '';
      for(let i=0; i<edges; i++) {
         const ang = i * Math.PI*2 / edges - Math.PI/2;
         pts += `${50 + Math.cos(ang)*45},${50 + Math.sin(ang)*45} `;
      }
      paths += `<polygon points="${pts.trim()}" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="${edges>6?3:5}" filter="url(#glow-${id})"/>`;
      
      let pts2 = '';
      for(let i=0; i<edges; i++) {
         const ang = i * Math.PI*2 / edges - Math.PI/2 + (Math.PI/edges);
         pts2 += `${50 + Math.cos(ang)*28},${50 + Math.sin(ang)*28} `;
      }
      paths += `<polygon points="${pts2.trim()}" fill="url(#metal-rev-${id})" opacity="0.9" />`;
      
      if (edges >= 6) {
         paths += `<circle cx="50" cy="50" r="16" fill="url(#en-${id})" />`;
         paths += `<path d="M 50 38 L 56 50 L 50 62 L 44 50 Z" fill="url(#base-${id})" />`;
      } else {
         paths += `<circle cx="50" cy="50" r="12" fill="url(#en-${id})" />`;
      }
      
      if (t === 'grandmaster' || t === 'legendary') {
         paths += `<path d="M 5 50 Q 20 20 40 40 Q 20 60 5 50 Z" fill="url(#metal-${id})" opacity="0.8"/>`;
         paths += `<path d="M 95 50 Q 80 20 60 40 Q 80 60 95 50 Z" fill="url(#metal-${id})" opacity="0.8"/>`;
      }
    }
    
    // === CODING SERIES ===
    else if (t.includes('monkey')) {
      paths += `<path d="M 20 40 C 20 10, 80 10, 80 40 C 95 45, 95 65, 80 70 C 75 90, 25 90, 20 70 C 5 65, 5 45, 20 40 Z" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 35 45 L 45 55 M 45 45 L 35 55" stroke="url(#en-${id})" stroke-width="4" stroke-linecap="round"/>`;
      paths += `<path d="M 65 45 L 55 55 M 55 45 L 65 55" stroke="url(#en-${id})" stroke-width="4" stroke-linecap="round"/>`;
      paths += `<path d="M 40 75 Q 50 85 60 75" fill="none" stroke="url(#metal-rev-${id})" stroke-width="4" stroke-linecap="round"/>`;
    }
    else if (t === 'it compiles!' || t === 'it compiles') {
      paths += `<rect x="15" y="20" width="70" height="60" rx="10" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="5" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 30 35 L 50 35 M 30 50 L 60 50" stroke="url(#metal-rev-${id})" stroke-width="4" stroke-linecap="round"/>`;
      paths += `<path d="M 45 65 L 60 80 L 90 40" fill="none" stroke="url(#en-${id})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-${id})"/>`;
    }
    else if (t.includes('squash') || t.includes('bug')) {
      paths += `<circle cx="50" cy="50" r="42" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 40 30 C 40 10, 60 10, 60 30 C 70 30, 80 40, 70 60 C 60 80, 40 80, 30 60 C 20 40, 30 30, 40 30 Z" fill="url(#metal-rev-${id})" />`;
      paths += `<line x1="20" y1="20" x2="80" y2="80" stroke="url(#en-${id})" stroke-width="8" stroke-linecap="round"/>`;
      paths += `<line x1="80" y1="20" x2="20" y2="80" stroke="url(#en-${id})" stroke-width="8" stroke-linecap="round"/>`;
    }
    else if (t.includes('logic master')) {
      paths += `<polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 25 50 L 50 25 L 75 50 L 50 75 Z" fill="url(#metal-rev-${id})" />`;
      paths += `<circle cx="50" cy="50" r="12" fill="url(#en-${id})" />`;
      paths += `<path d="M 50 5 L 50 25 M 50 75 L 50 95 M 5 50 L 25 50 M 75 50 L 95 50" stroke="url(#en-${id})" stroke-width="4" />`;
    }
    else if (t.includes('hello world') || t.includes('training') || t.includes('keyboard') || t.includes('hacker') || t.includes('software engineer') || t.includes('architect')) {
      paths += `<rect x="20" y="20" width="60" height="60" rx="8" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="5" filter="url(#glow-${id})"/>`;
      
      if (t.includes('keyboard')) {
        paths += `<rect x="30" y="40" width="40" height="20" rx="4" fill="url(#metal-rev-${id})" />`;
        paths += `<path d="M 20 30 L 80 70 M 20 70 L 80 30" stroke="url(#en-${id})" stroke-width="4" stroke-linecap="round"/>`;
      } else if (t.includes('hacker')) {
        paths += `<circle cx="35" cy="45" r="5" fill="url(#en-${id})" />`;
        paths += `<circle cx="65" cy="45" r="5" fill="url(#en-${id})" />`;
        paths += `<rect x="40" y="60" width="20" height="5" fill="url(#metal-rev-${id})" />`;
      } else if (t.includes('architect') || t.includes('engineer')) {
        paths += `<polygon points="50,25 75,75 25,75" fill="url(#metal-rev-${id})" />`;
        paths += `<circle cx="50" cy="50" r="10" fill="url(#en-${id})" />`;
      } else {
        paths += `<path d="M 35 40 L 25 50 L 35 60 M 65 40 L 75 50 L 65 60" fill="none" stroke="url(#en-${id})" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
        paths += `<path d="M 55 35 L 45 65" stroke="url(#metal-rev-${id})" stroke-width="4" stroke-linecap="round"/>`;
      }
    }
    
    // === STREAK SERIES ===
    else if (t === 'warming up' || t === 'on fire' || t === 'unbreakable' || t.includes('streak') || t.includes('devotion') || t.includes('century') || t.includes('year') || t.includes('learner')) {
      paths += `<path d="M 50 10 C 80 40, 90 70, 50 95 C 10 70, 20 40, 50 10 Z" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      
      if (t.includes('unbreakable') || t.includes('century') || t.includes('year')) {
         paths += `<polygon points="50,30 70,50 50,80 30,50" fill="url(#metal-rev-${id})" />`;
         paths += `<circle cx="50" cy="55" r="10" fill="url(#en-${id})" />`;
      } else {
         paths += `<path d="M 50 30 C 70 55, 75 75, 50 90 C 25 75, 30 55, 50 30 Z" fill="url(#en-${id})" opacity="0.9"/>`;
         paths += `<path d="M 50 50 C 60 65, 60 80, 50 85 C 40 80, 40 65, 50 50 Z" fill="url(#metal-rev-${id})" opacity="0.9"/>`;
      }
    }
    
    // === EXPLORATION SERIES ===
    else if (t.includes('curious') || t.includes('explorer') || t.includes('wanderer') || t.includes('pioneer') || t.includes('map') || t.includes('compass')) {
      paths += `<circle cx="50" cy="50" r="44" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="5" filter="url(#glow-${id})"/>`;
      paths += `<circle cx="50" cy="50" r="32" fill="none" stroke="url(#metal-rev-${id})" stroke-width="2" stroke-dasharray="5 5"/>`;
      paths += `<path d="M 50 15 L 60 40 L 85 50 L 60 60 L 50 85 L 40 60 L 15 50 L 40 40 Z" fill="url(#metal-rev-${id})" />`;
      paths += `<circle cx="50" cy="50" r="10" fill="url(#en-${id})" />`;
    }
    
    // === KNOWLEDGE SERIES ===
    else if (t.includes('master') || t.includes('grade') || t.includes('performer') || t.includes('achiever') || t.includes('student') || t.includes('flawless') || t.includes('sharpshooter') || t.includes('mind') || t.includes('omniscient')) {
      paths += `<path d="M 10 30 L 50 10 L 90 30 L 90 70 L 50 90 L 10 70 Z" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="5" filter="url(#glow-${id})"/>`;
      if (t.includes('omniscient') || t.includes('mind')) {
         paths += `<path d="M 25 50 C 25 20, 75 20, 75 50 C 75 80, 25 80, 25 50 Z" fill="none" stroke="url(#en-${id})" stroke-width="4"/>`;
         paths += `<circle cx="50" cy="50" r="12" fill="url(#metal-rev-${id})" />`;
      } else {
         paths += `<path d="M 30 55 L 45 70 L 75 35" fill="none" stroke="url(#en-${id})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    }
    // === SPECIAL / ALL ROUNDER ===
    else if (t.includes('consistency') || t.includes('rounder') || t.includes('perfectionist')) {
      paths += `<path d="M 50 5 L 90 25 L 90 75 L 50 95 L 10 75 L 10 25 Z" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<path d="M 50 15 L 80 30 L 80 70 L 50 85 L 20 70 L 20 30 Z" fill="url(#metal-rev-${id})" opacity="0.8"/>`;
      paths += `<circle cx="50" cy="50" r="15" fill="url(#en-${id})" />`;
    }

    // === FALLBACK ===
    else {
      paths += `<polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="url(#base-${id})" stroke="url(#metal-${id})" stroke-width="4" filter="url(#glow-${id})"/>`;
      paths += `<circle cx="50" cy="50" r="22" fill="url(#metal-rev-${id})" />`;
      paths += `<polygon points="50,35 60,60 40,60" fill="url(#en-${id})" />`;
    }
    
    // Add a nice top highlight for depth
    paths += `<path d="M 20 20 Q 50 5 80 20 Q 50 15 20 20 Z" fill="#FFFFFF" opacity="0.15" />`;

    return `<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">${defs(customDefs)}${paths}</svg>`;
  }, [title, tier]);

  return (
    <div 
      className="badge-artwork" 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative',
        opacity: isLocked ? 0.3 : 1,
        filter: isLocked ? 'grayscale(100%) brightness(0.7)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        style={{ width: '100%', height: '100%' }} 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
      {isLocked && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '6px',
            border: '1px solid rgba(255,255,255,0.2)', display: 'flex'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
