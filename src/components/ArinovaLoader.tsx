import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ArinovaLoader = ({ theme = 'dark' }: { theme?: string }) => {
  const [loadingText, setLoadingText] = useState('Connecting to ARINOVA...');
  
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
  const radial1 = isDark ? 'rgba(91, 108, 255, 0.04)' : 'rgba(91, 95, 239, 0.04)';
  const radial2 = isDark ? 'rgba(33, 23, 47, 0.06)' : 'rgba(124, 92, 252, 0.03)';
  const gridColor = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.02)';
  
  // Orbitals
  const orbitTrack = isDark ? 'rgba(139, 108, 255, 0.12)' : 'rgba(91, 95, 239, 0.15)';
  const orbitAccent = isDark ? '#8B6CFF' : '#5B5FEF';
  
  // Logo center
  const logoBg = isDark ? 'linear-gradient(135deg, #181432 0%, #21172F 100%)' : 'linear-gradient(135deg, #EEEAF8 0%, #E0D4F5 100%)';
  const logoBorder = isDark ? 'rgba(139, 108, 255, 0.25)' : 'rgba(91, 95, 239, 0.2)';
  const logoColor = isDark ? '#ffffff' : '#1E1B4B';
  const logoGlowBox = isDark ? '0 12px 32px rgba(0,0,0,0.6), inset 0 0 24px rgba(139, 108, 255, 0.15)' : '0 12px 32px rgba(91,95,239,0.15), inset 0 0 24px rgba(255, 255, 255, 0.6)';
  const behindGlow = isDark ? 'rgba(139, 108, 255, 0.4)' : 'rgba(91, 95, 239, 0.25)';

  // Text
  const textBrand = isDark ? '#F2F3F7' : '#1E1B4B';
  const textStatus = isDark ? '#82899E' : '#64748B';
  
  // Progress bar
  const progressTrack = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const progressFill = isDark ? 'linear-gradient(90deg, transparent, #8B6CFF, #6574FF, transparent)' : 'linear-gradient(90deg, transparent, #5B5FEF, #7C5CFC, transparent)';

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

      {/* Main Center Composition */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Orbital Rings & Logo Area */}
        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          
          {/* Animated SVG Orbital - ONE clean elegant track */}
          <svg 
            width="200" height="200" viewBox="0 0 200 200" 
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            {/* Base Complete Orbit */}
            <circle cx="100" cy="100" r="86" fill="none" stroke={orbitTrack} strokeWidth="2" />
            
            {/* Traveling Accent */}
            <motion.circle 
              cx="100" cy="100" r="86" 
              fill="none" 
              stroke={orbitAccent} 
              strokeWidth="3" 
              strokeDasharray="140 400" 
              strokeLinecap="round" 
              style={{ originX: '50%', originY: '50%' }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
          </svg>

          {/* Animated Logo Glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: '90px', height: '90px', background: `radial-gradient(circle, ${behindGlow} 0%, transparent 70%)`, filter: 'blur(16px)' }}
          />

          {/* ARINOVA Logo Center - Slightly Larger */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              width: '80px', height: '80px',
              background: logoBg,
              border: `1px solid ${logoBorder}`,
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: logoColor, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px',
              boxShadow: logoGlowBox,
              position: 'relative'
            }}
          >
            <motion.span
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
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
          style={{ fontSize: '2.4rem', fontWeight: 800, color: textBrand, letterSpacing: '0.3em', marginBottom: '40px' }}
        >
          ARINOVA
        </motion.div>

        {/* Status Text Container */}
        <div style={{ height: '24px', position: 'relative', marginBottom: '24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '1.05rem', color: textStatus, fontWeight: 500, letterSpacing: '0.05em', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
            >
              {loadingText}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Horizontal Progress Bar */}
        <div style={{ width: '280px', height: '3px', background: progressTrack, borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ x: ['0%', '150%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', repeatType: 'reverse' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: progressFill, borderRadius: '3px' }}
          />
        </div>

      </div>
    </motion.div>
  );
};
