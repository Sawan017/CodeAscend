import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface SubmitFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function SubmitFeedbackModal({ isOpen, onClose, userId }: SubmitFeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState('Feature Request')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please provide a message.')
      return
    }
    setLoading(true)
    setError(null)
    
    try {
      const { error: insertError } = await supabase!.from('support_feedback').insert({
        user_id: userId,
        feedback_type: feedbackType,
        rating: rating > 0 ? rating : null,
        message
      })

      if (insertError) throw insertError
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setFeedbackType('Feature Request')
        setRating(0)
        setMessage('')
        onClose()
      }, 2000)
    } catch (e: any) {
      setError(e.message || 'Failed to submit feedback.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose() }}
        >
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="drawer-card"
            style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <MessageSquare size={20} color="#8b5cf6" /> Submit Feedback
              </h3>
              <button onClick={onClose} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#10b981' }}>Feedback submitted successfully! Thank you.</div>
              ) : (
                <>
                  {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>{error}</div>}
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Feedback Type</label>
                    <select value={feedbackType} onChange={e => setFeedbackType(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}>
                      <option>Feature Request</option>
                      <option>General Feedback</option>
                      <option>UI/UX Suggestion</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rating (Optional)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={28} 
                          fill={(hoverRating || rating) >= star ? '#f59e0b' : 'transparent'} 
                          color={(hoverRating || rating) >= star ? '#f59e0b' : 'var(--text-muted)'}
                          style={{ cursor: 'pointer', transition: 'all 0.1s' }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="What's on your mind?" style={{ width: '100%', minHeight: '120px', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }} />
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <button className="primary-btn" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '0.875rem', display: 'flex', justifyContent: 'center', background: '#8b5cf6', color: '#fff', border: 'none' }}>
                      {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
