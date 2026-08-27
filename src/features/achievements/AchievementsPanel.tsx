import React from 'react';
import { Trophy, Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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

export const AchievementsPanel = ({ achievements = [], badges = [], onSelectAchievement, onSelectBadge }: any) => {
  const earnedBadges = badges.filter((b: any) => b.earned);
  const lockedBadges = badges.filter((b: any) => !b.earned);
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
      <h3 style={sectionTitle}><Trophy size={16} color="#EAB308" /> EARNED BADGES</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {earnedBadges.map((badge: any, i: number) => (
          <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            onClick={() => onSelectBadge?.(badge)}
            style={{ ...card, padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', background: 'linear-gradient(135deg, #ffffff 0%, #FEFCE8 100%)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(234,179,8,0.15)'; e.currentTarget.style.borderColor = 'rgba(234,179,8,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = card.boxShadow; e.currentTarget.style.borderColor = card.border.split(' ')[2]; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #FDE047, #EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 4px 12px rgba(234,179,8,0.3)', flexShrink: 0 }}>
              {badge.icon || '🏆'}
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