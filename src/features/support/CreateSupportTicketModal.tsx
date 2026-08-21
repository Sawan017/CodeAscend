import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Paperclip, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface CreateSupportTicketModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess?: (ticket: any) => void
}

export function CreateSupportTicketModal({ isOpen, onClose, userId, onSuccess }: CreateSupportTicketModalProps) {
  const [category, setCategory] = useState('Bug')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setError('Please provide a subject.')
      return
    }
    if (!description.trim()) {
      setError('Please provide a description.')
      return
    }
    setLoading(true)
    setError(null)
    
    try {
      let attachmentPath = null
      
      if (file) {
        // Enforce safe types & size
        if (file.size > 5 * 1024 * 1024) throw new Error('File must be less than 5MB')
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Only JPG, PNG, and WebP images are allowed.')
        }
        
        const ext = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${ext}`
        
        const { error: uploadError } = await supabase!.storage
          .from('support_attachments')
          .upload(fileName, file)
          
        if (uploadError) throw uploadError
        attachmentPath = fileName
      }

      const { data: ticketData, error: insertError } = await supabase!.from('support_tickets').insert({
        user_id: userId,
        category,
        subject,
        description,
        screenshot_path: attachmentPath,
        status: 'ai_assisting'
      }).select().single()

      if (insertError) throw insertError
      
      // Auto-insert initial message
      await supabase!.from('support_messages').insert({
        ticket_id: ticketData.id,
        sender_id: userId,
        sender_type: 'user',
        message: description,
        attachment_path: attachmentPath
      })

      // Trigger AI Support (non-blocking)
      supabase!.functions.invoke('support-ai', {
        body: { ticketId: ticketData.id, isNew: true }
      }).then(({ error }) => {
        if (error) {
          console.error("AI trigger returned error:", error);
          // Fallback if network or invoke fails entirely
          supabase!.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', ticketData.id).then();
        }
      }).catch(e => {
        console.error("AI trigger caught exception:", e);
      });

      // Clear state before closing/redirecting
      setCategory('Bug')
      setSubject('')
      setDescription('')
      setFile(null)
      if (onSuccess) {
        onSuccess(ticketData)
      } else {
        setCreatedTicketNumber(ticketData.ticket_number)
        setSuccess(true)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to submit report.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state before closing
    setSuccess(false)
    setCategory('Bug')
    setSubject('')
    setDescription('')
    setFile(null)
    setCreatedTicketNumber(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget && !loading) handleClose() }}
        >
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="drawer-card"
            style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <AlertTriangle size={20} color="#3b82f6" /> Create Support Ticket
              </h3>
              <button onClick={handleClose} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)' }}>Ticket Created</h4>
                  <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)' }}>Ticket ID: {createdTicketNumber || 'Generated'}</p>
                  <button className="primary-btn" onClick={handleClose} style={{ padding: '0.75rem 1.5rem' }}>Back to Tickets</button>
                </div>
              ) : (
                <>
                  {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>{error}</div>}
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}>
                      <option>Bug / Glitch</option>
                      <option>Account Issue</option>
                      <option>Payment / Billing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Subject</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary of the issue..." style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', marginBottom: '1.25rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Please describe the issue in detail..." style={{ width: '100%', minHeight: '120px', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }} />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Screenshot (Optional)</label>
                    <input type="file" accept="image/jpeg,image/png,image/webp" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                    <button className="secondary-btn" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <Paperclip size={18} /> {file ? file.name : 'Attach Image (Max 5MB)'}
                    </button>
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <button className="primary-btn" onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '0.875rem', display: 'flex', justifyContent: 'center', background: '#3b82f6', color: '#fff', border: 'none' }}>
                      {loading ? 'Submitting...' : 'Create Ticket'}
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
