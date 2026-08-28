
import React, { Component } from 'react';
class DashErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
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

import { Star, Map, Zap, ArrowRight, Award, BookOpen, Flame, Lock, Compass, Folder, Target, Mountain, Sun, Cloud, TreePine, MessageSquare, Check, Plus, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../lib/animations";
import type { Progression, Goal, UserProfile, Route } from "../../types";
import { calculateProgressToNextLevel } from "../../lib/progression";

type DashboardProps = {
  profile: UserProfile;
  progression: Progression;
  goals: Goal[];
  onNavigate: (route: Route) => void;
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

function DashboardInner({
  profile, progression, goals, onNavigate,
  projects = [], skills = [], badges = [], achievements = []
}: DashboardProps) {
  const { level, currentXp, progress, requiredXp } = calculateProgressToNextLevel(progression?.xp || 0);

  const activeSkill = (skills || []).find((s: any) => s.status === 'IN_PROGRESS' || s.status === 'NOT_STARTED');
  const topSkills = (skills || []).filter((s: any) => s.status !== 'NOT_STARTED').slice(0, 4);
  const activeProjects = (projects || []).filter((p: any) => p.status === 'IN_PROGRESS');
  const earnedBadges = (badges || []).filter((b: any) => b.earned);
  const earnedBadgesCount = earnedBadges.length;
  const earnedAchievementsCount = achievements ? achievements.filter((a: any) => a.unlocked).length : 0;
  const totalBadgesAndAchievements = earnedBadgesCount + earnedAchievementsCount;
  
  // As requested: Projects should reflect the actual synced count (which is all of them)
  const totalProjectsCount = (projects || []).length;
  
  // As requested: Goals should reflect actual Goals (active + completed = all tracking)
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
      `}</style>

      {/* ─── HERO ─── */}
      <motion.div variants={fadeInUp} style={{
        ...card,
        padding: '48px',
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #FAFAFA 100%)',
      }}>
        <div className="hero-landscape" style={{ position: 'absolute', right: 0, bottom: 0, width: '450px', height: '100%', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: '20%', bottom: '-20%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <Sun size={90} color="#FBBF24" fill="#FDE68A" style={{ position: 'absolute', top: '20px', right: '80px', opacity: 0.9 }} />
          <Cloud size={60} color="#E2E8F0" fill="#F8FAFC" style={{ position: 'absolute', top: '50px', right: '220px', opacity: 0.8 }} />
          <Cloud size={45} color="#E2E8F0" fill="#F8FAFC" style={{ position: 'absolute', top: '90px', right: '40px', opacity: 0.6 }} />
          <Mountain size={180} color="#CBD5E1" fill="#F1F5F9" style={{ position: 'absolute', bottom: '-20px', right: '160px' }} />
          <Mountain size={220} color="#94A3B8" fill="#E2E8F0" style={{ position: 'absolute', bottom: '-40px', right: '-20px' }} />
          <TreePine size={70} color="#34D399" fill="#10B981" style={{ position: 'absolute', bottom: '10px', right: '220px' }} />
          <TreePine size={50} color="#059669" fill="#047857" style={{ position: 'absolute', bottom: '5px', right: '270px' }} />
          <TreePine size={90} color="#10B981" fill="#059669" style={{ position: 'absolute', bottom: '-5px', right: '90px' }} />
          <TreePine size={60} color="#34D399" fill="#10B981" style={{ position: 'absolute', bottom: '15px', right: '40px' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6366F1', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>
            {getGreeting()}, {profile?.displayName || "Developer"} 👋
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Ready to ascend?
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#5A5750', lineHeight: 1.6, margin: '0 0 32px' }}>
            Keep learning, building, and expanding your knowledge. Your next adventure is waiting.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate({ view: 'learning' })}
              style={{
                background: '#3EA354', color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(62,163,84,0.3)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(62,163,84,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(62,163,84,0.3)'; }}
            >
              Continue Learning <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate({ view: 'learning' })}
              style={{
                background: '#fff', color: '#5A5750', border: '1px solid rgba(140,135,125,0.25)',
                padding: '12px 28px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F7F7F2'; e.currentTarget.style.color = '#1E1D1B'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#5A5750'; }}
            >
              Explore Skills
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── PLAYER STATS ─── */}
      <motion.div variants={fadeInUp} style={{ ...card }} className="compact-stats">
                {[
          { label: 'Experience', value: currentXp, icon: <Zap size={22} />, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Streak', value: (progression?.streak || 0) || 0, icon: <Flame size={22} />, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
          { label: 'Badges', value: totalBadgesAndAchievements, icon: <Award size={22} />, color: '#EAB308', bg: 'rgba(234,179,8,0.1)' },
          { label: 'Projects', value: totalProjectsCount, icon: <Folder size={22} />, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
          { label: 'Goals', value: totalGoalsCount, icon: <Target size={22} />, color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
        ].map((stat, i, arr) => (
          <React.Fragment key={stat.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E1D1B', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9A958C', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            </div>
            {i < arr.length - 1 && <div className="stat-divider" style={{ width: '1px', height: '40px', background: 'rgba(140,135,125,0.15)' }} />}
          </React.Fragment>
        ))}
      </motion.div>

      {/* ─── EXPERIENCE BAR ─── */}
      <motion.div variants={fadeInUp} style={{ ...card, padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.9, lineHeight: 1, marginBottom: '2px' }}>LVL</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{level}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#5A5750' }}>
            <span>Experience Progress</span>
            <span style={{ color: '#6366F1' }}>{currentXp} <span style={{ color: '#9A958C' }}>/ {requiredXp} XP</span> ({Math.round(progress)}%)</span>
          </div>
          <div style={{ height: '12px', background: 'rgba(140,135,125,0.1)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: progress + '%' }} transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', borderRadius: '6px' }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── MAIN GRID ROW 1 ─── */}
      <div className="dashboard-grid">
        {/* Continue Learning */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={sectionTitle}><BookOpen size={16} color="#3B82F6" /> CONTINUE LEARNING</h3>
          <div style={{ ...card, padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {activeSkill ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>CURRENT PATHWAY</div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>{activeSkill.name}</h4>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#9A958C' }}>
                    <span>Level {activeSkill.level || 1}</span>
                    <span style={{ color: '#1E1D1B' }}>{activeSkill.progress || 0}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(140,135,125,0.15)', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
                    <div style={{ width: (activeSkill.progress || 0) + '%', height: '100%', background: '#3B82F6', borderRadius: '4px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(140,135,125,0.1)', paddingTop: '20px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5A5750', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={16} color="#EAB308" fill="#FDE047" /> Earn up to +250 XP
                  </span>
                  <button onClick={() => onNavigate({ view: 'learning' })} style={{
                    background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'none',
                    padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#3B82F6'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = '#3B82F6'; }}
                  >Resume <ArrowRight size={16} /></button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(59,130,246,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                  <BookOpen size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>Ready to start learning?</h4>
                <p style={{ color: '#5A5750', margin: 0, fontSize: '0.95rem', maxWidth: '280px' }}>Choose a skill from the academy and begin your journey.</p>
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
          <h3 style={sectionTitle}><Folder size={16} color="#06B6D4" /> ACTIVE PROJECTS</h3>
          <div style={{ ...card, padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: activeProjects.length > 0 ? 'flex-start' : 'center' }}>
            {activeProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                {activeProjects.slice(0, 3).map((project: any) => (
                  <div key={project.id} style={{
                    padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(140,135,125,0.12)', background: '#fff',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                    onClick={() => onNavigate({ view: 'projects' })}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'rgba(140,135,125,0.12)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(6,182,212,0.1)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Folder size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1D1B', marginBottom: '4px' }}>{project.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9A958C', fontWeight: 600 }}>{project.techStack?.slice(0, 3).join(' • ') || 'Project'}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#06B6D4', background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '8px' }}>IN PROGRESS</span>
                  </div>
                ))}
                {activeProjects.length > 3 && (
                   <button onClick={() => onNavigate({ view: 'projects' })} style={{
                     marginTop: 'auto', background: 'transparent', border: '1px solid rgba(140,135,125,0.2)', padding: '10px',
                     borderRadius: '10px', color: '#5A5750', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                   }}>View All Projects</button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(6,182,212,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
                  <Folder size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>No active projects yet.</h4>
                <p style={{ color: '#5A5750', margin: 0, fontSize: '0.95rem', maxWidth: '280px' }}>Start building something and turn your ideas into XP.</p>
                <button onClick={() => onNavigate({ view: 'projects' })} style={{
                  background: 'rgba(6,182,212,0.1)', color: '#0891B2', border: 'none', padding: '12px 28px',
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
          <h3 style={sectionTitle}><Star size={16} color="#8B5CF6" /> SKILL MASTERY</h3>
          <div style={{ ...card, padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: topSkills.length > 0 ? 'flex-start' : 'center' }}>
            {topSkills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {topSkills.map((skill: any) => (
                  <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Star size={16} />
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E1D1B' }}>{skill.name}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5A5750' }}>{skill.progress || 0}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(140,135,125,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: (skill.progress || 0) + '%', height: '100%', background: '#8B5CF6', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => onNavigate({ view: 'learning' })} style={{
                  marginTop: 'auto', background: 'transparent', border: '1px dashed rgba(139,92,246,0.3)', padding: '12px',
                  borderRadius: '10px', color: '#8B5CF6', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <Plus size={18} /> Add More Skills
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                  <Star size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>No skills in progress.</h4>
                <p style={{ color: '#5A5750', margin: 0, fontSize: '0.95rem', maxWidth: '280px' }}>Start tracking your learning to see your mastery grow.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={sectionTitle}><Trophy size={16} color="#EAB308" /> RECENT ACHIEVEMENTS</h3>
          <div style={{ ...card, padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: earnedBadges.length > 0 ? 'flex-start' : 'center' }}>
            {earnedBadges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                {earnedBadges.slice(0, 3).map((badge: any) => (
                  <div key={badge.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #FDE047, #EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 10px rgba(234,179,8,0.3)', flexShrink: 0 }}>
                      {badge.icon || '🏆'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E1D1B', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{badge.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#5A5750', lineHeight: 1.4 }}>{badge.requirement}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => onNavigate({ view: 'achievements' })} style={{
                  marginTop: 'auto', background: 'rgba(234,179,8,0.1)', color: '#CA8A04', border: 'none',
                  padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(234,179,8,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(234,179,8,0.1)'}
                >View All Achievements</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(234,179,8,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EAB308' }}>
                  <Trophy size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>Your first achievement is waiting.</h4>
                <p style={{ color: '#5A5750', margin: 0, fontSize: '0.95rem', maxWidth: '280px' }}>Complete a milestone to unlock it.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}

export function Dashboard(props: DashboardProps) {
  return <DashErrorBoundary><DashboardInner {...props} /></DashErrorBoundary>;
}
