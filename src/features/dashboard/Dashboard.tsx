import { HeroScenery } from './HeroScenery';
import { PATHWAY_REGISTRY, SKILL_REGISTRY } from '../../data/learningData';
import React, { Component } from 'react';
class DashErrorBoundary extends Component<any, any> {
  state = { error: null };
  static getDerivedStateFromError(error: any) { return { error }; }
  render() {
    if (this.state.error) {
      return <div style={{padding: '50px', background: 'red', color: 'white', zIndex: 9999, position: 'relative'}}>
        <h1>DASHBOARD CRASHED</h1>
        <pre>{this.state.error.message}</pre>
        <pre>{this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

import { Star, Map, Zap, ArrowRight, Award, BookOpen, Flame, Lock, Compass, Folder, Target, Mountain, Sun, Cloud, TreePine, MessageSquare, Check, Plus, Trophy, X, Search } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../lib/animations";
import type { Progression, Goal, UserProfile, Route } from "../../types";
import { calculateProgressToNextLevel } from "../../lib/progression";

type DashboardProps = {
  profile: UserProfile;
  progression: Progression;
  goals: Goal[];
  onNavigate: (route: Route) => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  projects?: any;
  skills?: any;
  badges?: any;
  achievements?: any;
  friendState?: any;
  chatState?: any;
  incomingRequestsCount?: any;
  unreadMessagesCount?: any;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const card = {
  background: 'var(--bg-surface)',
  borderRadius: '20px',
  border: '1px solid var(--border)',
  boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)',
  overflow: 'hidden'
} as const;

const sectionTitle = {
  fontSize: '0.85rem',
  fontWeight: 800 as const,
  color: 'var(--text-secondary)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

function DashboardInner({
  profile, progression, goals, onNavigate,
  projects = [], skills = [], badges = [], achievements = []
, onUpdateProfile}: DashboardProps) {
  const { level, currentXp, progress, requiredXp } = calculateProgressToNextLevel(progression?.xp || 0);

  const [showSkillPicker, setShowSkillPicker] = React.useState(false);
  const [skillSearch, setSkillSearch] = React.useState('');
  
  const activeSkill = (skills || []).find((s: any) => s.status === 'IN_PROGRESS' || s.status === 'NOT_STARTED');
  // Pinned skills replacing topSkills
  const resolveSkillName = (s: any): string => {
    const rawName = s.name?.trim();
    if (rawName && rawName !== 'Unknown Skill' && rawName !== 'Unnamed Skill') return rawName;
    if (s.canonicalName && s.canonicalName.trim() !== '') return s.canonicalName;
    if (s.id) {
       const reg = SKILL_REGISTRY.find(r => r.id === s.id);
       if (reg && reg.canonicalName) return reg.canonicalName;
       if (reg && (reg as any).name) return (reg as any).name;
    }
    return '';
  };

  const enrichedSkills = (skills || []).map((s: any) => ({
    ...s,
    displayName: resolveSkillName(s)
  }));

  const eligibleSkills = enrichedSkills.filter((s: any) => {
    if ((s.progress || 0) <= 0) return false;
    if (!s.displayName) return false; // Filter out completely unknown/unresolvable skills
    const isDomain = PATHWAY_REGISTRY.some(p => 
      p.id === s.id || 
      p.id === s.canonicalName ||
      p.name.toLowerCase() === s.displayName.toLowerCase() ||
      (p.aliases && p.aliases.includes(s.displayName.toLowerCase()))
    );
    return !isDomain;
  });

  const _rawPinned = profile.pinnedSkills === undefined ? eligibleSkills.slice(0, 5).map((s: any) => s.id) : profile.pinnedSkills;
  
  const pinnedSkillIds = _rawPinned.filter((id: string) => {
    const s = enrichedSkills.find((sk: any) => sk.id === id);
    if (!s) return !PATHWAY_REGISTRY.some(p => p.id === id);
    if (!s.displayName) return false;
    return !PATHWAY_REGISTRY.some(p => 
      p.id === s.id || 
      p.id === s.canonicalName ||
      p.name.toLowerCase() === s.displayName.toLowerCase() ||
      (p.aliases && p.aliases.includes(s.displayName.toLowerCase()))
    );
  }).slice(0, 5);
  
  const pinnedSkillsData = pinnedSkillIds.map((id: string) => {
    const activeData = enrichedSkills.find((s: any) => s.id === id);
    if (activeData) return { id, name: activeData.displayName, progress: activeData.progress || 0 };
    const registryData = SKILL_REGISTRY.find(s => s.id === id);
    return { id, name: registryData ? (registryData.canonicalName || (registryData as any).name || id) : id, progress: 0 };
  }).filter(data => data.name && data.name !== 'Unknown Skill' && data.name !== 'Unnamed Skill');
  
  const handlePinSkill = (id: string) => {
    if (onUpdateProfile && !pinnedSkillIds.includes(id) && pinnedSkillIds.length < 5) {
      onUpdateProfile({ pinnedSkills: [...pinnedSkillIds, id] });
    }
    setShowSkillPicker(false);
  };
  
  const handleUnpinSkill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateProfile) {
      onUpdateProfile({ pinnedSkills: pinnedSkillIds.filter(pid => pid !== id) });
    }
  };
  const activeProjects = (projects || []).filter((p: any) => p.status !== 'COMPLETED');
  
  const unlockedAchievements = (achievements || []).filter((a: any) => a.unlocked).map((a: any) => ({
    id: a.id, title: a.title, description: a.description || a.unlockCondition, icon: a.icon, date: a.unlockedAt || a.dateUnlocked, type: 'achievement'
  }));
  const unlockedBadges = (badges || []).filter((b: any) => b.earned).map((b: any) => ({
    id: b.id, title: b.title, description: b.requirement || b.description, icon: b.icon, date: b.unlockedAt || b.dateEarned, type: 'badge'
  }));
  const recentUnlocks = [...unlockedAchievements, ...unlockedBadges].sort((a, b) => {
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
  });
  
  const totalBadgesAndAchievements = recentUnlocks.length;
  
  const totalProjectsCount = (projects || []).length;
  const totalGoalsCount = (goals || []).length;

  return (
    <motion.div
      className="rpg-page-container"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}
    >
      <style>{`
        .dashboard-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; }
        .compact-stats { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; padding: 20px 32px; gap: 16px; }
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .stat-divider { display: none; }
          .compact-stats { justify-content: center; gap: 32px; }
        }
        @media (max-width: 768px) {
          .hero-landscape { display: none; }
        }

        .dashboard-grid > div > div.transparent-header {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          border: none !important;
          padding-bottom: 4px !important;
          backdrop-filter: none !important;
        }
        .dashboard-grid > div > div.transparent-header:hover {
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* ─── HERO ─── */}
      <motion.div variants={fadeInUp} className="card-animated-border" style={{ ...card, '--card-accent': '#1677E8', padding: '48px', position: 'relative' } as React.CSSProperties}>
                <HeroScenery />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1677E8', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
            {getGreeting()}, {profile?.displayName || "Developer"} 👋
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Ready to ascend?
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 32px' }}>
            Keep learning, building, and expanding your knowledge. Your next adventure is waiting.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate({ view: 'learning' })}
              style={{
                background: '#2E8B57', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(46,139,87,0.3)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(46,139,87,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(62,163,84,0.3)'; }}
            >
              Continue Learning <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate({ view: 'learning' })}
              style={{
                background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)',
                padding: '12px 28px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F7F7F2'; e.currentTarget.style.color = '#1E1D1B'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              Explore Skills
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── PLAYER STATS ─── */}
      <motion.div variants={fadeInUp} style={{ ...card, '--card-accent': '#1677E8' } as React.CSSProperties} className="compact-stats card-animated-border">
                {[
          { label: 'Experience', value: currentXp, icon: <Zap size={22} />, color: '#1677E8', bg: 'rgba(22,119,232,0.15)' },
          { label: 'Streak', value: (progression?.streak || 0) || 0, icon: <Flame size={22} />, color: '#2583D8', bg: 'rgba(37,131,216,0.15)' },
          { label: 'Badges', value: totalBadgesAndAchievements, icon: <Award size={22} />, color: '#3A8FD8', bg: 'rgba(58,143,216,0.15)' },
          { label: 'Projects', value: totalProjectsCount, icon: <Folder size={22} />, color: '#1976D2', bg: 'rgba(25,118,210,0.15)' },
          { label: 'Goals', value: totalGoalsCount, icon: <Target size={22} />, color: '#2166C1', bg: 'rgba(33,102,193,0.15)' },
        ].map((stat, i, arr) => (
          <React.Fragment key={stat.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            </div>
            {i < arr.length - 1 && <div className="stat-divider" style={{ width: '1px', height: '40px', background: 'var(--border)' }} />}
          </React.Fragment>
        ))}
      </motion.div>

      {/* ─── EXPERIENCE BAR ─── */}
      <motion.div variants={fadeInUp} className="card-animated-border" style={{ ...card, '--card-accent': '#1677E8', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '24px' } as React.CSSProperties}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', flexShrink: 0 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="34" fill="none" stroke="var(--border-strong)" strokeWidth="4" opacity="0.15" />
            <motion.circle 
              cx="36" cy="36" r="34" fill="none" stroke="url(#xp-ring-gradient)" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100) }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="xp-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1976D2" />
                <stop offset="100%" stopColor="#1677E8" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1976D2, #1677E8)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(22,119,232,0.3)',
            position: 'relative', zIndex: 1
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.9, lineHeight: 1, marginBottom: '2px' }}>LVL</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{level}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <span>Experience Progress</span>
            <span style={{ color: '#1677E8' }}>{currentXp} <span style={{ color: 'var(--text-muted)' }}>/ {requiredXp} XP</span> ({Math.round(progress)}%)</span>
          </div>
          <div style={{ height: '12px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: progress + '%' }} transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #1976D2, #1677E8)', borderRadius: '6px' }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── MAIN GRID ROW 1 ─── */}
      <div className="dashboard-grid">
        {/* Continue Learning */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={sectionTitle}><BookOpen size={16} color="#2E8B57" /> CONTINUE LEARNING</h3>
          <div className="card-animated-border" style={{ ...card, '--card-accent': '#2E8B57', overflow: 'visible', position: 'relative', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } as React.CSSProperties}>
            

            {activeSkill ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(46,139,87,0.1)', color: '#2E8B57', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1677E8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>CURRENT PATHWAY</div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{activeSkill.name}</h4>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <span>Level {activeSkill.level || 1}</span>
                    <span style={{ color: 'var(--text-main)' }}>{activeSkill.progress || 0}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
                    <div style={{ width: (activeSkill.progress || 0) + '%', height: '100%', background: '#3B82F6', borderRadius: '4px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={16} color="#1677E8" fill="#FDE047" /> Earn up to +250 XP
                  </span>
                  <button onClick={() => onNavigate({ view: 'learning' })} style={{
                    background: 'rgba(46,139,87,0.1)', color: '#2E8B57', border: 'none',
                    padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2E8B57'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,139,87,0.1)'; e.currentTarget.style.color = '#2E8B57'; }}
                  >Resume <ArrowRight size={16} /></button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(22,119,232,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1677E8' }}>
                  <BookOpen size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Ready to start learning?</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', maxWidth: '280px' }}>Choose a skill from the academy and begin your journey.</p>
                <button onClick={() => onNavigate({ view: 'learning' })} style={{
                  background: '#3B82F6', color: '#fff', border: 'none', padding: '12px 28px',
                  borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '12px',
                  boxShadow: '0 4px 14px rgba(59,130,246,0.3)'
                }}>Browse Skills</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={sectionTitle}><Folder size={16} color="#1677E8" /> ACTIVE PROJECTS</h3>
          <div className="card-animated-border" style={{ ...card, '--card-accent': '#1976D2', overflow: 'visible', position: 'relative', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: activeProjects.length > 0 ? 'flex-start' : 'center' } as React.CSSProperties}>
            

            {activeProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                {activeProjects.slice(0, 3).map((project: any) => (
                  <div key={project.id} style={{
                    padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-card)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                    onClick={() => onNavigate({ view: 'projects' })}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(22,119,232,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(22,119,232,0.1)', color: '#1677E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Folder size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{project.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{project.techStack?.slice(0, 3).join(' • ') || 'Project'}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1677E8', background: 'rgba(22,119,232,0.1)', padding: '4px 10px', borderRadius: '8px' }}>IN PROGRESS</span>
                  </div>
                ))}
                {activeProjects.length > 3 && (
                   <button onClick={() => onNavigate({ view: 'projects' })} style={{
                     marginTop: 'auto', background: 'transparent', border: '1px solid var(--border)', padding: '10px',
                     borderRadius: '10px', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                   }}>View All Projects</button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(22,119,232,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1677E8' }}>
                  <Folder size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>No active projects yet.</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', maxWidth: '280px' }}>Start building something and turn your ideas into XP.</p>
                <button onClick={() => onNavigate({ view: 'projects' })} style={{
                  background: 'rgba(22,119,232,0.1)', color: '#1677E8', border: 'none', padding: '12px 28px',
                  borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '12px',
                }}>Explore Projects</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ─── MAIN GRID ROW 2 ─── */}
      <div className="dashboard-grid">
        {/* Skill Mastery */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="transparent-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '4px' }}>
            <h3 style={sectionTitle}><Star size={16} color="#8B5CF6" /> SKILL MASTERY</h3>
            {pinnedSkillIds.length >= 5 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }} title="Maximum of 5 skills can be pinned. Unpin a skill to add another.">Max 5 skills pinned</span>
            ) : (
              <button onClick={() => setShowSkillPicker(true)} style={{ background: 'transparent', border: 'none', color: '#8B5CF6', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add Skill
              </button>
            )}
          </div>
          
          <div style={{ ...card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            {pinnedSkillsData.length > 0 ? (
              pinnedSkillsData.map((skill: any, idx: number) => (
                <div key={skill.id} style={{ display: "flex", flexDirection: "column", gap: "12px", cursor: "pointer", transition: "all 0.2s" }} onClick={() => onNavigate({ view: "skill_detail", id: skill.id })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={18} />
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{skill.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{skill.progress}%</span>
                      <button onClick={(e) => handleUnpinSkill(skill.id, e)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} title="Unpin skill">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: skill.progress + '%', height: '100%', background: '#8B5CF6', borderRadius: '4px' }} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '16px 0', justifyContent: 'center', flex: 1 }}>
                <div style={{ width: 56, height: 56, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                  <Star size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>No skills to show yet.</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', maxWidth: '240px' }}>Start learning a skill and it will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Recent Achievements */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="transparent-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '4px' }}>
            <h3 style={sectionTitle}><Trophy size={16} color="#3B82F6" /> RECENT ACHIEVEMENTS</h3>
          </div>
          <div style={{ ...card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            {recentUnlocks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                {recentUnlocks.slice(0, 3).map((unlock: any, idx: number) => (
                  <div key={unlock.id + idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                      {unlock.icon || '🏆'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{unlock.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{unlock.description}</div>
                    </div>
                  </div>
                ))}
                {recentUnlocks.length > 3 && (
                   <button onClick={() => onNavigate({ view: 'achievements' })} style={{
                     marginTop: 'auto', background: 'transparent', border: '1px solid var(--border)', padding: '12px',
                     borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                   }}>View All Achievements</button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '16px 0', justifyContent: 'center', flex: 1 }}>
                <div style={{ width: 56, height: 56, background: 'rgba(59,130,246,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                  <Trophy size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Your first achievement is waiting.</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', maxWidth: '240px' }}>Complete a milestone to unlock it.</p>
                <button onClick={() => onNavigate({ view: 'achievements' })} style={{
                  background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'none', padding: '12px 28px',
                  borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '8px',
                }}>View Achievements</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Skill Picker Modal */}
      {showSkillPicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowSkillPicker(false)}>
          <div style={{ background: 'var(--bg-surface)', width: '100%', maxWidth: '440px', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '70vh', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-sunken)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Add Skill</h3>
              <button onClick={() => setShowSkillPicker(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-base)', borderRadius: '12px', padding: '0 16px', border: '1px solid var(--border)' }}>
                <Search size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search skills..." 
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {eligibleSkills.filter((s: any) => s.displayName.toLowerCase().includes(skillSearch.toLowerCase())).map((s: any) => {
                const isPinned = pinnedSkillIds.includes(s.id);
                return (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{s.displayName}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{s.progress || 0}% Progress</span>
                      </div>
                    </div>
                    {isPinned ? (
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B5CF6', padding: '6px 12px', background: 'rgba(139,92,246,0.1)', borderRadius: '6px' }}>Pinned</span>
                    ) : (
                      <button onClick={() => handlePinSkill(s.id)} style={{ background: 'transparent', border: '1px solid #8B5CF6', color: '#8B5CF6', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Pin</button>
                    )}
                  </div>
                )
              })}
              {eligibleSkills.filter((s: any) => s.displayName.toLowerCase().includes(skillSearch.toLowerCase())).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.9rem' }}>
                  No skills available to pin yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}

export function Dashboard(props: DashboardProps) {
  return <DashErrorBoundary><DashboardInner {...props} /></DashErrorBoundary>;
}







