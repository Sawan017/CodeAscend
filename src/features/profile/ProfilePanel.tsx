import React from 'react';
import { Settings, Shield, Star, BookOpen, Target } from "lucide-react";
import type { UserProfile, Progression, Skill, Achievement, Goal, Badge } from "../../types";

type ProfilePanelProps = {
  profile: UserProfile;
  progression: Progression;
  skills: Skill[];
  achievements?: any;
  goals?: any;
  badges?: any;
  isCurrentUser: boolean;
  onEditProfile: () => void;
};

export function ProfilePanel({ profile, progression, skills, isCurrentUser, onEditProfile }: ProfilePanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Profile Header */}
      <div className="game-panel" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-secondary)', border: '4px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)', overflow: 'hidden' }}>
          {profile.avatar ? <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profile.displayName.charAt(0).toUpperCase()}
        </div>
        
        <div style={{ flex: 1 }}>
          <h1 className="game-title">{profile.displayName}</h1>
          <p className="game-body" style={{ color: 'var(--accent-blue)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px' }}>{profile.title || 'Developer'}</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Level {Math.floor(progression.xp / 1000) + 1}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{progression.xp} XP</span>
          </div>
        </div>

        {isCurrentUser && (
          <button className="game-btn-primary" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onEditProfile}>
            <Settings size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Skills Overview */}
        <div className="game-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} color="var(--accent-blue)" />
            <h2 className="game-section-title">Combat Skills (Tech)</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skills.slice(0, 4).map(skill => (
              <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>{skill.name}</span>
                  <span style={{ color: 'var(--accent-blue)' }}>Lv. {Math.floor(skill.progress / 20) + 1}</span>
                </div>
                <div style={{ width: '100%', height: 8, background: 'var(--bg-main)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <div style={{ width: `${skill.progress}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Activity */}
        <div className="game-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={24} color="var(--accent-gold)" />
            <h2 className="game-section-title">Adventurer Stats</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{progression.streak || 0}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Day Streak</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{progression.badges || 0}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Relics Earned</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{skills.length}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Skills Mastered</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>12</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quests Done</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
