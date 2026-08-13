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

export function AuthShell({ onEnter, progression }: AuthShellProps) {
  const { signInWithGoogle, loading, isConfigured } = useAuth()
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id)

  const feature = FEATURES.find(f => f.id === activeFeature) ?? FEATURES[0]

  return (
    <motion.main
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.7 }}
      className="landing"
      style={{ padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Top Nav ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(3,7,18,0.8)',
        position: 'sticky', top: 0, zIndex: 50,
      }}
      className="landing-nav"
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Code2 size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1rem', whiteSpace: 'nowrap' }}>CodeAscend</span>
        </div>

        <div className="desktop-only" style={{ display: 'flex', gap: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span>Skills</span>
          <span>Learning</span>
          <span>Achievements</span>
        </div>

        <div>
          {isConfigured ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="primary-btn"
              onClick={signInWithGoogle}
              disabled={loading}
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              {loading ? 'Signing in…' : <><LogIn size={15} /> Sign in with Google</>}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="primary-btn"
              onClick={onEnter}
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              Enter Journey <ArrowRight size={15} />
            </motion.button>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        padding: '96px 48px 72px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.08), transparent)',
      }}
      className="landing-hero"
    >
        <motion.p
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="eyebrow"
          style={{ color: 'var(--cyan)', marginBottom: '20px' }}
        >
          Developer Learning System
        </motion.p>
        <motion.h1
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: '800px', marginBottom: '24px' }}
        >
          Build your skills.<br />Verify your knowledge.
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '560px', lineHeight: 1.7, marginBottom: '40px' }}
        >
          A structured learning system for developers. Track skills, complete AI-generated knowledge checks, solve coding challenges, and level up your career.
        </motion.p>
        <motion.div
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {isConfigured ? (
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="primary-btn" onClick={signInWithGoogle} disabled={loading} style={{ fontSize: '1rem', padding: '14px 32px' }}>
              {loading ? 'Signing in…' : <><LogIn size={17} /> Sign in with Google</>}
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="primary-btn" onClick={onEnter} style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Start Learning <ArrowRight size={17} />
            </motion.button>
          )}
          <div className="badge-pill">No credit card required</div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
          className="landing-stats-row"
          style={{
            display: 'flex', gap: '48px', marginTop: '64px', paddingTop: '40px',
            borderTop: '1px solid var(--border)',
            flexWrap: 'wrap', justifyContent: 'center',
          }}
        >
          {[
            { label: 'Skills Mastered', value: String(progression.skillsMastered || 0).padStart(2, '0') },
            { label: 'Projects Completed', value: String(progression.projectsCompleted || 0).padStart(2, '0') },
            { label: 'Days Active', value: String(progression.streak || 0).padStart(2, '0') },
            { label: 'XP Earned', value: (progression.xp || 0).toLocaleString() },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '2rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--text-main)' }}>{s.value}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Feature Showcase (World Labs-style) ── */}
      <section style={{
        padding: '80px 48px',
        maxWidth: '1300px', margin: '0 auto', width: '100%',
      }}
      className="landing-feature-section"
    >
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Everything You Need</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}>From zero to career-ready.</h2>
        </motion.div>

        {/* Tab Nav + Content Panel */}
        <div className="landing-feature-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Left: vertical tab nav */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'sticky', top: '120px' }}>
            {FEATURES.map((f, i) => {
              const isActive = f.id === activeFeature
              return (
                <motion.button
                  key={f.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  onClick={() => setActiveFeature(f.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid var(--border)`,
                    color: isActive ? f.color : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                        background: f.color, borderRadius: '0 2px 2px 0',
                      }}
                    />
                  )}
                  <f.icon size={18} />
                  <span>{f.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Right: animated content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                overflow: 'hidden',
                minHeight: '480px',
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
              }}
            >
              {/* Header */}
              <div style={{ padding: '40px 40px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: feature.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${feature.color}33`,
                  }}>
                    <feature.icon size={18} style={{ color: feature.color }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: feature.color }}>{feature.label}</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>{feature.headline}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '520px', fontSize: '0.95rem' }}>{feature.description}</p>
              </div>

              {/* Visual Area */}
              <div style={{ padding: '0 0 8px' }}>
                {feature.visual}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{
        margin: '48px 48px 64px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '72px 48px',
        textAlign: 'center',
      }}
      className="landing-footer-cta"
    >
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Start building your career today.
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.65 }}>
          Join a learning system built for serious developers. Track progress, verify knowledge, and level up your skills.
        </p>
        {isConfigured ? (
          <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="primary-btn" onClick={signInWithGoogle} disabled={loading} style={{ fontSize: '1rem', padding: '14px 36px' }}>
            {loading ? 'Signing in…' : <><LogIn size={17} /> Sign in with Google</>}
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="primary-btn" onClick={onEnter} style={{ fontSize: '1rem', padding: '14px 36px' }}>
            Enter my journey <ArrowRight size={17} />
          </motion.button>
        )}
      </section>
    </motion.main>
  )
}