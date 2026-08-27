import { motion } from 'framer-motion';
import { Shield, Sparkles, Sword, Play, Check, MapPin, Lock, Compass, Code } from 'lucide-react';

export function GameDashboard({ profile, progression, skills }: any) {
  const safeProfile = profile || { displayName: 'Player' };
  const safeProgression = progression || { level: 1, xp: 0, streak: 1, achievements: 0 };
  const safeSkills = skills || [];
  
  const nextLevelXP = (safeProgression.level || 1) * 1000;
  const xpPercent = Math.min(100, Math.max(0, (safeProgression.xp / nextLevelXP) * 100));
  const masteredCount = safeSkills.filter((s:any)=>s.progress===100).length;

  return (
    <>
      {/* 1. PLAYER HUD PANEL */}
      <div className="ari-card ari-hud interactive">
         <div className="hud-identity">
            <div className="hud-avatar">
               <span>{safeProfile.displayName.charAt(0)}</span>
            </div>
            <div>
               <div className="hud-name">{safeProfile.displayName}</div>
               <div className="hud-title">Level {safeProgression.level} · Explorer</div>
            </div>
         </div>
         
         <div className="hud-xp">
            <div className="xp-top">
               <span>XP Progression</span>
               <span><strong>{safeProgression.xp.toLocaleString()}</strong> / {nextLevelXP.toLocaleString()} XP</span>
            </div>
            <div className="xp-middle">
               <span className="xp-label">LV {safeProgression.level}</span>
               <div className="xp-track">
                  <motion.div className="xp-fill" initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
               </div>
               <div className="xp-milestone" />
               <span className="xp-label" style={{color: 'var(--text-muted)'}}>LV {safeProgression.level + 1}</span>
            </div>
         </div>
         
         <div className="hud-stats">
            <div className="hud-stat">
               <div className="hud-stat-val">{safeProgression.streak}</div>
               <div className="hud-stat-label"><Play size={14} fill="var(--color-accent)" color="var(--color-accent)"/> Day Streak</div>
            </div>
            <div className="hud-stat">
               <div className="hud-stat-val">{safeProgression.achievements}</div>
               <div className="hud-stat-label"><Sparkles size={14} fill="var(--color-primary)" color="var(--color-primary)"/> Relics</div>
            </div>
         </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="ari-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
         
         {/* LEFT COLUMN: HERO JOURNEY & QUESTS */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* CURRENT JOURNEY */}
            <div className="ari-card journey-card interactive">
               <span className="journey-eyebrow">Current Expedition</span>
               <h1 className="journey-title">JavaScript</h1>
               
               <div className="journey-stats">
                  <span><strong>45%</strong> Mastery</span>
                  <span><strong>{masteredCount}</strong> Skills</span>
                  <span><strong>3</strong> Quests</span>
               </div>
               
               {/* Exploration Route */}
               <div className="journey-path-container">
                  
                  <div className="journey-node-wrapper">
                     <div className="journey-node completed"><Check size={18} strokeWidth={3} /></div>
                     <span className="node-label">Basics</span>
                  </div>
                  
                  <div className="journey-line completed" />
                  
                  <div className="journey-node-wrapper">
                     <div className="journey-node current"><div className="inner-dot" /></div>
                     <span className="node-label">Objects</span>
                  </div>
                  
                  <div className="journey-line active">
                     <div className="journey-traveler" />
                  </div>
                  
                  <div className="journey-node-wrapper">
                     <div className="journey-node locked"><Lock size={16} strokeWidth={2.5} /></div>
                     <span className="node-label locked">Async</span>
                  </div>

               </div>
               
               <button className="ari-btn">
                  <Compass size={22} /> Continue Adventure
               </button>
            </div>

            {/* ACTIVE QUESTS */}
            <div>
               <h3 className="ari-header">Active Quests</h3>
               <div className="quest-list">
                  <div className="quest-item">
                     <div className="quest-info">
                        <span className="quest-title"><div className="quest-dot"/> Portfolio Architecture</span>
                        <span className="quest-meta"><Code size={14} /> React + CSS</span>
                     </div>
                     <span className="quest-status active">In Progress</span>
                  </div>
                  <div className="quest-item">
                     <div className="quest-info">
                        <span className="quest-title"><div className="quest-dot" style={{backgroundColor: 'var(--text-muted)'}}/> Algorithm Visualizer</span>
                        <span className="quest-meta"><Code size={14} /> C++</span>
                     </div>
                     <span className="quest-status">Planning</span>
                  </div>
               </div>
            </div>
            
         </div>

         {/* RIGHT COLUMN: ADVENTURE JOURNAL & RELICS */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* ADVENTURE JOURNAL */}
            <div className="ari-card">
               <h3 className="ari-header">Adventure Journal</h3>
               <div className="journal-timeline">
                  
                  <div className="journal-entry">
                     <div className="journal-icon success"><Check size={16} strokeWidth={3} /></div>
                     <div className="journal-content">
                        <span className="journal-title">Mastered JavaScript Basics</span>
                        <span className="journal-time">Today</span>
                     </div>
                  </div>
                  
                  <div className="journal-entry">
                     <div className="journal-icon normal"><Check size={16} strokeWidth={3} /></div>
                     <div className="journal-content">
                        <span className="journal-title">Completed Interactive Form</span>
                        <span className="journal-time">Yesterday</span>
                     </div>
                  </div>
                  
                  <div className="journal-entry">
                     <div className="journal-icon reward"><Sparkles size={16} strokeWidth={2.5} /></div>
                     <div className="journal-content">
                        <span className="journal-title">Unlocked First Step Relic</span>
                        <span className="journal-time">3 days ago</span>
                     </div>
                  </div>

               </div>
            </div>

            {/* RELIC COLLECTION */}
            <div className="ari-card">
               <h3 className="ari-header">Relic Collection</h3>
               <div className="relics-grid">
                  
                  <div className="relic-card">
                     <div className="relic-icon-wrapper unlocked-gold">
                        <Shield size={32} strokeWidth={1.5} />
                     </div>
                     <span className="relic-name">Defender</span>
                  </div>
                  
                  <div className="relic-card">
                     <div className="relic-icon-wrapper unlocked-blue">
                        <Sword size={32} strokeWidth={1.5} />
                     </div>
                     <span className="relic-name">Striker</span>
                  </div>
                  
                  <div className="relic-card">
                     <div className="relic-icon-wrapper">
                        <MapPin size={32} strokeWidth={1.5} />
                     </div>
                     <span className="relic-name">Pioneer</span>
                  </div>

               </div>
            </div>

         </div>

      </div>
    </>
  );
}
