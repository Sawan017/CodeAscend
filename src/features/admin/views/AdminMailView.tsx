import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { Mail, Edit3, Send, X, AlertCircle, CheckCircle2, Clock, Inbox, ChevronRight } from 'lucide-react';

interface AdminMail {
  id: string;
  subject: string;
  message: string;
  priority: string;
  created_at: string;
  read_by: string[];
}

export function AdminMailView() {
  const [mails, setMails] = useState<AdminMail[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  
  // Compose state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [sending, setSending] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      loadMails();
    }
    init();
  }, []);

  async function loadMails() {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_admin_mails');
    if (!error && data) {
      setMails(data);
    }
    setLoading(false);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    
    setSending(true);
    const { error } = await supabase.rpc('send_admin_mail', {
      p_subject: subject,
      p_message: message,
      p_priority: priority
    });
    
    setSending(false);
    if (!error) {
      setComposing(false);
      setSubject('');
      setMessage('');
      setPriority('Normal');
      loadMails();
    }
  }

  async function handleMarkRead(id: string) {
    if (!currentUserId) return;
    const mail = mails.find(m => m.id === id);
    if (mail && !mail.read_by?.includes(currentUserId)) {
      // Optimistic update
      setMails(prev => prev.map(m => m.id === id ? { ...m, read_by: [...(m.read_by || []), currentUserId] } : m));
      await supabase.rpc('mark_admin_mail_read', { p_mail_id: id });
    }
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Urgent': return '#ef4444';
      case 'Important': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={24} color="#f59e0b" />
            Internal Mail Log
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Private internal communication for authorized Officials.
          </p>
        </div>
        
        {!composing && (
          <button
            onClick={() => setComposing(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1))';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <Edit3 size={18} />
            New Mail
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {composing ? (
          <motion.div
            key="compose"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSend} style={{
              background: 'var(--bg-surface-sunken)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit3 size={20} color="#f59e0b" /> Compose Message
                </h3>
                <button type="button" onClick={() => setComposing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem'
                    }}
                    placeholder="E.g., Platform updates deployed"
                  />
                </div>
                <div style={{ width: '180px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      color: getPriorityColor(priority),
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Normal" style={{ color: '#3b82f6', backgroundColor: 'var(--bg-panel)' }}>Normal</option>
                    <option value="Important" style={{ color: '#f59e0b', backgroundColor: 'var(--bg-panel)' }}>Important</option>
                    <option value="Urgent" style={{ color: '#ef4444', backgroundColor: 'var(--bg-panel)' }}>Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Message</label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '8px',
                    padding: '1rem',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    minHeight: '150px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter message for other Officials..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setComposing(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-main)',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !subject.trim() || !message.trim()}
                  style={{
                    background: '#f59e0b',
                    border: 'none',
                    color: '#fff',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    opacity: sending || !subject.trim() || !message.trim() ? 0.5 : 1
                  }}
                >
                  {sending ? 'Sending...' : 'Send Mail'} <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading mail log...</div>
        ) : mails.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              background: 'var(--bg-surface-sunken)',
              border: '1px dashed var(--border-strong)',
              borderRadius: '16px',
              padding: '4rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Inbox size={28} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '0.5rem' }}>No Mail Records</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '300px' }}>
              There are currently no internal messages logged in the system.
            </p>
          </motion.div>
        ) : (
          mails.map((mail, i) => {
            const isRead = currentUserId ? mail.read_by?.includes(currentUserId) : false;
            return (
              <motion.div
                key={mail.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => handleMarkRead(mail.id)}
                style={{
                  background: isRead ? 'var(--bg-surface)' : 'linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, var(--bg-surface-sunken) 100%)',
                  border: '1px solid',
                  borderColor: isRead ? 'var(--border)' : 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.25rem',
                  boxShadow: isRead ? '0 2px 8px rgba(0,0,0,0.05)' : '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!isRead && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#f59e0b' }} />
                )}
                
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-panel)', border: '1px solid var(--border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isRead ? 'var(--text-muted)' : '#f59e0b'
                }}>
                  <Mail size={18} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: isRead ? 600 : 700, margin: 0, color: isRead ? 'var(--text-main)' : '#f59e0b' }}>
                        {mail.subject}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Anonymous Official</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {new Date(mail.created_at).toLocaleString()}
                        </span>
                        {mail.priority !== 'Normal' && (
                          <>
                            <span>•</span>
                            <span style={{ color: getPriorityColor(mail.priority), fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              {mail.priority === 'Urgent' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                              {mail.priority}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    color: isRead ? 'var(--text-muted)' : 'var(--text-main)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginTop: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    background: 'var(--bg-main)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    {mail.message}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
