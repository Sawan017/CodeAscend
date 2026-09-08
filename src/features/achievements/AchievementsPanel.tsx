import { BadgeArtwork } from './BadgeArtwork';
import React, { useState } from 'react';
import { Trophy, Lock, Star, Target, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const sectionTitle = {
  fontSize: '0.85rem',
  fontWeight: 800 as const,
  color: 'var(--text-main)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const getTierColor = (tier: string = 'bronze') => {
  switch(tier.toLowerCase()) {
    case 'bronze': return '#06B6D4' // Cyan
    case 'silver': return '#94A3B8' // Slate
    case 'gold': return '#F59E0B'   // Amber
    case 'diamond': return '#38BDF8' // Sky
    case 'mythic': return '#C084FC'  // Purple
    default: return '#06B6D4'
  }
}

export const AchievementsPanel = ({ 
  achievements = [], 
  badges = [], 
  dynamicMilestones = [], 
  onSelectAchievement, 
  onSelectBadge 
}: any) => {
  const earnedBadges = badges.filter((b: any) => b.earned);
  const lockedBadges = badges.filter((b: any) => !b.earned);
  
  const earnedAchievements = achievements.filter((a: any) => a.unlocked);
  const lockedAchievements = achievements.filter((a: any) => !a.unlocked);

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Learning', 'Coding', 'Knowledge', 'XP', 'Streak', 'Exploration', 'Special'];
  
  const filteredMilestones = dynamicMilestones.filter((m: any) => 
    activeCategory === 'All' ? true : m.category === activeCategory
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ach-card {
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid rgba(140, 135, 125, 0.12);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          overflow: hidden;
          position: relative;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          cursor: pointer;
        }
        
        .ach-card.locked {
          background: var(--bg-surface);
          opacity: 0.85;
        }
        
        .ach-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px -6px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.15);
          z-index: 10;
        }

        .ach-card .badge-wrapper {
          transition: transform 0.3s ease;
        }
        .ach-card:hover .badge-wrapper {
          transform: scale(1.03);
        }
      ` }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid rgba(140, 135, 125, 0.12)', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
          padding: '40px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EAB308', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
              Hall of Fame
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Achievements
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
              Your history of milestones, badges, and rewards. Unlock new tiers as you progress.
            </p>
          </div>
        </motion.div>

        {/* PROGRESS REWARDS */}
        <h3 style={{ ...sectionTitle, marginTop: '12px' }}><Target size={16} color="#06B6D4" /> PROGRESS REWARDS</h3>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: '4px 12px', borderRadius: '16px',
                border: '1px solid',
                borderColor: activeCategory === c ? '#06B6D4' : 'var(--border-strong)',
                background: activeCategory === c ? 'rgba(6,182,212,0.1)' : 'transparent',
                color: activeCategory === c ? '#06B6D4' : '#5A5750',
                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredMilestones.map((milestone: any, i: number) => {
            const isEarned = milestone.isUnlocked;
            const progressPercentage = Math.min(100, Math.max(0, (milestone.progressValue / milestone.targetValue) * 100));
            const tierColor = getTierColor(milestone.tier);
            
            return (
              <motion.div className={`ach-card ${!isEarned ? 'locked' : ''}`} key={milestone.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} style={{ borderColor: isEarned ? `${tierColor}40` : undefined, alignItems: 'flex-start' }}>
                
                {/* LEFT: Badge */}
                <div style={{ position: 'relative', flexShrink: 0, filter: isEarned ? `drop-shadow(0 0 16px ${tierColor}30)` : 'none' }}>
                  <BadgeArtwork title={milestone.title} image={milestone.image} isLocked={!isEarned} size={64} tier={milestone.tier} />
                  
                </div>

                {/* RIGHT: Info & Progress */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{milestone.title}</h4>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: tierColor, textTransform: 'uppercase', padding: '2px 6px', background: `${tierColor}15`, borderRadius: '8px', flexShrink: 0 }}>
                      {milestone.tier || 'bronze'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{milestone.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#9A958C' }}>
                    <span>{Math.floor(milestone.progressValue)} / {milestone.targetValue}</span>
                    {isEarned && <span style={{ color: '#3EA354' }}>Unlocked {milestone.dateUnlocked}</span>}
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercentage}%`, height: '100%', background: isEarned ? tierColor : '#9A958C', borderRadius: '2px' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
          {filteredMilestones.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: '#9A958C', fontSize: '0.9rem' }}>No rewards found in this category.</div>
          )}
        </div>

        {/* EARNED ACHIEVEMENTS */}
        <h3 style={{ ...sectionTitle, marginTop: '16px' }}><Star size={16} color="#EAB308" /> UNLOCKED ACHIEVEMENTS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {earnedAchievements.map((ach: any, i: number) => {
            const tColor = getTierColor(ach.tier);
            return (
            <motion.div className="ach-card" key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              onClick={() => onSelectAchievement?.(ach.id)}
              style={{ borderColor: `${tColor}40` }}
              >
              <div style={{ position: 'relative', flexShrink: 0, filter: `drop-shadow(0 0 16px ${tColor}30)` }}>
                <BadgeArtwork title={ach.title} image={ach.image} isLocked={false} size={64} tier={ach.tier} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{ach.title}</h4>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: tColor, textTransform: 'uppercase', padding: '2px 6px', background: `${tColor}15`, borderRadius: '8px', flexShrink: 0 }}>
                    {ach.tier || 'BRONZE'}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{ach.description}</p>
                <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#EAB308', fontWeight: 800 }}>+{ach.xpReward || 50} XP</span>
                  <span style={{ color: '#3EA354', fontWeight: 700 }}>Unlocked</span>
                </div>
              </div>
            </motion.div>
          )
        })}
          {earnedAchievements.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: '#9A958C', fontSize: '0.9rem' }}>No achievements unlocked yet.</div>
          )}
        </div>

        {/* EARNED BADGES */}
        <h3 style={{ ...sectionTitle, marginTop: '16px' }}><Trophy size={16} color="#EAB308" /> EARNED BADGES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {earnedBadges.map((badge: any, i: number) => {
            const tColor = getTierColor(badge.tier);
            return (
            <motion.div className="ach-card" key={badge.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              onClick={() => onSelectBadge?.(badge.id)}
              style={{ borderColor: `${tColor}40` }}
              >
              <div style={{ position: 'relative', flexShrink: 0, filter: `drop-shadow(0 0 16px ${tColor}30)` }}>
                <BadgeArtwork title={badge.title} image={badge.image} isLocked={false} size={64} tier={badge.tier} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{badge.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{badge.requirement}</p>
              </div>
            </motion.div>
          )})}
          {earnedBadges.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: '#9A958C', fontSize: '0.9rem' }}>No badges earned yet.</div>
          )}
        </div>
        
        {/* LOCKED ACHIEVEMENTS */}
        <h3 style={{ ...sectionTitle, marginTop: '16px' }}><Lock size={16} color="#9A958C" /> LOCKED ACHIEVEMENTS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {lockedAchievements.map((ach: any, i: number) => {
            return (
            <motion.div className="ach-card locked" key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <BadgeArtwork title={ach.title} image={ach.image} isLocked={true} size={64} tier={ach.tier} />
                
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{ach.title}</h4>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9A958C', textTransform: 'uppercase', padding: '2px 6px', background: 'var(--border)', borderRadius: '8px', flexShrink: 0 }}>
                    {ach.tier || 'BRONZE'}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#9A958C', lineHeight: 1.3 }}>{ach.unlockCondition}</p>
                <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9A958C', fontWeight: 800 }}>+{ach.xpReward || 50} XP</span>
                  <span style={{ color: '#9A958C', fontWeight: 700 }}>Locked</span>
                </div>
              </div>
            </motion.div>
          )
        })}
        </div>

        {/* LOCKED BADGES */}
        <h3 style={{ ...sectionTitle, marginTop: '16px' }}><Lock size={16} color="#9A958C" /> LOCKED BADGES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {lockedBadges.map((badge: any, i: number) => (
            <motion.div className="ach-card locked" key={badge.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <BadgeArtwork title={badge.title} image={badge.image} isLocked={true} size={64} tier={badge.tier} />
                
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{badge.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#9A958C', lineHeight: 1.3 }}>{badge.requirement}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

