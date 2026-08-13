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

// HTML void elements that should NOT receive a closing tag
const HTML_VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr'
]);

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
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{
          background: 'var(--bg-card)', border: `1px solid ${phase === 'coding' ? 'var(--primary)' : 'var(--cyan)'}`,
          borderRadius: '24px', padding: '2.5rem', maxWidth: '650px', width: '90%',
          position: 'relative', boxShadow: `0 25px 50px -12px ${phase === 'coding' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,255,255,0.15)'}`
        }}
      >
        <button 
          onClick={onCancel}
          disabled={step === 'loading_question' || step === 'evaluating'}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: (step === 'loading_question' || step === 'evaluating') ? 0.5 : 1 }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {phase === 'theory' ? <BookOpen size={28} color="var(--cyan)" /> : <Code size={28} color="var(--primary)" />}
          <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--text-main)' }}>
            Knowledge Check: {phase === 'theory' ? 'Theory' : 'Practical'}
          </h2>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--cyan)', borderRadius: '2px', opacity: 1 }}></div>
          <div style={{ flex: 1, height: '4px', background: phase === 'coding' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'background 0.3s' }}></div>
        </div>

        <div style={{ marginBottom: '2rem', padding: '1rem', background: phase === 'theory' ? 'rgba(0,255,255,0.05)' : 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: `1px solid ${phase === 'theory' ? 'rgba(0,255,255,0.1)' : 'rgba(99, 102, 241, 0.1)'}` }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Topic: {activeSession.subtopic.title}
          </p>
          <p style={{ margin: 0, color: phase === 'theory' ? 'var(--cyan)' : 'var(--primary)', fontSize: '0.85rem' }}>
            Step {phase === 'theory' ? '1' : '2'} of 2 — Difficulty: {activeSession.subtopic.difficulty || 'Normal'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'loading_question' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
              <RefreshCw size={32} className="spin" style={{ color: phase === 'theory' ? 'var(--cyan)' : 'var(--primary)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>Generating {phase} question...</p>
            </motion.div>
          )}

          {step === 'answering' && (
            <motion.div key="answering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {question || 'Could not load question.'}
              </h3>

              {error && (
                <div style={{ color: '#ff453a', background: 'rgba(255, 69, 58, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {phase === 'theory' ? (
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Explain in your own words. (Copy/paste is disabled)
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    placeholder="Type your explanation here..."
                    style={{
                      width: '100%', minHeight: '140px', padding: '1rem',
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      borderRadius: '12px', color: 'var(--text-main)', fontSize: '1rem',
                      lineHeight: 1.5, resize: 'vertical'
                    }}
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
                    onMount={(editor, monaco) => {
                      const model = editor.getModel();
                      // Enable HTML auto-closing tags at the language level
                      // @ts-ignore – htmlDefaults may not be typed in all versions
                      monaco.languages.html?.htmlDefaults?.setOptions?.({ autoClosingTags: true });

                      // Custom auto-close handler: insert closing tag when user types '>'
                      // This works reliably even when Monaco's HTML worker isn't loaded
                      // @ts-ignore – onDidType exists on the editor instance
                      editor.onDidType((text: string) => {
                        if (text !== '>' || !model) return;

                        const position = editor.getPosition();
                        if (!position) return;

                        const lineContent = model.getLineContent(position.lineNumber);
                        // Get text before the cursor (which is right after the '>' we just typed)
                        const textBeforeCursor = lineContent.substring(0, position.column - 1);
                        const textAfterCursor = lineContent.substring(position.column - 1);

                        // Match an opening tag: <tagName or <tagName attr="val"
                        // Must end with '>' (the character we just typed)
                        const tagMatch = textBeforeCursor.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>$/);
                        if (!tagMatch) return;

                        const tagName = tagMatch[1].toLowerCase();

                        // Don't auto-close void/self-closing elements
                        if (HTML_VOID_ELEMENTS.has(tagName)) return;

                        // Don't auto-close if it looks like a self-closing tag e.g. <br />
                        if (textBeforeCursor.match(/\/\s*>$/)) return;

                        const closingTag = `</${tagMatch[1]}>`;

                        // Don't insert if the closing tag already exists right after cursor
                        if (textAfterCursor.startsWith(closingTag)) return;

                        // Insert the closing tag at the current cursor position
                        const range = new monaco.Range(
                          position.lineNumber,
                          position.column,
                          position.lineNumber,
                          position.column
                        );
                        editor.executeEdits('auto-close-tag', [{
                          range,
                          text: closingTag,
                          forceMoveMarkers: false
                        }]);
                        // Keep cursor between the opening and closing tags
                        editor.setPosition(position);
                      });
                    }}
                     />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="secondary-btn" onClick={() => loadQuestion(phase)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <RefreshCw size={16} /> New Question
                </button>
                <button 
                  className="primary-btn" 
                  onClick={handleSubmit} 
                  disabled={!answer.trim()}
                  style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: !answer.trim() ? 0.5 : 1 }}
                >
                  <Send size={16} /> Submit Answer
                </button>
              </div>
            </motion.div>
          )}

          {step === 'evaluating' && (
            <motion.div key="evaluating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
              <BrainCircuit size={48} className="pulse" style={{ color: phase === 'theory' ? 'var(--cyan)' : 'var(--primary)', marginBottom: '1.5rem', opacity: 0.8 }} />
              <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 500 }}>Evaluating your {phase} answer...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Verifying understanding of core concepts</p>
            </motion.div>
          )}

          {step === 'result' && evaluation && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {evaluation.passed ? (
                  <CheckCircle size={56} color="#34d399" style={{ marginBottom: '1rem' }} />
                ) : (
                  <AlertCircle size={56} color="#ff453a" style={{ marginBottom: '1rem' }} />
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

              <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, margin: 0, fontSize: '1.05rem' }}>
                  {evaluation.feedback}
                </p>
                
                {!evaluation.passed && evaluation.missingPoints && evaluation.missingPoints.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Missing Points:</p>
                    <ul style={{ color: 'var(--text-muted)', margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                      {evaluation.missingPoints.map((pt, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{pt}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {evaluation.passed ? (
                  phase === 'theory' ? (
                    <button 
                      className="primary-btn" 
                      onClick={handleNextPhase} 
                      style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--primary)' }}
                    >
                      <Code size={20} /> Continue to Practical
                    </button>
                  ) : (
                    <button 
                      className="primary-btn" 
                      onClick={onPass} 
                      style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#34d399' }}
                    >
                      <CheckCircle size={20} /> Complete Task & Claim XP
                    </button>
                  )
                ) : (
                  <>
                    <button className="secondary-btn" onClick={onCancel} style={{ flex: 1 }}>
                      Cancel Task
                    </button>
                    <button className="primary-btn" onClick={() => loadQuestion(phase)} style={{ flex: 1 }}>
                      Try Another Question
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
