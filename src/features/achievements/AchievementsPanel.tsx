import React from 'react';
import { Star, Shield, Lock } from 'lucide-react';

export const AchievementsPanel = ({ achievements = [], badges = [] }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div><h1 className="game-title">RELIC COLLECTION</h1><p className="game-body" style={{marginTop: "8px"}}>View your earned relics and trophies.</p></div>

      <div className="rpg-panel">
        <h3 className="rpg-subtitle">UNLOCKED RELICS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {badges.filter((b: any) => b.earned).map((badge: any) => (
            <div key={badge.id} className="game-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', borderTop: `4px solid ${badge.rarity === 'Legendary' ? '#FBBF24' : badge.rarity === 'Epic' ? '#C084FC' : badge.rarity === 'Rare' ? '#38BDF8' : '#4ADE80'}` }}>
              <div style={{ fontSize: '3rem' }}>{badge.icon || '🛡️'}</div>
              <div>
                <div style={{ fontWeight: 'bold', color: "var(--text-main)", fontSize: '0.9rem' }}>{badge.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '4px' }}>{badge.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rpg-panel" style={{ opacity: 0.7 }}>
        <h3 className="rpg-subtitle">UNDISCOVERED RELICS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {badges.filter((b: any) => !b.earned).map((badge: any) => (
            <div key={badge.id} className="game-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', filter: 'grayscale(1)' }}>
              <Lock size={24} color="rgba(255,255,255,0.2)" />
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>???</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};