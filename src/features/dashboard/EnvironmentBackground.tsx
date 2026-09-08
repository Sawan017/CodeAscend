import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const EnvironmentBackground: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very smooth, fluid spring configuration for atmospheric parallax
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 40, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 40, mass: 2 });

  // Parallax layers (X and Y responsiveness)
  const distantX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const distantY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  const midX = useTransform(smoothX, [-0.5, 0.5], [30, -30]);
  const midY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

  const foreX = useTransform(smoothX, [-0.5, 0.5], [60, -60]);
  const foreY = useTransform(smoothY, [-0.5, 0.5], [25, -25]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };
    
    // Set initial parallax slightly off center
    mouseX.set(0.1);
    mouseY.set(0.05);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #F8FAFC 0%, #EFF6FF 100%)',
      pointerEvents: 'none'
    }}>
      
      {/* Sun Glow */}
      <motion.div style={{ x: distantX, y: distantY, position: 'absolute', top: '10%', right: '15%' }}>
        <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }} style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(253, 230, 138, 0.4) 0%, transparent 70%)', borderRadius: '50%' }} />
      </motion.div>

      {/* SVG Canvas covering the screen */}
      <svg
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#D1FAE5" />
          </linearGradient>
          <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>
          
          <filter id="haze">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* DISTANT MOUNTAINS */}
        <motion.g style={{ x: distantX, y: distantY }}>
          <motion.path
            animate={{ scaleY: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
            style={{ originY: '1024px' }}
            d="M-200 600 Q 150 400 300 550 T 650 420 T 1000 580 T 1500 450 L 1600 1200 L -200 1200 Z"
            fill="url(#distGrad)"
            opacity="0.7"
          />
        </motion.g>

        {/* MID LAYER MOUNTAINS */}
        <motion.g style={{ x: midX, y: midY }}>
          <motion.path
            animate={{ scaleY: [1, 1.015, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', delay: 2 }}
            style={{ originY: '1024px' }}
            d="M-200 700 Q 200 550 400 650 T 800 500 T 1200 680 T 1600 550 L 1600 1200 L -200 1200 Z"
            fill="url(#midGrad)"
            opacity="0.8"
          />
        </motion.g>

        {/* FOREGROUND HILLS & TERRAIN */}
        <motion.g style={{ x: foreX, y: foreY }}>
          <motion.path
            animate={{ scaleY: [1, 1.01, 1] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 1 }}
            style={{ originY: '1024px' }}
            d="M-200 850 Q 300 750 600 880 T 1100 780 T 1600 900 L 1600 1200 L -200 1200 Z"
            fill="url(#foreGrad)"
          />
          
          {/* RIVER */}
          <motion.path
            d="M 600 880 C 700 930, 500 980, 800 1150"
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="50"
            strokeLinecap="round"
          />

          {/* ROAD */}
          <motion.path
            d="M 400 860 C 500 930, 300 980, 500 1150"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <motion.path
            d="M 400 860 C 500 930, 300 980, 500 1150"
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="4"
            strokeDasharray="10 15"
          />

          {/* TREES (Foreground) */}
          <g fill="#059669">
            {/* Left cluster */}
            <motion.path animate={{ rotate: [0, 2, -1, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} style={{ originX: '200px', originY: '830px' }} d="M 200 760 L 215 830 L 185 830 Z" />
            <motion.path animate={{ rotate: [0, -1.5, 1, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }} style={{ originX: '230px', originY: '840px' }} d="M 230 770 L 245 840 L 215 840 Z" />
            <motion.path animate={{ rotate: [0, 1.5, -0.5, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }} style={{ originX: '170px', originY: '835px' }} d="M 170 780 L 182 835 L 158 835 Z" />
            
            {/* Right cluster */}
            <motion.path animate={{ rotate: [0, 2, -1, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }} style={{ originX: '1100px', originY: '790px' }} d="M 1100 720 L 1120 790 L 1080 790 Z" />
            <motion.path animate={{ rotate: [0, -2, 1, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }} style={{ originX: '1150px', originY: '810px' }} d="M 1150 740 L 1170 810 L 1130 810 Z" />
            <motion.path animate={{ rotate: [0, 1.5, -1, 0] }} transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.2 }} style={{ originX: '1050px', originY: '800px' }} d="M 1050 750 L 1065 800 L 1035 800 Z" />
            
            {/* Center-ish near river */}
            <motion.path animate={{ rotate: [0, 1.5, -1, 0] }} transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1.2 }} style={{ originX: '700px', originY: '920px' }} d="M 700 850 L 715 920 L 685 920 Z" />
          </g>
        </motion.g>

        {/* Ambient Foreground Fog */}
        <rect x="0" y="900" width="1440" height="124" fill="url(#foreGrad)" opacity="0.4" filter="url(#haze)" />
      </svg>
    </div>
  );
};
