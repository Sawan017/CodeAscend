
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, BookOpen, Award, CheckCircle, Target, FileText, ChevronRight } from 'lucide-react'
import type { Skill, SubtopicProgress } from '../../types'
import { resolveSkill, generateSubtopicsForSkill, PATHWAY_REGISTRY } from '../../data/learningData.ts'
import { allTimeDistributions } from '../../data/timeDistributions/index'
import { LearningSession } from './LearningSession'

type SkillDetailProps = {
  skill: Skill
  onBack: () => void
  onUpdateNotes: (id: string, notes: string) => void
  onStartSession?: (subtopic: SubtopicProgress) => void
  onCloseSession?: () => void
  activeSession?: import('../../types').ActiveSessionState | null
}

export function SkillDetail({
  skill,
  onBack,
  onUpdateNotes,
  onStartSession,
  onCloseSession,
  activeSession
}: SkillDetailProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editNotes, setEditNotes] = useState(skill.notes || '')
  
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicProgress | null>(null)
  const [showBlockDialog, setShowBlockDialog] = useState(false)

  const handleSaveNotes = () => {
    onUpdateNotes?.(skill.id, editNotes)
    setIsEditingNotes(false)
  }

  const canonicalSkill = resolveSkill(skill.canonicalName || skill.name)

  const handleSubtopicClick = (subtopicTitle: string) => {
    let subtopic = skill.subtopics?.find(s => s.title === subtopicTitle)
    
    if (!subtopic && canonicalSkill) {
      const freshSubtopics = generateSubtopicsForSkill(canonicalSkill)
      subtopic = freshSubtopics.find(s => s.title === subtopicTitle)
    }

    if (subtopic && subtopic.status !== 'Completed') {
      if (activeSession && activeSession.isActive) {
        setShowBlockDialog(true)
        return
      }
      setActiveSubtopic(subtopic)
    }
  }

  const statusLabel = skill.progress >= 100 ? 'COMPLETED' : ((skill.progress || 0) > 0 ? 'IN PROGRESS' : 'ADDED');
  const statusColor = skill.progress >= 100 ? '#3EA354' : ((skill.progress || 0) > 0 ? '#8B5CF6' : '#5A5750');
  const statusBg = skill.progress >= 100 ? 'rgba(62,163,84,0.1)' : ((skill.progress || 0) > 0 ? 'rgba(139,92,246,0.1)' : 'rgba(140,135,125,0.1)');

  // Get primary domain for context
  const primaryDomain = PATHWAY_REGISTRY.find(p => p.id === canonicalSkill?.primaryDomainId);

  const startDate = skill.started ? new Date(skill.started) : null;
  const isValidDate = startDate && !isNaN(startDate.getTime());
  const dateString = isValidDate ? startDate.toLocaleDateString() : 'Started recently';

  const getDiffStyle = (diff: string) => {
    switch(diff) {
      case 'Easy': return { bg: '#DCFCE7', color: '#166534' };
      case 'Medium': return { bg: '#FEF3C7', color: '#92400E' };
      case 'Hard': return { bg: '#FEE2E2', color: '#991B1B' };
      default: return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ 
        padding: '0', height: '100%', overflowY: 'auto', 
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', 
        color: '#0F172A', position: 'relative' 
      }}
    >
      {/* --- LAYER 1: AMBIENT PAGE BACKGROUND --- */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '700px', background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '10%', left: '0%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: '0%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.03) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem', position: 'relative', zIndex: 10 }}>
      
        {/* --- RETURN TO SKILLS NAVIGATION --- */}
        <button 
          onClick={onBack} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6', 
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', 
            fontSize: '0.95rem', fontWeight: 800, padding: '10px 20px', borderRadius: '999px', 
            marginBottom: '3rem', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(59,130,246,0.08)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.08)'; }}
        >
          <ArrowLeft size={18} /> Return to Skills
        </button>

        {/* --- LAYER 2: SKILL HERO CARD --- */}
        <div style={{ 
          display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '4rem', background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)', 
          padding: '48px', borderRadius: '32px', border: '1px solid rgba(139,92,246,0.15)', 
          boxShadow: '0 24px 64px -16px rgba(59,130,246,0.12), inset 0 0 0 1px rgba(255,255,255,0.7)', 
          position: 'relative', overflow: 'hidden' 
        }}>
          {/* Subtle hero decorative shape */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '140%', background: 'linear-gradient(135deg, transparent 0%, rgba(139,92,246,0.04) 100%)', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1, flex: '1', minWidth: '300px' }}>
            {primaryDomain && (
              <div style={{ 
                fontSize: '0.9rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.15em', 
                textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' 
              }}>
                <div style={{ width: '24px', height: '24px', background: 'rgba(139,92,246,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={14} color="#8B5CF6" />
                </div>
                {primaryDomain.name}
              </div>
            )}
            
            <h1 style={{ 
              fontSize: '4.5rem', margin: '0 0 24px 0', fontWeight: 900, color: '#0F172A', 
              lineHeight: 1.05, letterSpacing: '-0.03em', textShadow: '0 4px 12px rgba(0,0,0,0.02)' 
            }}>
              {skill.canonicalName || skill.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ 
                fontSize: '0.95rem', color: statusColor, fontWeight: 800, padding: '8px 16px', 
                background: statusBg, borderRadius: '999px', border: `1px solid ${statusBg.replace('0.1)', '0.3)')}`,
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Award size={16} /> {statusLabel}
              </span>
              {(skill.progress || 0) > 0 && (
                <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                  Started {dateString}
                </span>
              )}
              {skill.completed && (
                <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
                  • Completed {new Date(skill.completed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {/* MASTERY AREA */}
          <div style={{ position: 'relative', zIndex: 1, flex: '0 0 auto', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', padding: '24px', background: 'rgba(255,255,255,0.6)', borderRadius: '24px', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div style={{ fontSize: '5rem', fontWeight: 900, color: '#3B82F6', lineHeight: 1, letterSpacing: '-0.04em', textShadow: '0 8px 24px rgba(59,130,246,0.15)' }}>
              {skill.progress || 0}%
            </div>
            <div style={{ fontSize: '1.1rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '8px' }}>
              Mastery
            </div>
            <div style={{ width: '100%', minWidth: '200px', height: '12px', background: 'rgba(147,197,253,0.2)', borderRadius: '999px', marginTop: '24px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${Math.min(100, skill.progress || 0)}%` }} 
                transition={{ duration: 1, ease: 'easeOut' }} 
                style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', borderRadius: '999px' }} 
              />
            </div>
          </div>
        </div>

        {/* --- LAYER 3: SKILL CURRICULUM DASHBOARD CARD --- */}
        {canonicalSkill?.curriculum && canonicalSkill.curriculum.length > 0 && (
          <div style={{ 
            marginBottom: '4rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', 
            borderRadius: '32px', border: '1px solid rgba(255,255,255,1)', padding: '48px', 
            boxShadow: '0 16px 48px -12px rgba(15,23,42,0.08)' 
          }}>
            <h2 style={{ 
              fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: '0 0 40px 0', 
              display: 'flex', alignItems: 'center', gap: '16px' 
            }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color="#3B82F6" />
              </div>
              Skill Curriculum
              <span style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 600, marginLeft: 'auto', background: '#F1F5F9', padding: '6px 16px', borderRadius: '999px' }}>
                {canonicalSkill.curriculum.reduce((acc: number, c: any) => acc + c.topics.length, 0)} items
              </span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {canonicalSkill.curriculum.map((c: any, i) => (
                <div key={i} style={{ 
                  background: 'rgba(248, 250, 252, 0.7)', borderRadius: '24px', 
                  borderLeft: '6px solid #3B82F6', borderTop: '1px solid rgba(226,232,240,0.8)',
                  borderRight: '1px solid rgba(226,232,240,0.8)', borderBottom: '1px solid rgba(226,232,240,0.8)',
                  padding: '32px' 
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', fontWeight: 900, color: '#334155', margin: '0 0 24px 0', 
                    textTransform: 'uppercase', letterSpacing: '0.05em' 
                  }}>
                    {c.section || c.group}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {c.topics.map((topic: any, j: number) => {
                      const st = skill.subtopics?.find(s => s.title === topic.title)
                      const isCompleted = st?.status === 'Completed'
                      const aiRec = st?.aiRecommendation
                      const trueDifficulty = (aiRec?.difficulty === 'Easy' || aiRec?.difficulty === 'Normal' || aiRec?.difficulty === 'Hard') 
                        ? aiRec.difficulty 
                        : (allTimeDistributions[skill.id]?.[topic.title]?.intentionalDifficulty || topic.difficulty || 'Normal');
                      
                      const diffStyle = getDiffStyle(trueDifficulty);

                      return (
                        <div 
                          key={j}
                          style={{ 
                            background: '#ffffff', borderRadius: '20px', padding: '24px', 
                            border: '1px solid rgba(226,232,240,1)', boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                            cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                            display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 16px 32px -8px rgba(139,92,246,0.15)';
                            e.currentTarget.style.borderColor = '#8B5CF6';
                            e.currentTarget.style.background = 'linear-gradient(180deg, #fff 0%, #fafaff 100%)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(226,232,240,1)';
                            e.currentTarget.style.background = '#ffffff';
                          }}
                          onClick={() => handleSubtopicClick(topic.title)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isCompleted ? '#16A34A' : '#0F172A', lineHeight: 1.4 }}>
                              {topic.title}
                            </span>
                            {isCompleted && <CheckCircle size={22} color="#16A34A" style={{ flexShrink: 0, marginLeft: '12px' }} />}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                            <span style={{ 
                              fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', 
                              borderRadius: '999px', background: diffStyle.bg, color: diffStyle.color,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: diffStyle.color }} />
                              {aiRec ? 'AI: ' : ''}{trueDifficulty}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BOTTOM DASHBOARD WIDGETS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          
          {/* Notes Widget */}
          <div style={{ 
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '32px', 
            border: '1px solid rgba(255,255,255,1)', padding: '40px', boxShadow: '0 12px 32px -8px rgba(15,23,42,0.06)' 
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(139,92,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="#8B5CF6" />
                </div>
                Notes & Learnings
              </div>
              {!isEditingNotes && (
                <button 
                  onClick={() => setIsEditingNotes(true)}
                  style={{ 
                    fontSize: '0.9rem', fontWeight: 800, padding: '8px 20px', borderRadius: '999px', 
                    background: '#F1F5F9', color: '#64748B', border: '1px solid rgba(226,232,240,1)', 
                    cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = 'rgba(226,232,240,1)'; e.currentTarget.style.color = '#64748B'; }}
                >
                  Edit Notes
                </button>
              )}
            </h3>
            
            {isEditingNotes ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <textarea 
                  value={editNotes} 
                  onChange={e => setEditNotes(e.target.value)}
                  style={{ 
                    background: '#F8FAFC', color: '#0F172A', padding: '20px', borderRadius: '16px', 
                    border: '1px solid rgba(203,213,225,1)', minHeight: '160px', fontSize: '1rem', 
                    width: '100%', fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setIsEditingNotes(false)} style={{ padding: '12px 24px', background: '#fff', color: '#64748B', border: '1px solid rgba(203,213,225,1)', borderRadius: '12px', cursor: 'pointer', fontWeight: 800 }}>Cancel</button>
                  <button onClick={handleSaveNotes} style={{ padding: '12px 24px', background: '#3B82F6', color: '#fff', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800, boxShadow: '0 8px 16px -4px rgba(59,130,246,0.3)' }}>Save Notes</button>
                </div>
              </div>
            ) : (
              <div style={{ 
                color: '#475569', lineHeight: 1.7, fontSize: '1.05rem', background: '#F8FAFC', 
                padding: '24px', borderRadius: '20px', border: '1px solid rgba(226,232,240,1)' 
              }}>
                {skill.notes ? skill.notes.split('\n').map((line, i) => <p key={i} style={{ margin: '0 0 12px 0' }}>{line}</p>) : <span style={{ fontStyle: 'italic', color: '#94A3B8' }}>No notes recorded for this skill yet.</span>}
              </div>
            )}
          </div>

          {/* Applied Projects Widget */}
          <div style={{ 
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '32px', 
            border: '1px solid rgba(255,255,255,1)', padding: '40px', boxShadow: '0 12px 32px -8px rgba(15,23,42,0.06)' 
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} color="#F59E0B" />
              </div>
              Applied Projects
            </h3>
            {skill.relatedProjects && skill.relatedProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {skill.relatedProjects.map((proj, idx) => (
                  <div key={idx} style={{ 
                    padding: '20px', background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', 
                    color: '#92400E', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', 
                    display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(245,158,11,0.2)',
                    boxShadow: '0 4px 12px rgba(245,158,11,0.05)'
                  }}>
                    <ChevronRight size={20} color="#D97706" /> {proj}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '1.05rem', background: '#F8FAFC', padding: '24px', borderRadius: '20px', border: '1px solid rgba(226,232,240,1)' }}>
                Not applied to any specific projects yet.
              </div>
            )}
          </div>
        </div>

        {/* --- MODALS / SESSIONS --- */}
        {activeSubtopic && (() => {
          const currentSubtopic = activeSubtopic;
          if (!currentSubtopic) return null;
          
          const dist = allTimeDistributions[skill.id]?.[currentSubtopic.title];
          const aiDiff = currentSubtopic.aiRecommendation?.difficulty;
          const trueDifficulty: 'Easy' | 'Normal' | 'Hard' =
            (aiDiff === 'Easy' || aiDiff === 'Normal' || aiDiff === 'Hard')
              ? aiDiff
              : (dist?.intentionalDifficulty || currentSubtopic.difficulty || 'Normal') as 'Easy' | 'Normal' | 'Hard';
          const tMins = dist?.teachingMinutes ?? 60;
          const sMins = dist?.solvingBaselineMinutes?.[trueDifficulty] ?? 25;
          const XP_BASE: Record<string, number> = { Easy: 60,  Normal: 150, Hard: 320 };
          const XP_MULT: Record<string, number> = { Easy: 3.5, Normal: 5.5, Hard: 9.0 };
          const dynamicXP = Math.round(
            (XP_BASE[trueDifficulty] ?? 150) + sMins * (XP_MULT[trueDifficulty] ?? 5.5)
          );
          
          return (
            <LearningSession
              subtopic={{ ...currentSubtopic, difficulty: trueDifficulty, baseXP: dynamicXP }}
              teachingMinutes={tMins}
              solvingBaselineMinutes={sMins}
              onClose={() => {
                setActiveSubtopic(null)
                if (onCloseSession) onCloseSession()
              }}
              onStart={() => {
                setActiveSubtopic(null)
                if (onStartSession) onStartSession(currentSubtopic)
              }}
              aiRecommendation={currentSubtopic.aiRecommendation}
            />
          )
        })()}
        
        {showBlockDialog && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fff', padding: '48px', borderRadius: '32px', maxWidth: '440px', border: '1px solid rgba(226,232,240,1)', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#EF4444', fontWeight: 900, marginTop: 0 }}>Session Active</h3>
              <p style={{ color: '#475569', marginBottom: '40px', lineHeight: 1.6, fontSize: '1.1rem' }}>
                You already have an active learning session. Complete or cancel the current task before starting another.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowBlockDialog(false)} style={{ padding: '14px 28px', background: '#0F172A', color: '#fff', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 8px 16px -4px rgba(15,23,42,0.2)' }}>
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </motion.div>
  )
}
