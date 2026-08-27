import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Moon, Sun } from 'lucide-react';

export const GameShell = ({ children, currentRoute, onNavigate, notifications = 0, messages = 0, onSettingsOpen, onNotificationsOpen, unreadNotificationsCount = 0 }: any) => {
  const [isRaining, setIsRaining] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('arinova_theme');
    if (saved === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    const triggerRain = () => {
      setIsRaining(true);
      setTimeout(() => setIsRaining(false), 120000); 
    };

    const initialTimeout = setTimeout(() => {
      triggerRain();
      setInterval(triggerRain, 600000);
    }, 10000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('arinova_theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('arinova_theme', 'light');
    }
  };

  const navs = [
    { id: 'dashboard', label: 'Home' },
    { id: 'learning', label: 'Cultivation' },
    { id: 'projects', label: 'Quests' },
    { id: 'goals', label: 'Trials' },
    { id: 'achievements', label: 'Relics' },
    { id: 'friends', label: 'Network', badge: notifications },
    { id: 'chat', label: 'Chat', badge: messages },
    { id: 'future', label: 'Future' },
    { id: 'career_world', label: 'Career' },
  ];

  return (
    <div className={`ari-app ${isRaining ? 'weather-rain' : ''}`}>
      
      {/* =========================================
          LIVING WORLD BACKGROUND (Miniature, Subtle)
          ========================================= */}
      <div className="ari-world-bg">
        {/* Night Sky Elements (Only visible in .dark) */}
        <div className="world-night-sky">
          <div className="world-moon" />
          <div className="world-stars-tiny" />
        </div>

        {/* Tiny Miniature Town / Roads at the bottom distance */}
        <div className="world-miniature-stage">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="world-miniature-svg">
            <path className="world-ground-line" d="M0,80 Q250,75 500,85 T1000,80" />
            
            {/* Tiny background structures (very low contrast) */}
            <rect className="world-tiny-building" x="150" y="65" width="8" height="15" rx="1" />
            <polygon className="world-tiny-building" points="148,65 154,58 160,65" />
            
            <rect className="world-tiny-building" x="420" y="70" width="12" height="15" rx="1" />
            <rect className="world-tiny-building" x="435" y="60" width="10" height="25" rx="1" />
            
            <rect className="world-tiny-building" x="780" y="68" width="14" height="12" rx="1" />
            <polygon className="world-tiny-building" points="778,68 787,60 796,68" />
            
            {/* Tiny trees */}
            <circle className="world-tiny-tree" cx="280" cy="75" r="4" />
            <circle className="world-tiny-tree" cx="285" cy="78" r="3" />
            
            <circle className="world-tiny-tree" cx="600" cy="76" r="5" />
            <circle className="world-tiny-tree" cx="608" cy="79" r="3.5" />
            <circle className="world-tiny-tree" cx="592" cy="78" r="3" />

            {/* Road Paths for Animation */}
            <path id="mini-road" d="M -20,85 Q 250,80 500,90 T 1020,85" fill="none" />
            
            {/* Moving Cars */}
            <g className="mini-car car-red">
              <rect x="-3" y="-1.5" width="6" height="3" rx="1" />
              <circle className="mini-headlight" cx="3" cy="0" r="4" />
            </g>
            <g className="mini-car car-blue">
              <rect x="-3" y="-1.5" width="6" height="3" rx="1" />
              <circle className="mini-headlight" cx="3" cy="0" r="4" />
            </g>
            <g className="mini-car car-yellow" style={{ animationDirection: 'reverse' }}>
              <rect x="-3" y="-1.5" width="6" height="3" rx="1" />
              <circle className="mini-headlight" cx="-3" cy="0" r="4" />
            </g>

            {/* Walking People (Day Only) */}
            <g className="mini-person p-1"><circle cx="0" cy="-2" r="1.5" /></g>
            <g className="mini-person p-2" style={{ animationDirection: 'reverse' }}><circle cx="0" cy="-2" r="1.5" /></g>
            <g className="mini-person p-3"><circle cx="0" cy="-2" r="1.5" /></g>
          </svg>
        </div>
      </div>

      {/* =========================================
          UI LAYER (Acrylic Glassmorphism)
          ========================================= */}
      
      {/* TOP NAVIGATION */}
      <header className="ari-nav">
         <div className="ari-brand">
            <div className="ari-logo"></div>
            ARINOVA
         </div>
         
         <nav className="ari-nav-links">
            {navs.map(n => {
              const isActive = currentRoute === n.id;
              return (
                <button 
                   key={n.id}
                   onClick={() => onNavigate({view: n.id})}
                   className={`ari-nav-item ${isActive ? 'active' : ''}`}
                >
                   {n.label}
                   {n.badge && n.badge > 0 && (
                     <span className="ari-badge">{n.badge}</span>
                   )}
                </button>
              );
            })}
         </nav>

         <div className="ari-nav-actions">
            <button onClick={toggleTheme} className="ari-icon-btn" title="Toggle Day / Night">
               {theme === 'light' ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
            </button>
            <button onClick={onNotificationsOpen} className="ari-icon-btn">
               <Bell size={20} strokeWidth={2.5} />
               {unreadNotificationsCount > 0 && <span className="ari-dot" />}
            </button>
            <button onClick={onSettingsOpen} className="ari-icon-btn">
               <Settings size={20} strokeWidth={2.5} />
            </button>
         </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="ari-viewport">
         <AnimatePresence mode="wait">
            <motion.div 
               key={currentRoute} 
               initial={{ opacity: 0, y: 15 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -15 }} 
               transition={{ duration: 0.3, ease: "easeOut" }} 
               style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
               {children}
            </motion.div>
         </AnimatePresence>
      </main>

    </div>
  );
};
