import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Code2, LogIn, Sparkles, Target, Trophy } from 'lucide-react'
import { useState } from 'react'
import type { Progression } from '../../types'
import { useAuth } from '../../lib/auth'

type AuthShellProps = {
  onEnter: () => void
  progression: Progression
}

type Feature = {
  id: string
  label: string
  headline: string
  description: string
  icon: typeof BookOpen
  color: string
  accent: string
  visual: React.ReactNode
}

// Visual components for each feature panel
function SkillsVisual() {
  const skills = ['React', 'TypeScript', 'Node.js', 'System Design', 'SQL']
  return (
    <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
      {skills.map((skill, i) => (
        <motion.div
          key={skill}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontWeight: 500, fontSize: '0.95rem' }}>{skill}</span>
          <div style={{ height: '4px', width: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${60 + i * 8}%`, background: 'var(--cyan)', borderRadius: '99px' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '36px', textAlign: 'right' }}>{60 + i * 8}%</span>
        </motion.div>
      ))}
    </div>
  )
}

function KnowledgeVisual() {
  return (
    <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '28px',
        }}
      >
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '16px' }}>Question 3 of 5 · Hard</p>
        <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '24px', lineHeight: 1.5 }}>
          What is the time complexity of a balanced BST lookup operation?
        </p>
        {['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'].map((opt, i) => (
          <motion.div
            key={opt}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              border: `1px solid ${i === 1 ? 'var(--cyan)' : 'rgba(255,255,255,0.06)'}`,
              background: i === 1 ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)',
              fontSize: '0.9rem',
              color: i === 1 ? 'var(--cyan)' : 'var(--text-muted)',
              cursor: 'default',
            }}
          >
            {opt} {i === 1 && '✓'}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function CodingVisual() {
  const lines = [
    { indent: 0, text: 'function twoSum(nums, target) {', color: 'var(--cyan)' },
    { indent: 1, text: 'const map = new Map();', color: 'var(--text-muted)' },
    { indent: 1, text: 'for (let i = 0; i < nums.length; i++) {', color: 'var(--text-muted)' },
    { indent: 2, text: 'const complement = target - nums[i];', color: '#a5f3fc' },
    { indent: 2, text: 'if (map.has(complement)) {', color: 'var(--text-muted)' },
    { indent: 3, text: 'return [map.get(complement), i];', color: '#86efac' },
    { indent: 2, text: '}', color: 'var(--text-muted)' },
    { indent: 2, text: 'map.set(nums[i], i);', color: 'var(--text-muted)' },
    { indent: 1, text: '}', color: 'var(--text-muted)' },
    { indent: 0, text: '}', color: 'var(--cyan)' },
  ]
  return (
    <div style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ background: '#0d1117', borderRadius: '12px', padding: '24px', fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: '0.85rem', lineHeight: 1.8 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ paddingLeft: `${line.indent * 20}px`, color: line.color }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AchievementsVisual() {
  const badges = [
    { label: 'First Step', desc: 'Completed first skill', tier: 'common' },
    { label: 'Code Warrior', desc: '10 coding challenges', tier: 'rare' },
    { label: 'Perfect Score', desc: 'Aced a knowledge check', tier: 'epic' },
    { label: 'Streak Master', desc: '7-day learning streak', tier: 'legendary' },
  ]
  const colors: Record<string, string> = {
    common: 'var(--text-muted)',
    rare: 'var(--primary)',
    epic: 'var(--accent-gamification)',
    legendary: 'var(--gold)',
  }
  return (
    <div style={{ padding: '40px', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignContent: 'center' }}>
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${colors[badge.tier]}33`,
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${colors[badge.tier]}22`, border: `1px solid ${colors[badge.tier]}44`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={20} style={{ color: colors[badge.tier] }} />
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: colors[badge.tier] }}>{badge.label}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{badge.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}

function GoalsVisual() {
  const sessions = [
    { topic: 'Binary Trees', mode: 'PRIME', time: '47 min', status: 'complete' },
    { topic: 'System Design', mode: 'EXTENDED', time: '2h 14m', status: 'complete' },
    { topic: 'React Hooks', mode: 'FOCUSED', time: '32 min', status: 'active' },
  ]
  return (
    <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
      {sessions.map((s, i) => (
        <motion.div
          key={s.topic}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '18px 20px',
            background: s.status === 'active' ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${s.status === 'active' ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '12px',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>{s.topic}</p>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>{s.mode}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: s.status === 'active' ? 'var(--cyan)' : 'var(--text-muted)' }}>{s.time}</p>
            <p style={{ fontSize: '0.75rem', color: s.status === 'active' ? 'var(--cyan)' : 'var(--text-dim)' }}>{s.status === 'active' ? '● live' : '✓ done'}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const FEATURES: Feature[] = [
  {
    id: 'skills',
    label: 'Skill Tracking',
    headline: 'Map your entire technical stack.',
    description: 'Add skills, assign domains, and track your progress from beginner to mastery. The system recognizes 200+ technologies and generates structured subtopic breakdowns automatically.',
    icon: Target,
    color: 'var(--cyan)',
    accent: 'rgba(6,182,212,0.15)',
    visual: <SkillsVisual />,
  },
  {
    id: 'knowledge',
    label: 'Knowledge Checks',
    headline: 'Verify what you actually know.',
    description: 'AI-generated quizzes test your understanding after every learning session. Theory, multiple choice, and code-tracing questions — graded and explained in real time.',
    icon: BookOpen,
    color: 'var(--primary)',
    accent: 'rgba(59,130,246,0.15)',
    visual: <KnowledgeVisual />,
  },
  {
    id: 'coding',
    label: 'Coding Challenges',
    headline: 'Practice in a real code environment.',
    description: 'Solve problems in a full Monaco editor with syntax highlighting, auto-close brackets, and AI-powered answer verification. HTML, JavaScript, Python, and more.',
    icon: Code2,
    color: '#a5f3fc',
    accent: 'rgba(165,243,252,0.1)',
    visual: <CodingVisual />,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    headline: 'Collect milestones that mean something.',
    description: 'Earn badges for real accomplishments — first skill mastered, 7-day learning streaks, perfect knowledge checks, and 60+ more milestone categories that track your genuine progress.',
    icon: Trophy,
    color: 'var(--gold)',
    accent: 'rgba(234,179,8,0.1)',
    visual: <AchievementsVisual />,
  },
  {
    id: 'sessions',
    label: 'Learning Sessions',
    headline: 'Structure your study time.',
    description: 'PRIME, FOCUSED, and EXTENDED session modes adapt time requirements based on topic difficulty. Sessions earn XP, advance your level, and build your daily streak.',
    icon: Sparkles,
    color: 'var(--accent-gamification)',
    accent: 'rgba(168,85,247,0.1)',
    visual: <GoalsVisual />,
  },
]



function SkillIntelligenceInterface({ activeFeature }: { activeFeature: string }) {
  // Original animated abstract UI that changes based on activeFeature
  const states: Record<string, { color: string, icon: typeof BookOpen, label: string, data: number[] }> = {
    skills: { color: 'var(--cyan)', icon: Target, label: 'Skill Matrix', data: [80, 65, 90, 40] },
    knowledge: { color: 'var(--primary)', icon: BookOpen, label: 'Knowledge Graph', data: [100, 50, 75, 60] },
    coding: { color: '#a5f3fc', icon: Code2, label: 'Logic Engine', data: [45, 80, 55, 95] },
    achievements: { color: 'var(--gold)', icon: Trophy, label: 'Reward Network', data: [90, 90, 80, 85] },
    sessions: { color: 'var(--accent-gamification)', icon: Sparkles, label: 'Focus Nodes', data: [60, 40, 70, 90] }
  }
  
  const current = states[activeFeature] || states.skills

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${current.color}15 0%, transparent 60%)`, transition: 'background 0.5s' }} />
      
      {/* Outer Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.05)' }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }}
      />

      {/* Central Core */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(4px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100px', height: '100px',
              borderRadius: '24px',
              background: 'rgba(10,13,20,0.8)',
              border: `1px solid ${current.color}40`,
              boxShadow: `0 0 40px ${current.color}20, inset 0 0 20px ${current.color}10`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(12px)'
            }}
          >
            <current.icon size={42} color={current.color} />
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${activeFeature}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-dim)', marginBottom: '4px' }}>Active Interface</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: current.color, letterSpacing: '0.02em' }}>{current.label}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Data Nodes */}
      {current.data.map((val, i) => {
        const angle = (i * 90) * (Math.PI / 180)
        const radius = 130
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        return (
          <motion.div
            key={`${activeFeature}-${i}`}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x, y, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 50 }}
            style={{
              position: 'absolute',
              width: '40px', height: '40px',
              borderRadius: '12px',
              background: 'rgba(20,25,35,0.9)',
              border: `1px solid ${current.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)',
              boxShadow: `0 4px 12px rgba(0,0,0,0.5)`
            }}
          >
            {val}%
          </motion.div>
        )
      })}
    </div>
  )
}

export function AuthShell({ onEnter, progression }: AuthShellProps) {
  const { signInWithGoogle, loading, isConfigured } = useAuth()
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id)

  return (
    <motion.main
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.7 }}
      className="landing"
      style={{ padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}
    >
      {/* ── Premium Top Nav ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 56px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(3,4,7,0.7)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '4px',
            background: 'var(--text-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={14} color="var(--bg-base)" />
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '1.05rem', color: 'var(--text-main)' }}>CodeAscend</span>
        </div>

        <div className="desktop-only" style={{ display: 'flex', gap: '40px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.02em' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Platform</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Methodology</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Changelog</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isConfigured ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={signInWithGoogle}
              disabled={loading}
              style={{
                background: 'var(--text-main)', color: 'var(--bg-base)',
                border: 'none', padding: '8px 20px', borderRadius: '6px',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onEnter}
              style={{
                background: 'var(--text-main)', color: 'var(--bg-base)',
                border: 'none', padding: '8px 20px', borderRadius: '6px',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Enter Journey
            </motion.button>
          )}
        </div>
      </nav>

      {/* ── Redesigned Hero Section ── */}
      <section style={{
        padding: '100px 56px 80px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="hero-split" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          marginBottom: '80px',
        }}>
          {/* Left: Editorial Copy */}
          <div>
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderRadius: '99px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '32px'
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }} />
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Developer Intelligence System</span>
            </motion.div>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '28px'
              }}
            >
              Master your stack.<br />
              <span style={{ color: 'var(--text-dim)' }}>Quantify your growth.</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '500px', lineHeight: 1.6, marginBottom: '48px', fontWeight: 300 }}
            >
              CodeAscend transforms abstract learning into a measurable, interactive journey. Track skills, verify knowledge, and build your engineering career with precision.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}
            >
              {isConfigured ? (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={signInWithGoogle} disabled={loading} style={{
                  background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none',
                  padding: '16px 32px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  {loading ? 'Initializing…' : <><LogIn size={18} /> Authenticate with Google</>}
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onEnter} style={{
                  background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none',
                  padding: '16px 32px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  Initialize Environment <ArrowRight size={18} />
                </motion.button>
              )}
              <a href="#" style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Explore the methodology</a>
            </motion.div>
          </div>

          {/* Right: Skill Intelligence Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: '500px', margin: '0 auto' }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(10,13,20,0.4)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
            }}>
              {/* Terminal-like header */}
              <div style={{ height: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', background: 'rgba(0,0,0,0.2)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Intelligence Core / {activeFeature}</span>
              </div>
              <SkillIntelligenceInterface activeFeature={activeFeature} />
            </div>
            
            {/* Interactive Feature Controls overlaid or below the orb */}
            <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', background: 'rgba(10,13,20,0.8)', padding: '8px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
              {FEATURES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFeature(f.id)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: activeFeature === f.id ? `${f.color}20` : 'transparent',
                    border: activeFeature === f.id ? `1px solid ${f.color}50` : '1px solid transparent',
                    color: activeFeature === f.id ? f.color : 'var(--text-dim)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <f.icon size={18} />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Premium Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          {[
            { label: 'Skills Mastered', value: String(progression.skillsMastered || 0).padStart(2, '0') },
            { label: 'Projects Completed', value: String(progression.projectsCompleted || 0).padStart(2, '0') },
            { label: 'Days Active', value: String(progression.streak || 0).padStart(2, '0') },
            { label: 'XP Earned', value: (progression.xp || 0).toLocaleString() },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-surface)', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
              <strong style={{ fontSize: '2.5rem', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{s.value}</strong>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Capabilities Overview ── */}
      <section style={{
        padding: '100px 56px',
        background: '#020305',
        borderTop: '1px solid rgba(255,255,255,0.02)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '80px', maxWidth: '600px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', letterSpacing: '-0.03em', fontWeight: 500, marginBottom: '24px' }}>A complete architecture for professional growth.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>We rebuilt the learning experience to focus on what actually matters: verifiable skills, continuous momentum, and deep technical mastery.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(10,13,20,0.5)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '20px',
                  padding: '40px',
                  display: 'flex', flexDirection: 'column', gap: '24px',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(20,25,35,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(10,13,20,0.5)'}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-main)' }}>{f.headline}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{
        padding: '120px 56px',
        textAlign: 'center',
        background: 'var(--bg-base)'
      }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', fontWeight: 600, marginBottom: '24px' }}>Ready to deploy your potential?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 48px' }}>Join the developer intelligence system and start tracking your real-world technical growth.</p>
        
        {isConfigured ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={signInWithGoogle} disabled={loading} style={{
            background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none',
            padding: '16px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '10px'
          }}>
            {loading ? 'Authenticating…' : 'Authenticate via Google'}
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={onEnter} style={{
            background: 'var(--text-main)', color: 'var(--bg-base)', border: 'none',
            padding: '16px 40px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '10px'
          }}>
            Initialize Environment
          </motion.button>
        )}
      </section>
    </motion.main>
  )
}