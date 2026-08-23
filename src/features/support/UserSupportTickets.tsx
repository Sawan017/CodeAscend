import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, MessageSquare, Plus, Paperclip, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ReactMarkdown from 'react-markdown'
import { formatAppDateTime } from '../../lib/dateFormatting'
import { CreateSupportTicketModal } from './CreateSupportTicketModal'

export function UserSupportTickets({ userId, onBack }: { userId: string, onBack: () => void }) {
  const [showReportModal, setShowReportModal] = useState(false)
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, type: 'close' | 'delete' | null}>({isOpen: false, type: null})

  useEffect(() => {
    loadTickets()
    
    // Realtime ticket updates
    const sub = supabase!
      .channel('public:support_tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${userId}` }, () => {
        loadTickets()
      })
      .subscribe()

    return () => { supabase!.removeChannel(sub) }
  }, [userId])

  const loadTickets = async () => {
    try {
      if (!userId) return;
      const { data, error } = await supabase!.from('support_tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (error) throw error
      if (data) setTickets(data)
    } catch (err) {
      console.error('Error loading tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedTicket) return
    loadMessages(selectedTicket.id)
    
    // Realtime messages for this ticket
    const sub = supabase!
      .channel(`public:support_messages:${selectedTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${selectedTicket.id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .subscribe()

    return () => { supabase!.removeChannel(sub) }
  }, [selectedTicket])

  const loadMessages = async (ticketId: string) => {
    const { data } = await supabase!.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true })
    if (data) setMessages(data)
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return
    setSending(true)
    
    const msg = newMessage.trim()
    setNewMessage('')
    
    await supabase!.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_id: userId,
      sender_type: 'user',
      message: msg
    })

    // If still in AI mode, trigger AI
    if (selectedTicket.status === 'ai_assisting') {
      try {
        const { error: invokeErr } = await supabase!.functions.invoke('support-ai', {
          body: { ticketId: selectedTicket.id, message: msg, isNew: false }
        });
        if (invokeErr) {
          console.error("AI function returned error:", invokeErr);
          await supabase!.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', selectedTicket.id);
        }
      } catch (e) {
        console.error("AI function error:", e);
      }
    }
    
    setSending(false)
  }



  
  const executeDeleteTicket = async () => {
    if (!selectedTicket || selectedTicket.status !== 'closed') return;
    
    // Explicitly enforce status on the client side query too, though RLS protects it
    const { error } = await supabase!.from('support_tickets').delete().eq('id', selectedTicket.id).eq('status', 'closed');

    if (error) {
      console.error("Failed to delete ticket:", error);
      console.error("Error deleting ticket: " + error.message);
      return;
    }

    // Removed window.alert
    setSelectedTicket(null);
    loadTickets();
    setConfirmModal({isOpen: false, type: null});
  }

  
  const executeEndTicket = async () => {
    if (!selectedTicket) return;
    
    // Insert system message for history BEFORE closing, so RLS allows the insert
    await supabase!.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_type: 'system',
      message: 'Ticket was closed by user.'
    });

    // Perform update
    const { error } = await supabase!.from('support_tickets').update({ 
      status: 'closed', 
      closed_at: new Date().toISOString(),
      closed_by: userId
    }).eq('id', selectedTicket.id);

    if (error) {
      console.error("Failed to close ticket:", error);
      return;
    }

    loadTickets();
    setSelectedTicket({ ...selectedTicket, status: 'closed' });
    setConfirmModal({isOpen: false, type: null});
  }

  const handleConfirmResolved = async (resolved: boolean) => {

    if (!selectedTicket) return
    if (resolved) {
      await supabase!.from('support_tickets').update({ status: 'closed' }).eq('id', selectedTicket.id)
      await supabase!.from('support_messages').insert({
        ticket_id: selectedTicket.id,
        sender_type: 'system',
        message: 'User confirmed the issue is resolved. Ticket closed.'
      })
    } else {
      await supabase!.from('support_tickets').update({ status: 'waiting_for_official' }).eq('id', selectedTicket.id)
      await supabase!.from('support_messages').insert({
        ticket_id: selectedTicket.id,
        sender_type: 'system',
        message: 'User indicated the issue is not solved. Escalating to human official.'
      })
    }
    loadTickets()
    const { data } = await supabase!.from('support_tickets').select('*').eq('id', selectedTicket.id).single()
    if (data) setSelectedTicket(data)
  }

  const statusLabels: any = {
    ai_assisting: 'AI Assisting',
    waiting_for_official: 'Waiting for Official',
    official_assigned: 'Official Assigned',
    resolved: 'Resolved',
    closed: 'Closed'
  }
  const statusColors: any = {
    ai_assisting: '#3b82f6',
    waiting_for_official: '#eab308',
    official_assigned: '#8b5cf6',
    resolved: '#10b981',
    closed: '#6b7280'
  }

  if (selectedTicket) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-panel)' }}>
          <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedTicket.ticket_number} - {selectedTicket.category}</h3>
            <span style={{ fontSize: '0.8rem', color: statusColors[selectedTicket.status], padding: '2px 8px', background: `${statusColors[selectedTicket.status]}20`, borderRadius: '12px' }}>
              {statusLabels[selectedTicket.status]}
            </span>
          </div>

          {selectedTicket.status !== 'closed' && (
             <button 
               onClick={() => setConfirmModal({isOpen: true, type: 'close'})} 
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
             >
               End & Close Ticket
             </button>
          )}
          {selectedTicket.status === 'closed' && (
             <button 
               onClick={() => setConfirmModal({isOpen: true, type: 'delete'})} 
               style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
             >
               Delete Ticket
             </button>
          )}

        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-surface-sunken)' }}>
          <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem' }}>
            <strong>Original Issue:</strong><br/>
            {selectedTicket.description}
            {selectedTicket.screenshot_path && (
              <div style={{ marginTop: '0.5rem' }}>
                <a href={supabase!.storage.from('support_attachments').getPublicUrl(selectedTicket.screenshot_path).data.publicUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Paperclip size={16} /> View Attached Screenshot
                </a>
              </div>
            )}
          </div>

          {messages.map(msg => {
            const isMe = msg.sender_id === userId
            const isSystem = msg.sender_type === 'system'
            const isAi = msg.sender_type === 'ai'

            if (isSystem) {
              return (
                <div key={msg.id} style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {msg.message}
                </div>
              )
            }

            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                {!isMe && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', marginLeft: '0.5rem' }}>
                    {isAi ? 'Arinova AI Support' : 'Support Official'}
                  </div>
                )}
                <div style={{ 
                  background: isMe ? 'var(--primary)' : 'var(--bg-panel)', 
                  color: isMe ? '#000' : 'var(--text-main)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '16px', 
                  borderBottomRightRadius: isMe ? '4px' : '16px',
                  borderBottomLeftRadius: !isMe ? '4px' : '16px',
                  border: isMe ? 'none' : '1px solid var(--border)'
                }}>
                  {isMe ? msg.message : <div className="support-markdown"><ReactMarkdown>{msg.message}</ReactMarkdown></div>}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isMe ? 'right' : 'left' }}>
                  {formatAppDateTime(msg.created_at)}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
          
          {selectedTicket.status === 'resolved' && (
            <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--primary)', textAlign: 'center', marginTop: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Is this issue resolved?</h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>The support team marked this as resolved. Please confirm.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="primary-btn" onClick={() => handleConfirmResolved(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: '#fff', border: 'none' }}>
                  <CheckCircle size={18} /> Yes, Solved
                </button>
                <button className="secondary-btn" onClick={() => handleConfirmResolved(false)}>
                  No, I still need help
                </button>
              </div>
            </div>
          )}
          {selectedTicket.status === 'closed' && (
            <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', marginTop: '1rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)' }}>Ticket Closed</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>This conversation has been closed and is now read-only.</p>
            </div>
          )}
        </div>

        {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--bg-panel)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', border: '1px solid var(--border-strong)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
              disabled={sending}
            />
            <button 
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5 }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        )}
        
      {confirmModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>
              {confirmModal.type === 'close' ? 'End & Close Ticket?' : 'Delete Ticket?'}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {confirmModal.type === 'close' 
                ? 'Are you sure you want to end and close this ticket?' 
                : 'Delete this ticket permanently? This will delete the ticket and its conversation history and cannot be undone.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setConfirmModal({isOpen: false, type: null})}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.type === 'close' ? executeEndTicket : executeDeleteTicket}
                style={{ background: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                {confirmModal.type === 'close' ? 'End & Close Ticket' : 'Delete Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-main)' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> My Support Tickets
          </h2>
        </div>
        <button className="primary-btn" onClick={() => setShowReportModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
            <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>You don't have any support tickets yet.</p>
          </div>
        ) : (
          tickets.map(t => (
            <div 
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="drawer-card"
              style={{ background: 'var(--bg-panel)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.ticket_number} - {t.category}</div>
                <span style={{ fontSize: '0.75rem', color: statusColors[t.status], padding: '2px 8px', background: `${statusColors[t.status]}20`, borderRadius: '12px' }}>
                  {statusLabels[t.status]}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.description}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Last updated: {formatAppDateTime(t.updated_at)}
              </div>
            </div>
          ))
        )}
      </div>



      <CreateSupportTicketModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        userId={userId} 
        onSuccess={(ticket) => {
          setShowReportModal(false);
          setSelectedTicket(ticket);
        }}
      />
    </div>
  )
}
