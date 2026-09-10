import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ArinovaLoader = () => {
  const [loadingText, setLoadingText] = useState('Connecting to ARINOVA...');

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
        background: '#070810',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 9999
      }}
    >
      {/* Background Ambience */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(91, 108, 255, 0.04) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '40%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(52, 35, 79, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none', opacity: 0.5 }} />

      {/* Main Center Composition */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Orbital Rings & Logo */}
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          
          {/* Animated SVG Orbitals */}
          <motion.svg 
            width="120" height="120" viewBox="0 0 120 120" 
            style={{ position: 'absolute', inset: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(91, 108, 255, 0.15)" strokeWidth="1" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(91, 108, 255, 0.8)" strokeWidth="1.5" strokeDasharray="40 300" strokeLinecap="round" />
          </motion.svg>
          
          <motion.svg 
            width="120" height="120" viewBox="0 0 120 120" 
            style={{ position: 'absolute', inset: 0 }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          >
            <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(139, 108, 255, 0.1)" strokeWidth="1" />
            <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(139, 108, 255, 0.6)" strokeWidth="1.5" strokeDasharray="20 200" strokeLinecap="round" />
          </motion.svg>          {/* Animated Logo Glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(139, 108, 255, 0.4) 0%, transparent 70%)', filter: 'blur(10px)' }}
          />

          {/* ARINOVA Logo Center */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #252044 0%, #34234F 100%)',
              border: '1px solid rgba(139, 108, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 0 20px rgba(139, 108, 255, 0.1)'
            }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
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
          style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F2F3F7', letterSpacing: '0.2em', marginBottom: '16px' }}
        >
          ARINOVA
        </motion.div>

        {/* Status Text */}
        <div style={{ height: '24px', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: '0.85rem', color: '#9DA3B5', fontWeight: 500, letterSpacing: '0.05em', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
            >
              {loadingText}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Elegant Minimal Progress Bar */}
        <div style={{ marginTop: '24px', width: '160px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, #8B6CFF, transparent)', borderRadius: '2px' }}
          />
        </div>

      </div>
    </motion.div>
  );
};

