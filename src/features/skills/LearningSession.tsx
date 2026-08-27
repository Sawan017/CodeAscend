import { motion } from 'framer-motion'
import { X, Play, BrainCircuit, Clock, Zap, Target as TargetIcon } from 'lucide-react'
import type { SubtopicProgress, AIRecommendation } from '../../types'

type LearningSessionProps = {
  subtopic: SubtopicProgress
  teachingMinutes: number
  solvingBaselineMinutes: number
  onClose: () => void
  onStart: () => void
  aiRecommendation?: AIRecommendation
}

export function LearningSession({ subtopic, teachingMinutes, solvingBaselineMinutes, onClose, onStart, aiRecommendation }: LearningSessionProps) {
  const displayDifficulty = aiRecommendation ? aiRecommendation.difficulty : subtopic.difficulty || 'Normal'
  const baseXP = subtopic.baseXP || 88
  const baselineTime = teachingMinutes + solvingBaselineMinutes;

  const primeTime = Math.floor(teachingMinutes + (solvingBaselineMinutes * 0.5));
  const focusedTime = Math.floor(teachingMinutes + solvingBaselineMinutes);
  
  const primeXP = Math.floor(baseXP * 2.5);
  const focusedXP = Math.floor(baseXP * 1.75);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(3,4,7,0.7)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px', overflowY: 'auto'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid #E2E8F0',
          borderRadius: '24px', 
          padding: '24px 32px', 
          width: '100%',
          maxWidth: '600px',
          position: 'relative', 
          boxShadow: '0 32px 64px -16px rgba(17,24,39,0.15), inset 0 1px 0 rgba(255,255,255,1)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          gap: '20px'
        }}
      >
        <button 
          onClick={onClose}
          className="close-modal-btn"
          style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 10 }}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* --- HEADER --- */}
        <div style={{ paddingRight: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <TargetIcon size={20} color="#6366F1" />
            <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#111827', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {subtopic.title}
            </h2>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600, marginBottom: '12px' }}>
            {subtopic.category || 'Skill Task'} • {subtopic.domain || 'Learning Curriculum'}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ 
              color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0',
              padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' 
            }}>
              {displayDifficulty}
            </span>
            <span style={{ 
              color: '#0369A1', background: '#E0F2FE', border: '1px solid #BAE6FD',
              padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.05em' 
            }}>
              <Zap size={14} fill="currentColor" /> {baseXP} BASE XP
            </span>
          </div>
        </div>

        {/* --- AI RECOMMENDATION --- */}
        {aiRecommendation && (
          <div style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)', border: '1px solid rgba(16,185,129,0.2)', borderLeft: '4px solid #10B981', padding: '12px 16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <BrainCircuit size={20} color="#10B981" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: '#047857', fontWeight: 800, fontSize: '0.85rem', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Adjusted Engine</p>
              <p style={{ margin: 0, color: '#065F46', fontSize: '0.9rem', lineHeight: '1.4', fontWeight: 500 }}>{aiRecommendation.reason}</p>
            </div>
          </div>
        )}

        {/* --- TASK TIMING --- */}
        <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px 20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#06B6D4' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Timing</span>
            </div>
            <div style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.4 }}>
              Designed as a comfortable<br/>learning pace. Not a hard deadline.
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Baseline Target</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06B6D4', lineHeight: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px' }}>
              {baselineTime} <span style={{ fontSize: '1rem', color: '#38BDF8' }}>min</span>
            </div>
          </div>
        </div>

        {/* --- XP REWARDS --- */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#F59E0B" fill="#F59E0B" /> XP REWARDS
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* PRIME */}
            <div className="reward-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'linear-gradient(90deg, #F8FAFC 0%, #FFFFFF 100%)', border: '1px solid #E2E8F0', borderRadius: '12px', transition: 'all 0.2s', borderLeft: '4px solid #10B981', height: '60px' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#047857', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>PRIME</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Complete under {primeTime} min</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10B981', textShadow: '0 0 12px rgba(16,185,129,0.3)' }}>+{primeXP} XP</div>
              </div>
            </div>

            {/* FOCUSED */}
            <div className="reward-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'linear-gradient(90deg, #F8FAFC 0%, #FFFFFF 100%)', border: '1px solid #E2E8F0', borderRadius: '12px', transition: 'all 0.2s', borderLeft: '4px solid #06B6D4', height: '60px' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0369A1', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>FOCUSED</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Complete under {focusedTime} min</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#06B6D4', textShadow: '0 0 12px rgba(6,182,212,0.3)' }}>+{focusedXP} XP</div>
              </div>
            </div>

            {/* EXTENDED */}
            <div className="reward-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', transition: 'all 0.2s', borderLeft: '4px solid #8B5CF6', height: '60px' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#6D28D9', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>EXTENDED</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Complete at your own pace</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#8B5CF6' }}>+{baseXP} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- START BUTTON --- */}
        <button 
          className="start-task-btn"
          onClick={onStart}
          style={{ 
            width: '100%', 
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)', 
            color: 'white', 
            padding: '0 20px',
            height: '54px', 
            borderRadius: '14px', 
            border: 'none', 
            fontWeight: 900, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
            cursor: 'pointer', 
            fontSize: '1.1rem', 
            boxShadow: '0 8px 16px -8px rgba(6,182,212,0.4)',
            transition: 'all 0.2s',
            marginTop: '4px'
          }}
        >
          <Play size={18} fill="currentColor" /> START TASK
        </button>

      </motion.div>
      <style>{`
        .close-modal-btn:hover {
          background: #E2E8F0 !important;
          transform: scale(1.05);
        }
        .reward-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -8px rgba(17,24,39,0.1);
        }
        .start-task-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 12px 24px -8px rgba(6,182,212,0.5) !important;
        }
        .start-task-btn:active {
          transform: translateY(1px);
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  )
}
