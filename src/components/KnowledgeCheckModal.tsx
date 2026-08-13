import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'; import { Editor } from '@monaco-editor/react'
import { X, BrainCircuit, CheckCircle, AlertCircle, RefreshCw, Send, Code, BookOpen } from 'lucide-react'
import type { ActiveSessionState } from '../types'
import { generateKnowledgeCheckQuestion, evaluateKnowledgeCheckAnswer, type KnowledgeCheckEvaluation, type KnowledgeCheckPhase } from '../lib/knowledgeCheck'

type KnowledgeCheckModalProps = {
  activeSession: ActiveSessionState
  onPass: () => void
  onCancel: () => void
}
/** Normalize a question string for duplicate comparison */
function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Check if two questions are substantially similar */
function isSimilarQuestion(a: string, b: string): boolean {
  const na = normalizeQuestion(a);
  const nb = normalizeQuestion(b);
  if (na === nb) return true;
  // Check if one is a substring of the other (catches minor rewording)
  if (na.length > 20 && nb.length > 20) {
    if (na.includes(nb) || nb.includes(na)) return true;
    // Jaccard similarity on word-level tokens
    const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    if (wordsA.size === 0 || wordsB.size === 0) return false;
    let intersection = 0;
    for (const w of wordsA) { if (wordsB.has(w)) intersection++; }
    const union = wordsA.size + wordsB.size - intersection;
    if (union > 0 && intersection / union > 0.8) return true;
  }
  return false;
}

export function KnowledgeCheckModal({ activeSession, onPass, onCancel }: KnowledgeCheckModalProps) {
  const [phase, setPhase] = useState<KnowledgeCheckPhase>('theory')
  const [step, setStep] = useState<'loading_question' | 'answering' | 'evaluating' | 'result'>('loading_question')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<KnowledgeCheckEvaluation | null>(null)
  const [error, setError] = useState('')
  // Track recently shown questions to avoid duplicates
  const recentQuestionsRef = useRef<string[]>([])
  const MAX_RECENT = 5
  const MAX_RETRIES = 3

  const loadQuestion = useCallback(async (currentPhase: KnowledgeCheckPhase) => {
    setStep('loading_question')
    setError('')
    setAnswer('')
    setEvaluation(null)
    
    try {
      let q = '';
      let attempts = 0;
      const recentList = recentQuestionsRef.current;

      while (attempts < MAX_RETRIES) {
        q = await generateKnowledgeCheckQuestion(
          activeSession.skillId, 
          activeSession.subtopic.title, 
          activeSession.subtopic.difficulty || 'Normal',
          currentPhase,
          recentList
        );
        // Check for duplicates against recent history
        const isDuplicate = recentList.some(prev => isSimilarQuestion(prev, q));
        if (!isDuplicate || attempts >= MAX_RETRIES - 1) break;
        attempts++;
      }

      // Record the question in recent history
      recentQuestionsRef.current = [...recentList, q].slice(-MAX_RECENT);
      setQuestion(q)
      setStep('answering')
    } catch (e) {
      setError('Failed to generate a question. Please try again.')
      setStep('answering')
    }
  }, [activeSession.skillId, activeSession.subtopic.title, activeSession.subtopic.difficulty])

  useEffect(() => {
    // Reset question history when phase changes
    recentQuestionsRef.current = [];
    loadQuestion(phase)
  }, [phase, loadQuestion])

  const handleSubmit = async () => {
    if (!answer.trim()) return

    setStep('evaluating')
    setError('')

    try {
      const result = await evaluateKnowledgeCheckAnswer(
        activeSession.skillId,
        activeSession.subtopic.title,
        activeSession.subtopic.difficulty || 'Normal',
        question,
        answer,
        phase
      )
      setEvaluation(result)
      setStep('result')
    } catch (e) {
      setError('Failed to evaluate your answer. Please try again.')
      setStep('answering')
    }
  }

  const handleNextPhase = () => {
    if (phase === 'theory') {
      setPhase('coding') // Triggers loadQuestion via useEffect
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(3,4,7,0.85)', backdropFilter: 'blur(24px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{
          background: 'linear-gradient(145deg, rgba(10,13,20,0.9) 0%, rgba(10,13,20,0.6) 100%)',
          border: `1px solid ${phase === 'coding' ? 'rgba(139,92,246,0.5)' : 'rgba(6,182,212,0.5)'}`,
          borderRadius: '24px', padding: '2.5rem', maxWidth: '700px', width: '90%',
          position: 'relative', boxShadow: `0 25px 50px -12px ${phase === 'coding' ? 'rgba(168,85,247,0.2)' : 'rgba(6,182,212,0.2)'}`,
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: phase === 'coding' ? 'linear-gradient(90deg, #a855f7, #7e22ce)' : 'linear-gradient(90deg, var(--cyan), var(--primary))' }} />

        <button 
          onClick={onCancel}
          disabled={step === 'loading_question' || step === 'evaluating'}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s', opacity: (step === 'loading_question' || step === 'evaluating') ? 0.5 : 1 }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: phase === 'coding' ? 'rgba(168,85,247,0.1)' : 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${phase === 'coding' ? 'rgba(168,85,247,0.2)' : 'rgba(6,182,212,0.2)'}` }}>
            {phase === 'theory' ? <BookOpen size={24} color="var(--cyan)" /> : <Code size={24} color="#a855f7" />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: phase === 'theory' ? 'var(--cyan)' : '#a855f7', textTransform: 'uppercase', marginBottom: '0.25rem' }}>VERIFICATION SEQUENCE</p>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff', fontWeight: 600, letterSpacing: '-0.02em' }}>
              {phase === 'theory' ? 'Theoretical Knowledge' : 'Practical Application'}
            </h2>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--cyan)', borderRadius: '2px', opacity: 1, boxShadow: '0 0 10px var(--cyan)' }}></div>
          <div style={{ flex: 1, height: '4px', background: phase === 'coding' ? '#a855f7' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'background 0.3s', boxShadow: phase === 'coding' ? '0 0 10px #a855f7' : 'none' }}></div>
        </div>

        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: phase === 'theory' ? 'rgba(6,182,212,0.05)' : 'rgba(168,85,247,0.05)', borderRadius: '16px', border: `1px solid ${phase === 'theory' ? 'rgba(6,182,212,0.1)' : 'rgba(168,85,247,0.1)'}` }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>
            Active Protocol: <span style={{ color: '#fff' }}>{activeSession.subtopic.title}</span>
          </p>
          <p style={{ margin: 0, color: phase === 'theory' ? 'var(--cyan)' : '#a855f7', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            SEQUENCE {phase === 'theory' ? '1' : '2'} / 2 <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.2)' }}>|</span> DIFFICULTY: {activeSession.subtopic.difficulty?.toUpperCase() || 'NORMAL'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'loading_question' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: phase === 'theory' ? 'rgba(6,182,212,0.1)' : 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <RefreshCw size={28} className="spin" style={{ color: phase === 'theory' ? 'var(--cyan)' : '#a855f7' }} />
              </div>
              <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 500, margin: 0, letterSpacing: '0.05em' }}>Synthesizing Evaluation Matrix...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Accessing knowledge base for {phase} protocol</p>
            </motion.div>
          )}

          {step === 'answering' && (
            <motion.div key="answering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.6, fontWeight: 500 }}>
                {question || 'Could not load question.'}
              </h3>

              {error && (
                <div style={{ color: '#ff453a', background: 'rgba(255, 69, 58, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid rgba(255, 69, 58, 0.2)' }}>
                  <AlertCircle size={18} /> <span style={{ fontSize: '0.9rem' }}>{error}</span>
                </div>
              )}

              {phase === 'theory' ? (
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Response Required <span style={{ opacity: 0.5, fontWeight: 400 }}>(External Input Disabled)</span>
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    placeholder="Enter your analysis..."
                    style={{
                      width: '100%', minHeight: '160px', padding: '1.25rem',
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', color: '#fff', fontSize: '1rem',
                      lineHeight: 1.6, resize: 'vertical', outline: 'none', transition: 'all 0.2s',
                      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '1.5rem' }}>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Provide your code solution below:
                  </p>
                  <Editor
                    height="250px"
                    defaultLanguage={(() => {
                      const skill = activeSession.skillId?.toLowerCase() || ''
                      if (skill.includes('python')) return 'python'
                      if (skill.includes('html')) return 'html'
                      if (skill.includes('css')) return 'css'
                      if (skill.includes('js') || skill.includes('javascript')) return 'javascript'
                      return 'plaintext'
                    })()}
                    language={(() => {
                      const skill = activeSession.skillId?.toLowerCase() || ''
                      if (skill.includes('python')) return 'python'
                      if (skill.includes('html')) return 'html'
                      if (skill.includes('css')) return 'css'
                      if (skill.includes('js') || skill.includes('javascript')) return 'javascript'
                      return 'plaintext'
                    })()}
                    theme="vs-dark"
                    value={answer}
                    onChange={(value) => setAnswer(value || '')}
                    options={{
                      fontSize: 14,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      minimap: { enabled: false },
                      autoClosingBrackets: 'always',
                      // @ts-ignore - enable native HTML tag auto-closing
                      autoClosingTags: 'always',
                      autoClosingQuotes: 'always'
                    }}
                    onMount={(_editor, monaco) => {
                      // Enable HTML auto-closing tags at the language level
                      // @ts-ignore – htmlDefaults may not be typed in all versions
                      monaco.languages.html?.htmlDefaults?.setOptions?.({ autoClosingTags: true });
                    }}
                     />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button style={{ padding: '0.85rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', transition: 'all 0.2s' }} onClick={() => loadQuestion(phase)} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                  <RefreshCw size={16} /> Reroll Prompt
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!answer.trim()}
                  style={{ padding: '0.85rem 1.5rem', background: phase === 'coding' ? 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' : 'linear-gradient(135deg, var(--cyan) 0%, var(--primary) 100%)', color: phase === 'coding' ? '#fff' : '#000', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: answer.trim() ? 'pointer' : 'not-allowed', display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: !answer.trim() ? 0.5 : 1, transition: 'transform 0.2s', boxShadow: phase === 'coding' ? '0 4px 15px rgba(168,85,247,0.4)' : '0 4px 15px rgba(6,182,212,0.4)' }}
                  onMouseEnter={(e) => { if (answer.trim()) e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Send size={16} /> Submit Analysis
                </button>
              </div>
            </motion.div>
          )}

          {step === 'evaluating' && (
            <motion.div key="evaluating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: phase === 'theory' ? 'rgba(6,182,212,0.1)' : 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <BrainCircuit size={40} className="pulse" style={{ color: phase === 'theory' ? 'var(--cyan)' : '#a855f7' }} />
              </div>
              <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.05em', margin: 0 }}>Processing Submission...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Comparing parameters against knowledge base</p>
            </motion.div>
          )}

          {step === 'result' && evaluation && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {evaluation.passed ? (
                  <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '50%', marginBottom: '1rem', boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)' }}>
                    <CheckCircle size={48} color="#34d399" />
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(255, 69, 58, 0.1)', borderRadius: '50%', marginBottom: '1rem', boxShadow: '0 0 20px rgba(255, 69, 58, 0.2)' }}>
                    <AlertCircle size={48} color="#ff453a" />
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.5rem', color: evaluation.passed ? '#34d399' : '#ff453a', margin: '0 0 0.5rem 0' }}>
                  {evaluation.passed 
                    ? (phase === 'theory' ? '✓ Theory verified' : '✓ Knowledge Check Passed')
                    : 'Needs Review'}
                </h3>
                
                {evaluation.aiGenerated && (
                  <div style={{ display: 'inline-block', background: 'rgba(255, 69, 58, 0.1)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, color: '#ff453a', border: '1px solid rgba(255, 69, 58, 0.3)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                    Flagged as copied / AI generated
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                <p style={{ color: '#fff', lineHeight: 1.6, margin: 0, fontSize: '1rem' }}>
                  {evaluation.feedback}
                </p>
                
                {!evaluation.passed && evaluation.missingPoints && evaluation.missingPoints.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#ff453a', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Missing Critical Parameters:</p>
                    <ul style={{ color: 'var(--text-muted)', margin: 0, paddingLeft: '1.5rem', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {evaluation.missingPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {evaluation.passed ? (
                  phase === 'theory' ? (
                    <button 
                      onClick={handleNextPhase} 
                      style={{ flex: 1, padding: '1.25rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(168,85,247,0.4)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Code size={20} /> Initialize Practical Phase
                    </button>
                  ) : (
                    <button 
                      onClick={onPass} 
                      style={{ flex: 1, padding: '1.25rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(52, 211, 153, 0.4)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <CheckCircle size={20} /> Confirm Sequence & Acquire XP
                    </button>
                  )
                ) : (
                  <>
                    <button style={{ flex: 1, padding: '1.25rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, transition: 'all 0.2s' }} onClick={onCancel} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                      Abort Sequence
                    </button>
                    <button style={{ flex: 1, padding: '1.25rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => loadQuestion(phase)} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                      Re-attempt Verification
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
