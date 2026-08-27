import { Star, Map, Zap, ArrowRight, Award, BookOpen, Flame, Lock, Compass, Folder, Target, Mountain, Sun, Cloud, TreePine, MessageSquare, Check } from "lucide-react";
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
  friendState?: any;
  chatState?: any;
  incomingRequestsCount?: any;
  unreadMessagesCount?: any;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 18) return "GOOD AFTERNOON";
  return "GOOD EVENING";
};

/* Shared card style */
const card = {
  background: '#fff',
  borderRadius: '16px',
  border: '1px solid rgba(140,135,125,0.10)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
} as const;

const sectionTitle = {
  fontSize: '0.8rem',
  fontWeight: 800 as const,
  color: '#9A958C',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export function Dashboard({
  profile, progression, goals, onNavigate,
  projects = [], skills = [], badges = []
}: DashboardProps) {
  const { level, currentXp, progress, requiredXp } = calculateProgressToNextLevel(progression.xp);

  const activeSkill = skills.find((s: any) => s.status === 'IN_PROGRESS' || s.status === 'NOT_STARTED');
  const activeProjects = projects.filter((p: any) => p.status === 'IN_PROGRESS');
  const earnedBadges = badges.filter((b: any) => b.earned);
  const completedProjectsCount = projects.filter((p: any) => p.status === 'COMPLETED').length;
  const masteredSkillsCount = skills.filter((s: any) => s.status === 'MASTERED').length;
  const completedGoalsCount = goals.filter((g: any) => g.status === 'COMPLETED').length;

  return (
    <motion.div
      className="rpg-page-container"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
    >
      {/* ─── HERO ─── */}
      <motion.div variants={fadeInUp} style={{
        ...card,
        borderRadius: '20px',
        padding: '40px 44px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden', minHeight: 0,
        boxShadow: '0 4px 20px rgba(62, 163, 84, 0.06)',
      }}>
        {/* subtle gradient accent */}
        <div style={{
          position: 'absolute', right: '-60px', bottom: '-80px', width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(62,163,84,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '120px', top: '-40px', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(58,130,196,0.04) 0%, transparent 60%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3EA354', letterSpacing: '0.1em', marginBottom: '10px' }}>
            {getGreeting()}, {profile.displayName.toUpperCase()} 👋
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 12px', lineHeight: 1.1 }}>
            Ready to ascend?
          </h1>
          <p style={{ fontSize: '1rem', color: '#5A5750', lineHeight: 1.6, margin: '0 0 28px', maxWidth: '420px' }}>
            Keep learning, building, and growing your path. Your next adventure is waiting.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate({ view: 'learning' })}
              style={{
                background: '#3EA354', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 3px 12px rgba(62,163,84,0.25)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(62,163,84,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(62,163,84,0.25)'; }}
            >
              Continue Learning <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate({ view: 'learning' })}
              style={{
                background: '#fff', color: '#5A5750', border: '1px solid rgba(140,135,125,0.2)',
                padding: '10px 24px', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F7F7F2'; e.currentTarget.style.borderColor = 'rgba(140,135,125,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(140,135,125,0.2)'; }}
            >
              Explore Skills
            </button>
          </div>
        </div>

        {/* Landscape illustration */}
        <div style={{ position: 'relative', zIndex: 1, width: '240px', height: '160px', flexShrink: 0 }}>
          <Sun size={48} style={{ position: 'absolute', top: 4, right: 30, color: '#f6ad55', opacity: 0.7 }} fill="currentColor" />
          <Cloud size={36} style={{ position: 'absolute', top: 28, right: 100, color: '#d4dbe4', opacity: 0.6 }} fill="currentColor" />
          <Mountain size={80} style={{ position: 'absolute', bottom: 16, right: 140, color: '#b8dfc8' }} fill="currentColor" />
          <Mountain size={110} style={{ position: 'absolute', bottom: 8, right: 50, color: '#7cc99a' }} fill="currentColor" />
          <TreePine size={44} style={{ position: 'absolute', bottom: 0, right: 14, color: '#3EA354' }} fill="currentColor" />
          <TreePine size={30} style={{ position: 'absolute', bottom: 0, right: 48, color: '#2f855a' }} fill="currentColor" />
          <TreePine size={36} style={{ position: 'absolute', bottom: 0, right: 110, color: '#48b96a' }} fill="currentColor" />
        </div>
      </motion.div>

      {/* ─── STATS ROW ─── */}
      <motion.div variants={fadeInUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {[
          { icon: <Zap size={18} />, value: `${currentXp}`, label: 'XP', color: '#3EA354', bg: 'rgba(62,163,84,0.07)' },
          { icon: <Flame size={18} />, value: `${progression.streak || 0}`, label: 'Streak', color: '#EB7C31', bg: 'rgba(235,124,49,0.07)' },
          { icon: <Award size={18} />, value: `${earnedBadges.length}`, label: 'Badges', color: '#E6B022', bg: 'rgba(230,176,34,0.07)' },
          { icon: <Folder size={18} />, value: `${completedProjectsCount}`, label: 'Projects', color: '#3A82C4', bg: 'rgba(58,130,196,0.07)' },
          { icon: <Target size={18} />, value: `${completedGoalsCount}`, label: 'Goals', color: '#8B6CC1', bg: 'rgba(139,108,193,0.07)' },
        ].map((stat, i) => (
          <div key={i} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E1D1B', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9A958C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ─── EXPERIENCE BAR ─── */}
      <motion.div variants={fadeInUp} style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px', background: '#3EA354',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
        }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.8, lineHeight: 1 }}>LVL</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, lineHeight: 1 }}>{level}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#5A5750' }}>
            <span>Experience Progress</span>
            <span style={{ color: '#3EA354' }}>{currentXp} / {requiredXp} XP ({Math.round(progress)}%)</span>
          </div>
          <div style={{ height: '8px', background: '#F2F1EC', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progress + '%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #3EA354, #48b96a)', borderRadius: '4px' }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── CONTINUE LEARNING + ACTIVE PROJECTS (2-col) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Continue Learning */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={sectionTitle}><BookOpen size={14} color="#3EA354" /> CONTINUE LEARNING</h3>
          <div style={{ ...card, padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {activeSkill ? (
              <>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3EA354', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>CURRENT PATHWAY</div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E1D1B', margin: '0 0 14px' }}>{activeSkill.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#9A958C' }}>
                    <span>Level {activeSkill.level || 1}</span>
                    <span>{activeSkill.progress || 0}%</span>
                  </div>
                  <div style={{ height: '5px', background: '#F2F1EC', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ width: (activeSkill.progress || 0) + '%', height: '100%', background: '#3EA354', borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E6B022', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="currentColor" /> +250 XP
                  </span>
                  <button onClick={() => onNavigate({ view: 'learning' })} style={{
                    background: 'rgba(62,163,84,0.08)', color: '#3EA354', border: '1px solid rgba(62,163,84,0.15)',
                    padding: '7px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(62,163,84,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(62,163,84,0.08)'}
                  >Continue <ArrowRight size={14} /></button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '12px', padding: '20px 0' }}>
                <div style={{ width: 52, height: 52, background: '#F7F7F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A958C' }}><BookOpen size={24} /></div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>Ready to start learning?</h4>
                <p style={{ color: '#9A958C', margin: 0, fontSize: '0.88rem' }}>Choose a skill and begin your journey.</p>
                <button onClick={() => onNavigate({ view: 'learning' })} style={{
                  background: '#3EA354', color: '#fff', border: 'none', padding: '8px 20px',
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '4px',
                }}>Browse Skills</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={sectionTitle}><Folder size={14} color="#3A82C4" /> ACTIVE PROJECTS</h3>
          <div style={{ ...card, padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: activeProjects.length > 0 ? 'flex-start' : 'center' }}>
            {activeProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeProjects.slice(0, 3).map((project: any) => (
                  <div key={project.id} style={{
                    padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(140,135,125,0.10)', background: '#FAFAF8',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onClick={() => onNavigate({ view: 'projects' })}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = 'rgba(140,135,125,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(140,135,125,0.10)'; }}
                  >
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E1D1B', marginBottom: '3px' }}>{project.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#9A958C', fontWeight: 600 }}>{project.techStack?.slice(0, 3).join(', ') || 'Project'}</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#3A82C4', background: 'rgba(58,130,196,0.08)', padding: '3px 8px', borderRadius: '6px' }}>IN PROGRESS</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '20px 0' }}>
                <div style={{ width: 52, height: 52, background: '#F7F7F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A958C' }}><Folder size={24} /></div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>No active projects yet.</h4>
                <p style={{ color: '#9A958C', margin: 0, fontSize: '0.88rem' }}>Start building something and turn ideas into XP.</p>
                <button onClick={() => onNavigate({ view: 'projects' })} style={{
                  background: 'rgba(58,130,196,0.08)', color: '#3A82C4', border: 'none', padding: '8px 20px',
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '4px',
                }}>Create Project</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ─── TODAY'S OBJECTIVE + YOUR JOURNEY (2-col) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>

        {/* Today's Objective */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={sectionTitle}><Target size={14} color="#EB7C31" /> TODAY'S OBJECTIVE</h3>
          <div style={{ ...card, padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(235,124,49,0.07)', color: '#EB7C31', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Target size={20} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E1D1B', margin: '0 0 8px' }}>Complete a learning session</h4>
              <p style={{ fontSize: '0.88rem', color: '#9A958C', margin: '0 0 20px', lineHeight: 1.5 }}>
                Maintain your streak by completing at least one lesson today.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5A5750', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EB7C31' }} /> Reward: +100 XP
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5A5750', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EB7C31' }} /> Streak → {(progression.streak || 0) + 1} days
              </div>
              <button onClick={() => onNavigate({ view: 'learning' })} style={{
                width: '100%', padding: '10px', background: '#1E1D1B', color: '#fff', border: 'none',
                borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', marginTop: '6px', cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#1E1D1B'}
              >Start Session</button>
            </div>
          </div>
        </motion.div>

        {/* Your Journey */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={sectionTitle}><Map size={14} color="#8B6CC1" /> YOUR JOURNEY</h3>
          <div style={{ ...card, padding: '32px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative', justifyContent: 'space-between', padding: '0 20px' }}>
              {/* Track */}
              <div style={{ position: 'absolute', top: '50%', left: '44px', right: '44px', height: '3px', background: '#F2F1EC', transform: 'translateY(-50%)', zIndex: 0, borderRadius: '2px' }} />
              <div style={{ position: 'absolute', top: '50%', left: '44px', width: '25%', height: '3px', background: '#3EA354', transform: 'translateY(-50%)', zIndex: 0, borderRadius: '2px' }} />

              {[
                { label: 'Starting Point', icon: <Check size={18} />, done: true, current: false },
                { label: 'Learning', icon: <Compass size={20} />, done: false, current: true },
                { label: 'Building', icon: <Lock size={18} />, done: false, current: false },
                { label: 'Mastery', icon: <Lock size={18} />, done: false, current: false },
              ].map((node, i) => (
                <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transform: i % 2 === 1 ? 'translateY(-16px)' : 'none' }}>
                  <div style={{
                    width: node.current ? 48 : 40, height: node.current ? 48 : 40, borderRadius: '50%',
                    background: node.done ? '#3EA354' : node.current ? '#3A82C4' : '#fff',
                    color: node.done || node.current ? '#fff' : '#9A958C',
                    border: !node.done && !node.current ? '2px solid rgba(140,135,125,0.2)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: node.current ? '0 0 0 4px #fff, 0 2px 10px rgba(58,130,196,0.25)' : node.done ? '0 0 0 4px #fff, 0 2px 8px rgba(62,163,84,0.2)' : '0 0 0 3px #fff',
                  }}>
                    {node.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: node.done || node.current ? '#1E1D1B' : '#9A958C' }}>{node.label}</div>
                    {node.current && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3A82C4' }}>Current</div>}
                    {node.done && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3EA354' }}>Done</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── ACHIEVEMENTS + QUICK ACTIONS (2-col) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent Achievements */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={sectionTitle}><Star size={14} color="#E6B022" /> RECENT ACHIEVEMENTS</h3>
          <div style={{ ...card, padding: '24px', flex: 1 }}>
            {earnedBadges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {earnedBadges.slice(0, 3).map((badge: any) => (
                  <div key={badge.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(230,176,34,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(230,176,34,0.12)', flexShrink: 0 }}>
                      {badge.icon || '🏆'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1E1D1B', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{badge.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#9A958C' }}>{badge.requirement}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => onNavigate({ view: 'achievements' })} style={{
                  background: 'transparent', color: '#5A5750', border: '1px solid rgba(140,135,125,0.15)',
                  padding: '8px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem',
                  cursor: 'pointer', width: '100%', marginTop: '4px', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7F7F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >View All Achievements</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '12px', padding: '16px 0' }}>
                <div style={{ width: 48, height: 48, background: '#F7F7F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A958C' }}><Star size={22} /></div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E1D1B', margin: 0 }}>Your first achievement is waiting.</h4>
                <p style={{ color: '#9A958C', margin: 0, fontSize: '0.88rem' }}>Complete a milestone to unlock it.</p>
                <button onClick={() => onNavigate({ view: 'achievements' })} style={{
                  background: 'rgba(230,176,34,0.08)', color: '#c9920e', border: 'none', padding: '8px 20px',
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '4px',
                }}>View Achievements</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={sectionTitle}><Zap size={14} color="#8B6CC1" /> QUICK ACTIONS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flex: 1 }}>
            {[
              { label: 'Learn a Skill', icon: <BookOpen size={16} />, color: '#3EA354', bg: 'rgba(62,163,84,0.06)', view: 'learning' as const },
              { label: 'Start a Project', icon: <Folder size={16} />, color: '#3A82C4', bg: 'rgba(58,130,196,0.06)', view: 'projects' as const },
              { label: 'View Achievements', icon: <Star size={16} />, color: '#E6B022', bg: 'rgba(230,176,34,0.06)', view: 'achievements' as const },
              { label: 'Open Chat', icon: <MessageSquare size={16} />, color: '#8B6CC1', bg: 'rgba(139,108,193,0.06)', view: 'chat' as const },
            ].map((action, i) => (
              <div key={i} onClick={() => onNavigate({ view: action.view })} style={{
                ...card, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{action.icon}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E1D1B' }}>{action.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── FOOTER ─── */}
      <motion.div variants={fadeInUp} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(140,135,125,0.10)', paddingTop: '20px', marginTop: '8px',
        color: '#9A958C', fontSize: '0.78rem', fontWeight: 600,
      }}>
        <span>CODEASCEND v4.0</span>
        <span>Your Adventure Continues.</span>
      </motion.div>
    </motion.div>
  );
}
