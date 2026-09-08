import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Target, Lock, Award, Flame } from 'lucide-react';
import { BadgeArtwork } from './BadgeArtwork';

export const AchievementsPanel = ({ 
  achievements = [], 
  badges = [], 
  dynamicMilestones = [],
  onSelectAchievement,
  onSelectBadge 
}: any) => {

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Learning', 'Coding', 'Knowledge', 'XP', 'Streak', 'Exploration', 'Special'];

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'diamond': return '#00FFFF';
      case 'mythic': return '#FF00FF';
      default: return '#CD7F32';
    }
  }

  // 1. Unify all locked/progress items
  const lockedMilestones = dynamicMilestones.filter((m: any) => !m.isUnlocked);
  const lockedAchievementsList = achievements.filter((a: any) => !a.unlocked);
  const lockedStandaloneBadges = badges.filter((b: any) => !b.earned && !b.id.startsWith('badge-ach-'));

  const unifiedProgressItems = [
    ...lockedMilestones.map((m: any) => ({ ...m, type: 'milestone' })),
    ...lockedAchievementsList.map((a: any) => ({ ...a, type: 'achievement' })),
    ...lockedStandaloneBadges.map((b: any) => ({ ...b, type: 'badge' }))
  ].filter(item => activeCategory === 'All' || item.category === activeCategory || (activeCategory === 'Special' && !item.category));

  // 2. Unify all unlocked items for the main UNLOCKED ACHIEVEMENTS list
  const unlockedMilestones = dynamicMilestones.filter((m: any) => m.isUnlocked);
  const earnedAchievementsList = achievements.filter((a: any) => a.unlocked);
  const earnedStandaloneBadges = badges.filter((b: any) => b.earned && !b.id.startsWith('badge-ach-'));

  const unifiedUnlockedItems = [
    ...unlockedMilestones.map((m: any) => ({ ...m, type: 'milestone' })),
    ...earnedAchievementsList.map((a: any) => ({ ...a, type: 'achievement' })),
    ...earnedStandaloneBadges.map((b: any) => ({ ...b, type: 'badge' }))
  ].filter(item => activeCategory === 'All' || item.category === activeCategory || (activeCategory === 'Special' && !item.category));

  // 3. Unify ALL earned items to extract ONLY their badge icons for the EARNED BADGES visual grid
  const allEarnedIcons = badges.filter((b: any) => b.earned);
  
  const allMilestoneIcons = unlockedMilestones.map((m: any) => ({
    id: 'badge-m-' + m.id,
    title: m.title,
    image: m.image,
    tier: m.tier
  }));
  
  const combinedIconsMap = new Map();
  allEarnedIcons.forEach((b: any) => combinedIconsMap.set(b.id, b));
  allMilestoneIcons.forEach((m: any) => {
    if (!combinedIconsMap.has(m.id)) combinedIconsMap.set(m.id, m);
  });
  
  const finalIconsList = Array.from(combinedIconsMap.values());

  const sectionTitle = {
    fontSize: '0.85rem',
    fontWeight: 800,
    textTransform: 'uppercase' as any,
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ach-card {
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border);
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
        
        .ach-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px -6px rgba(0,0,0,0.2);
          border-color: var(--border-strong);
          z-index: 10;
        }

        .ach-card .badge-wrapper {
          transition: transform 0.3s ease;
        }
        .ach-card:hover .badge-wrapper {
          transform: scale(1.05) rotate(5deg);
        }

        .ach-card.locked {
          opacity: 0.6;
          filter: grayscale(100%);
          border-color: var(--border) !important;
          cursor: default;
        }
        .ach-card.locked:hover {
          transform: none;
          box-shadow: none;
          border-color: var(--border) !important;
        }
      ` }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
          padding: '40px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EAB308', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
              Hall of Fame
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Your Achievements
            </h1>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Track your progress and unlock legendary rewards.
            </p>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: '4px 12px', borderRadius: '16px',
                border: '1px solid',
                borderColor: activeCategory === c ? '#06B6D4' : 'var(--border-strong)',
                background: activeCategory === c ? 'rgba(6,182,212,0.1)' : 'transparent',
                color: activeCategory === c ? '#06B6D4' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 1. ACHIEVEMENT PROGRESS (ALL LOCKED/IN-PROGRESS ITEMS) */}
        <h3 style={{ ...sectionTitle, margin: 0 }}><Target size={16} color="#3B82F6" /> ACHIEVEMENT PROGRESS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {unifiedProgressItems.map((item: any, i: number) => {
            const hasProgress = item.targetValue !== undefined;
            const progressPercentage = hasProgress ? Math.min(100, Math.max(0, ((item.progressValue || 0) / item.targetValue) * 100)) : 0;
            
            return (
              <motion.div className="ach-card locked" key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }} style={{ alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <BadgeArtwork title={item.title} image={item.image} isLocked={true} size={64} tier={item.tier || 'bronze'} />
                </div>

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{item.title}</h4>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '2px 6px', background: 'var(--border)', borderRadius: '8px', flexShrink: 0 }}>
                      {item.tier || 'bronze'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{item.description || item.unlockCondition || item.requirement}</p>
                  
                  {hasProgress ? (
                    <React.Fragment>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        <span>{Math.floor(item.progressValue || 0)} / {item.targetValue}</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: progressPercentage + '%', height: '100%', background: '#9A958C', borderRadius: '2px' }} />
                      </div>
                    </React.Fragment>
                  ) : (
                    <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>+{item.xpReward || 50} XP</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Locked</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
          {unifiedProgressItems.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No achievements in progress.</div>
          )}
        </div>

        {/* 2. UNLOCKED ACHIEVEMENTS */}
        <h3 style={{ ...sectionTitle, marginTop: '16px' }}><Star size={16} color="#EAB308" /> UNLOCKED ACHIEVEMENTS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {unifiedUnlockedItems.map((item: any, i: number) => {
            const tColor = getTierColor(item.tier);
            const hasProgress = item.targetValue !== undefined;

            return (
            <motion.div className="ach-card" key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              onClick={() => onSelectAchievement?.(item.id)}
              style={{ borderColor: tColor + '40' }}
              >
              <div style={{ position: 'relative', flexShrink: 0, filter: 'drop-shadow(0 0 16px ' + tColor + '30)' }}>
                <BadgeArtwork title={item.title} image={item.image} isLocked={false} size={64} tier={item.tier || 'bronze'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.2 }}>{item.title}</h4>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: tColor, textTransform: 'uppercase', padding: '2px 6px', background: tColor + '15', borderRadius: '8px', flexShrink: 0 }}>
                    {item.tier || 'BRONZE'}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{item.description || item.unlockCondition || item.requirement}</p>
                <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#EAB308', fontWeight: 800 }}>+{item.xpReward || 50} XP</span>
                  <span style={{ color: '#3EA354', fontWeight: 700 }}>Unlocked {item.dateUnlocked || item.dateEarned || ''}</span>
                </div>
                {hasProgress && (
                  <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
                    <div style={{ width: '100%', height: '100%', background: tColor, borderRadius: '2px' }} />
                  </div>
                )}
              </div>
            </motion.div>
          )})}
          {unifiedUnlockedItems.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No achievements unlocked yet.</div>
          )}
        </div>

        {/* 3. EARNED BADGES (VISUAL ICONS ONLY) */}
        <h3 style={{ ...sectionTitle, marginTop: '16px' }}><Trophy size={16} color="#EAB308" /> EARNED BADGES</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {finalIconsList.map((badge: any, i: number) => {
            const tColor = getTierColor(badge.tier);
            return (
              <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => onSelectBadge?.(badge.id)}
                style={{ cursor: 'pointer', filter: 'drop-shadow(0 0 16px ' + tColor + '30)' }}
                title={badge.title}
              >
                <BadgeArtwork title={badge.title} image={badge.image} isLocked={false} size={80} tier={badge.tier || 'bronze'} />
              </motion.div>
            )
          })}
          {finalIconsList.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%' }}>No badges earned yet.</div>
          )}
        </div>
      </div>
    </>
  );
};
