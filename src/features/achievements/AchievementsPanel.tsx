import React, { useState } from 'react';
import { Trophy, Lock, Star, Target, Shield, Zap, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const card = {
  background: '#fff',
  borderRadius: '20px',
  border: '1px solid rgba(140, 135, 125, 0.12)',
  boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
  overflow: 'hidden'
} as const;

const sectionTitle = {
  fontSize: '0.85rem',
  fontWeight: 800 as const,
  color: '#5A5750',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        ...card, padding: '48px', position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #FEFCE8 100%)',
      }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#EAB308', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
            Hall of Fame
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Achievements
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#5A5750', lineHeight: 1.6, margin: '0 0 32px' }}>
            Your history of milestones, badges, and rewards. Unlock new tiers as you progress.
          </p>
        </div>
      </motion.div>

      {/* PROGRESS REWARDS (PRODUCTS) */}
      <h3 style={{ ...sectionTitle, marginTop: '12px' }}><Target size={16} color="#06B6D4" /> PROGRESS REWARDS</h3>
      
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: '1px solid',
              borderColor: activeCategory === c ? '#06B6D4' : 'rgba(140,135,125,0.2)',
              background: activeCategory === c ? 'rgba(6,182,212,0.1)' : 'transparent',
              color: activeCategory === c ? '#06B6D4' : '#5A5750',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredMilestones.map((milestone: any, i: number) => {
          const isEarned = milestone.isUnlocked;
          const progressPercentage = Math.min(100, Math.max(0, (milestone.progressValue / milestone.targetValue) * 100));
          const Icon = (LucideIcons as any)[milestone.icon] || Trophy;
          const tierColor = getTierColor(milestone.tier);
          
          return (
            <motion.div key={milestone.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              style={{
                ...card, padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start',
                background: isEarned ? '#fff' : '#FAFAFA',
                borderColor: isEarned ? `${tierColor}40` : 'rgba(140, 135, 125, 0.12)',
                opacity: isEarned ? 1 : 0.7
              }}
            >
              <div style={{ 
                width: 56, height: 56, borderRadius: '16px', flexShrink: 0,
                background: isEarned ? `${tierColor}15` : 'rgba(140,135,125,0.1)', 
                color: isEarned ? tierColor : '#9A958C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${isEarned ? `${tierColor}30` : 'transparent'}`
              }}>
                <Icon size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1E1D1B', fontWeight: 800 }}>{milestone.title}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#5A5750', lineHeight: 1.4 }}>{milestone.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#9A958C', textTransform: 'uppercase' }}>
                  <span>{milestone.tier || 'bronze'}</span>
                  <span>{Math.floor(milestone.progressValue)} / {milestone.targetValue}</span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: 'rgba(140,135,125,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercentage}%`, height: '100%', background: isEarned ? tierColor : '#9A958C', borderRadius: '4px' }} />
                </div>
                
                {isEarned && (
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#3EA354', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> Unlocked {milestone.dateUnlocked}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
        {filteredMilestones.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: '#9A958C' }}>No rewards found in this category.</div>
        )}
      </div>

      {/* EARNED ACHIEVEMENTS */}
      <h3 style={{ ...sectionTitle, marginTop: '24px' }}><Star size={16} color="#EAB308" /> UNLOCKED ACHIEVEMENTS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {earnedAchievements.map((ach: any, i: number) => (
          <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            onClick={() => onSelectAchievement?.(ach.id)}
            style={{ ...card, padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', borderColor: 'rgba(234,179,8,0.4)', background: '#FEFCE8' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(234,179,8,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = card.boxShadow; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(234,179,8,0.15)', color: '#EAB308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
              {ach.icon || '🏆'}
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1E1D1B', fontWeight: 800 }}>{ach.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#5A5750', lineHeight: 1.3 }}>{ach.description}</p>
              <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#EAB308', fontWeight: 700 }}>+{ach.xpReward || 50} XP</div>
            </div>
          </motion.div>
        ))}
        {earnedAchievements.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: '#9A958C' }}>No achievements unlocked yet.</div>
        )}
      </div>

      {/* EARNED BADGES */}
      <h3 style={{ ...sectionTitle, marginTop: '24px' }}><Trophy size={16} color="#EAB308" /> EARNED BADGES</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {earnedBadges.map((badge: any, i: number) => (
          <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            onClick={() => onSelectBadge?.(badge.id)}
            style={{ ...card, padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', background: 'linear-gradient(135deg, #ffffff 0%, #FEFCE8 100%)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(234,179,8,0.15)'; e.currentTarget.style.borderColor = 'rgba(234,179,8,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = card.boxShadow; e.currentTarget.style.borderColor = card.border.split(' ')[2]; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #FDE047, #EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 4px 12px rgba(234,179,8,0.3)', flexShrink: 0 }}>
              {badge.icon || '✨'}
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1E1D1B', fontWeight: 800 }}>{badge.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#5A5750', lineHeight: 1.3 }}>{badge.requirement}</p>
            </div>
          </motion.div>
        ))}
        {earnedBadges.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: '#9A958C' }}>No badges earned yet.</div>
        )}
      </div>
      
      {/* LOCKED ACHIEVEMENTS */}
      <h3 style={{ ...sectionTitle, marginTop: '24px' }}><Lock size={16} color="#9A958C" /> LOCKED ACHIEVEMENTS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {lockedAchievements.map((ach: any, i: number) => (
          <motion.div key={ach.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            style={{ ...card, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', background: '#FAFAFA', opacity: 0.8 }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(140,135,125,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A958C', flexShrink: 0, fontSize: '1.6rem' }}>
              {ach.icon || '🔒'}
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#5A5750', fontWeight: 800 }}>{ach.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A958C', lineHeight: 1.3 }}>{ach.unlockCondition}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LOCKED BADGES */}
      <h3 style={{ ...sectionTitle, marginTop: '24px' }}><Lock size={16} color="#9A958C" /> LOCKED BADGES</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {lockedBadges.map((badge: any, i: number) => (
          <motion.div key={badge.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            style={{ ...card, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', background: '#FAFAFA', opacity: 0.8 }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(140,135,125,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A958C', flexShrink: 0 }}>
              <Lock size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#5A5750', fontWeight: 800 }}>{badge.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A958C', lineHeight: 1.3 }}>{badge.requirement}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
