import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ArinovaLoader = ({ theme = 'dark' }: { theme?: string }) => {
  const [loadingText, setLoadingText] = useState('Connecting to ARINOVA...');
  
  // Bug 2 Fix: Accurately determine if the theme is dark, even for 'system'
  const [isSystemDark, setIsSystemDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme]);

  const isDark = theme === 'dark' || theme === 'midnight' || theme === 'aurora' || (theme === 'system' && isSystemDark);

  // --- Theme Variables ---
  const bgMain = isDark ? '#070810' : '#F8F8FC';
  
  // Radials
  const radial1 = isDark ? 'rgba(91, 108, 255, 0.05)' : 'rgba(91, 95, 239, 0.04)';
  const radial2 = isDark ? 'rgba(52, 35, 79, 0.06)' : 'rgba(124, 92, 252, 0.03)';
  const gridColor = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.02)';
  
  // Orbitals
  const orbit1Track = isDark ? 'rgba(91, 108, 255, 0.15)' : 'rgba(91, 95, 239, 0.15)';
  const orbit1Accent = isDark ? 'rgba(91, 108, 255, 0.8)' : 'rgba(91, 95, 239, 0.8)';
  const orbit2Track = isDark ? 'rgba(139, 108, 255, 0.1)' : 'rgba(124, 92, 252, 0.15)';
  const orbit2Accent = isDark ? 'rgba(139, 108, 255, 0.6)' : 'rgba(124, 92, 252, 0.7)';
  
  // Logo center
  const logoBg = isDark ? 'linear-gradient(135deg, #252044 0%, #34234F 100%)' : 'linear-gradient(135deg, #EEEAF8 0%, #E0D4F5 100%)';
  const logoBorder = isDark ? 'rgba(139, 108, 255, 0.2)' : 'rgba(124, 92, 252, 0.2)';
  const logoColor = isDark ? '#fff' : '#5B5FEF';
  const logoGlowBox = isDark ? '0 8px 24px rgba(0,0,0,0.5), inset 0 0 20px rgba(139, 108, 255, 0.1)' : '0 8px 24px rgba(91,95,239,0.15), inset 0 0 20px rgba(255, 255, 255, 0.5)';
  const behindGlow = isDark ? 'rgba(139, 108, 255, 0.4)' : 'rgba(91, 95, 239, 0.25)';

  // Text
  const textBrand = isDark ? '#F2F3F7' : '#1E1B4B';
  const textStatus = isDark ? '#9DA3B5' : '#64748B';
  
  // Progress bar
  const progressTrack = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const progressFill = isDark ? 'linear-gradient(90deg, transparent, #8B6CFF, transparent)' : 'linear-gradient(90deg, transparent, #5B5FEF, transparent)';

  useEffect(() => {
    const texts = [
      'Establishing secure connection...',
      'Syncing neural progress...',
      'Preparing your workspace...',
      'Almost ready...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="premium-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: bgMain,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 9999
      }}
    >
      {/* Background Ambience */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', background: `radial-gradient(circle, ${radial1} 0%, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '25%', left: '35%', width: '700px', height: '700px', background: `radial-gradient(circle, ${radial2} 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '64px 64px', pointerEvents: 'none' }} />

      {/* Main Center Composition - Increased size and spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Orbital Rings & Logo Area */}
        <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
          
          {/* Animated SVG Orbitals */}
          <motion.svg 
            width="160" height="160" viewBox="0 0 160 160" 
            style={{ position: 'absolute', inset: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
          >
            <circle cx="80" cy="80" r="74" fill="none" stroke={orbit1Track} strokeWidth="1" />
            <circle cx="80" cy="80" r="74" fill="none" stroke={orbit1Accent} strokeWidth="2" strokeDasharray="50 350" strokeLinecap="round" />
          </motion.svg>
          
          <motion.svg 
            width="160" height="160" viewBox="0 0 160 160" 
            style={{ position: 'absolute', inset: 0 }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
          >
            <circle cx="80" cy="80" r="60" fill="none" stroke={orbit2Track} strokeWidth="1" />
            <circle cx="80" cy="80" r="60" fill="none" stroke={orbit2Accent} strokeWidth="2" strokeDasharray="30 250" strokeLinecap="round" />
          </motion.svg>

          {/* Animated Logo Glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: '80px', height: '80px', background: `radial-gradient(circle, ${behindGlow} 0%, transparent 70%)`, filter: 'blur(12px)' }}
          />

          {/* ARINOVA Logo Center */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              width: '64px', height: '64px',
              background: logoBg,
              border: `1px solid ${logoBorder}`,
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: logoColor, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px',
              boxShadow: logoGlowBox,
              position: 'relative'
            }}
          >
            <motion.span
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              AR
            </motion.span>
          </motion.div>
        </div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: '2.2rem', fontWeight: 800, color: textBrand, letterSpacing: '0.25em', marginBottom: '24px' }}
        >
          ARINOVA
        </motion.div>

        {/* Status Text Container - Proper spacing and no overlapping */}
        <div style={{ height: '30px', position: 'relative', marginBottom: '32px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '0.95rem', color: textStatus, fontWeight: 500, letterSpacing: '0.05em', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
            >
              {loadingText}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bug 1 Fix: Animated loader reaches end of track */}
        <div style={{ width: '200px', height: '3px', background: progressTrack, borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            initial={{ left: '-40%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            style={{ position: 'absolute', top: 0, width: '40%', height: '100%', background: progressFill, borderRadius: '3px' }}
          />
        </div>

      </div>
    </motion.div>
  );
};
