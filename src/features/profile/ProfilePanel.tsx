import React from 'react';
import { Settings, Shield, Star, BookOpen, Target, Trophy, Medal } from "lucide-react";
import type { UserProfile, Progression, Skill } from "../../types";

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

export function ProfilePanel({ profile, progression, skills, achievements, goals, badges, isCurrentUser, onEditProfile }: ProfilePanelProps) {
  const level = Math.floor((progression?.xp || 0) / 1000) + 1;
  const currentXp = progression?.xp || 0;
  const nextLevelXp = level * 1000;
  const progressPercent = Math.min(100, Math.max(0, (currentXp / nextLevelXp) * 100));

  const earnedAchievements = achievements ? achievements.filter((a: any) => a.unlocked) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Profile Header */}
      <div style={{ 
        background: 'var(--ca-surface, #ffffff)', 
        borderRadius: '16px', 
        border: '1px solid var(--border)', 
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {/* Banner Area */}
        <div style={{ 
          height: '140px', 
          background: profile.banner ? `url(${profile.banner}) center/cover` : 'linear-gradient(to right, var(--primary, #3b82f6), var(--ca-green, #0d9488))',
          position: 'relative'
        }} />
        
        {/* Profile Info */}
        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '-48px' }}>
            <div style={{ 
              width: '110px', 
              height: '110px', 
              borderRadius: '50%', 
              background: 'var(--ca-surface, #ffffff)', 
              border: '4px solid var(--ca-surface, #ffffff)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              color: 'var(--primary, #3b82f6)', 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: 10
            }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile.displayName?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>

            {isCurrentUser && (
              <button 
                onClick={onEditProfile}
                style={{ 
                  marginTop: '60px',
                  background: 'var(--ca-surface-alt, #f5f5f5)', 
                  color: 'var(--ca-text, #1E1D1B)', 
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  padding: '8px 16px',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-sunken)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ca-surface-alt, #f5f5f5)'}
              >
                <Settings size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--ca-text, #1E1D1B)' }}>
              {profile.displayName || 'Unknown User'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ca-text-muted, #9A958C)', fontSize: '0.95rem', flexWrap: 'wrap' }}>
              <span>@{profile.username || profile.arinova_id || profile.login_id || 'user'}</span>
              <span>•</span>
              <span style={{ color: 'var(--primary, #3b82f6)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                {profile.title || 'Developer'}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary, #3b82f6)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>
                Level {level}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ca-text-secondary, #5A5750)' }}>
                {currentXp} / {nextLevelXp} XP
              </span>
            </div>
            
            <div style={{ width: '100%', maxWidth: '300px', height: '6px', background: 'var(--ca-surface-raised, #e5e7eb)', borderRadius: '100px', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary, #3b82f6)', borderRadius: '100px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="profile-main-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', 
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* About / Bio */}
          <div style={{ background: 'var(--ca-surface, #ffffff)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ca-text, #1E1D1B)' }}>
              <BookOpen size={20} color="var(--primary, #3b82f6)" />
              About
            </h2>
            <p style={{ margin: 0, color: 'var(--ca-text-secondary, #5A5750)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {profile.bio || profile.introduction || "No bio provided yet."}
            </p>
          </div>

          {/* Combat Skills (Tech) */}
          <div style={{ background: 'var(--ca-surface, #ffffff)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ca-text, #1E1D1B)' }}>
              <Target size={20} color="var(--ca-green, #0d9488)" />
              Combat Skills (Tech)
            </h2>
            
            {skills && skills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {skills.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: 'var(--ca-text, #1E1D1B)' }}>
                      <span>{skill.name}</span>
                      <span style={{ color: 'var(--primary, #3b82f6)' }}>Lv. {Math.floor(skill.progress / 20) + 1}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--ca-surface-raised, #e5e7eb)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${skill.progress}%`, height: '100%', background: 'var(--ca-green, #0d9488)', borderRadius: '100px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ca-text-muted, #9A958C)' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 500 }}>No skills mastered yet</p>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Start learning to build your skill tree.</p>
              </div>
            )}
          </div>

          {/* Achievements / Accomplishments */}
          <div style={{ background: 'var(--ca-surface, #ffffff)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ca-text, #1E1D1B)' }}>
              <Trophy size={20} color="#eab308" />
              Achievements
            </h2>
            
            {earnedAchievements.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {earnedAchievements.map((ach: any) => (
                  <div key={ach.id} style={{ 
                    padding: '8px 16px', 
                    background: 'var(--surface-sunken)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--ca-text, #1E1D1B)'
                  }}>
                    <Medal size={16} color="#eab308" />
                    {ach.name || ach.title}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--ca-text-muted, #9A958C)' }}>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>No achievements unlocked yet.</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN / SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--ca-surface, #ffffff)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ca-text, #1E1D1B)' }}>
              <Shield size={20} color="var(--primary, #3b82f6)" />
              Adventurer Stats
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>
                  <Star size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ca-text, #1E1D1B)' }}>{progression?.streak || 0} days</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ca-text-secondary, #5A5750)' }}>Day Streak</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(13, 148, 136, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ca-green, #0d9488)' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ca-text, #1E1D1B)' }}>{skills?.length || 0}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ca-text-secondary, #5A5750)' }}>Skills Mastered</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary, #3b82f6)' }}>
                  <Target size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ca-text, #1E1D1B)' }}>{goals?.length || 0}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ca-text-secondary, #5A5750)' }}>Quests Done</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                  <Trophy size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ca-text, #1E1D1B)' }}>{badges?.length || progression?.badges || 0}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ca-text-secondary, #5A5750)' }}>Relics Earned</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .profile-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
