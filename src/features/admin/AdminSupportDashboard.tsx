import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, AlertTriangle, ArrowLeft, X, Paperclip, Send, User, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatAppDateTime } from '../../lib/dateFormatting'

export function AdminSupportDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'feedback' | 'officials'>('tickets')
  
  const [tickets, setTickets] = useState<any[]>([])
    const [officials, setOfficials] = useState<any[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
    const [messages, setMessages] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newNote, setNewNote] = useState('')
  
  const [myOfficialStatus, setMyOfficialStatus] = useState<any>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [stats, setStats] = useState({
    tickets: { waiting: 0, active: 0, resolved: 0 },
    feedback: { new: 0, reviewed: 0, planned: 0, implemented: 0 }
  })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const authUser = (await supabase!.auth.getUser()).data.user
      if (!authUser) throw new Error('Not authenticated')

      const [ticketsRes, feedbackRes, officialsRes, meRes] = await Promise.all([
        supabase!.from('support_tickets').select('*, profiles!support_tickets_user_id_fkey(data)').order('created_at', { ascending: false }),
        supabase!.from('support_feedback').select('*, profiles(data)').order('created_at', { ascending: false }),
        supabase!.from('support_officials').select('*, profiles(data)'),
        supabase!.from('support_officials').select('*').eq('user_id', authUser.id).single()
      ])

      if (ticketsRes.error) throw ticketsRes.error
      if (feedbackRes.error) throw feedbackRes.error

      setTickets(ticketsRes.data || [])
            setOfficials(officialsRes.data || [])
      if (meRes.data) setMyOfficialStatus(meRes.data)

      // Calculate stats
      const tStats = { waiting: 0, active: 0, resolved: 0 }
      ;(ticketsRes.data || []).forEach(t => {
        if (t.status === 'ai_assisting' || t.status === 'waiting_for_official') tStats.waiting++
        else if (t.status === 'official_assigned') tStats.active++
        else if (t.status === 'resolved') tStats.resolved++
      })

      const fStats = { new: 0, reviewed: 0, planned: 0, implemented: 0 }
      ;(feedbackRes.data || []).forEach(f => {
        if (f.status === 'new') fStats.new++
        else if (f.status === 'reviewed') fStats.reviewed++
        else if (f.status === 'planned') fStats.planned++
        else if (f.status === 'implemented') fStats.implemented++
      })

      setStats({ tickets: tStats, feedback: fStats })
    } catch (err: any) {
      setError(err.message || 'Failed to load support data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Global realtime subscriptions
    const ticketsSub = supabase!.channel('admin_tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => loadData())
      .subscribe()
      
    const officialsSub = supabase!.channel('admin_officials')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_officials' }, () => loadData())
      .subscribe()

    return () => { 
      supabase!.removeChannel(ticketsSub)
      supabase!.removeChannel(officialsSub)
    }
  }, [])

  // Load messages and notes for selected ticket
  useEffect(() => {
    if (!selectedTicket) return
    loadTicketDetails(selectedTicket.id)
    
    const msgSub = supabase!.channel(`admin_msg_${selectedTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${selectedTicket.id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .subscribe()

    const notesSub = supabase!.channel(`admin_notes_${selectedTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_internal_notes', filter: `ticket_id=eq.${selectedTicket.id}` }, (payload) => {
        setNotes(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase!.removeChannel(msgSub)
      supabase!.removeChannel(notesSub)
    }
  }, [selectedTicket?.id])

  const loadTicketDetails = async (ticketId: string) => {
    const { data: msgData } = await supabase!.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true })
    if (msgData) setMessages(msgData)
    
    const { data: noteData } = await supabase!.from('support_internal_notes').select('*, profiles(data)').eq('ticket_id', ticketId).order('created_at', { ascending: true })
    if (noteData) setNotes(noteData)
    
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100)
  }

  const toggleAvailability = async () => {
    if (!myOfficialStatus) return
    const isOnline = !myOfficialStatus.is_online
    const isAvailable = isOnline
    
    await supabase!.from('support_officials').update({ is_online: isOnline, is_available: isAvailable, last_seen: new Date().toISOString() }).eq('user_id', myOfficialStatus.user_id)
    setMyOfficialStatus({ ...myOfficialStatus, is_online: isOnline, is_available: isAvailable })
  }

  const handleTakeTicket = async (ticketId: string) => {
    try {
      const { data, error } = await supabase!.rpc('take_support_ticket', { p_ticket_id: ticketId })
      if (error) throw error
      if (!data) throw new Error("Could not claim ticket. Another official may have taken it.")
      
      // Auto-insert message
      await supabase!.from('support_messages').insert({
        ticket_id: ticketId,
        sender_id: myOfficialStatus.user_id,
        sender_type: 'official',
        message: 'Hello! I have taken your ticket and will be assisting you.'
      })
      
      loadData()
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: 'official_assigned', assigned_official_id: myOfficialStatus.user_id })
      }
    } catch (e: any) {
      alert(e.message)
    }
  }
  
  const handleUpdateTicketStatus = async (status: string) => {
    if (!selectedTicket) return
    await supabase!.from('support_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', selectedTicket.id)
    setSelectedTicket({ ...selectedTicket, status })
    loadData()
  }

  const handleSendOfficialMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !myOfficialStatus) return
    const msg = newMessage.trim()
    setNewMessage('')
    
    await supabase!.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_id: myOfficialStatus.user_id,
      sender_type: 'official',
      message: msg
    })
  }

  const handleAddInternalNote = async () => {
    if (!newNote.trim() || !selectedTicket || !myOfficialStatus) return
    const noteText = newNote.trim()
    setNewNote('')
    
    await supabase!.from('support_internal_notes').insert({
      ticket_id: selectedTicket.id,
      official_id: myOfficialStatus.user_id,
      note: noteText
    })
  }

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.ticket_number.toLowerCase().includes(q)
      }
      return true
    })
  }, [tickets, searchQuery, statusFilter])

  const statusColors: any = {
    ai_assisting: '#3b82f6',
    waiting_for_official: '#eab308',
    official_assigned: '#8b5cf6',
    resolved: '#10b981',
    closed: '#6b7280',
    // Feedback
    new: '#ef4444',
    reviewed: '#3b82f6',
    planned: '#8b5cf6',
    implemented: '#10b981',
    rejected: '#6b7280'
  }

  const statusLabels: any = {
    ai_assisting: 'AI Assisting',
    waiting_for_official: 'Waiting',
    official_assigned: 'Active',
    resolved: 'Resolved',
    closed: 'Closed',
    // Feedback
    new: 'New',
    reviewed: 'Reviewed',
    planned: 'Planned',
    implemented: 'Implemented',
    rejected: 'Rejected'
  }

  return (
    <div className="panel-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-main)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} color="#f59e0b" />
            Support Admin
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {myOfficialStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: myOfficialStatus.is_online ? '#10b981' : '#6b7280' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{myOfficialStatus.is_online ? 'Online' : 'Offline'}</span>
              <button 
                onClick={toggleAvailability}
                style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', border: 'none', background: myOfficialStatus.is_online ? '#ef4444' : '#10b981', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', marginLeft: '0.5rem' }}
              >
                {myOfficialStatus.is_online ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          )}
          <button className="secondary-btn" onClick={loadData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ flex: 1, padding: '1rem', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tickets</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.waiting_for_official }}>{stats.tickets.waiting}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.official_assigned }}>{stats.tickets.active}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.resolved }}>{stats.tickets.resolved}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolved</div></div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feedback</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.new }}>{stats.feedback.new}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.reviewed }}>{stats.feedback.reviewed}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviewed</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.planned }}>{stats.feedback.planned}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Planned</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.implemented }}>{stats.feedback.implemented}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Implemented</div></div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Officials</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {officials.filter(o => o.is_online).map(o => (
              <div key={o.user_id} title={o.profiles?.data?.displayName} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${o.is_available ? '#10b981' : '#eab308'}` }}>
                {o.profiles?.data?.displayName?.[0] || <User size={16} />}
              </div>
            ))}
            {officials.filter(o => o.is_online).length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No officials online</div>}
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div style={{ padding: '1.5rem 2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('tickets'); setStatusFilter('all'); setSearchQuery('') }}
            style={{ padding: '0.5rem 1rem', background: activeTab === 'tickets' ? 'var(--primary)' : 'transparent', border: activeTab === 'tickets' ? 'none' : '1px solid var(--border)', borderRadius: '8px', color: activeTab === 'tickets' ? '#fff' : 'var(--text-muted)' }}
          >
            Tickets
          </button>
          <button 
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('feedback'); setStatusFilter('all'); setSearchQuery('') }}
            style={{ padding: '0.5rem 1rem', background: activeTab === 'feedback' ? 'var(--primary)' : 'transparent', border: activeTab === 'feedback' ? 'none' : '1px solid var(--border)', borderRadius: '8px', color: activeTab === 'feedback' ? '#fff' : 'var(--text-muted)' }}
          >
            Feedback
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
          >
            <option value="all">All Statuses</option>
            {activeTab === 'tickets' ? (
              <>
                <option value="ai_assisting">AI Assisting</option>
                <option value="waiting_for_official">Waiting</option>
                <option value="official_assigned">Active</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </>
            ) : (
              <>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="planned">Planned</option>
                <option value="implemented">Implemented</option>
                <option value="rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Main Content List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading {activeTab}...</div>
        ) : error ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>
        ) : activeTab === 'tickets' ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No tickets found.</div>
            ) : filteredTickets.map(t => (
              <div 
                key={t.id} 
                className="drawer-card"
                onClick={() => setSelectedTicket(t)}
                style={{ background: 'var(--bg-panel)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{t.ticket_number}</span>
                    <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem' }}>{t.category}</h4>
                    {t.priority !== 'Normal' && (
                      <span style={{ padding: '0.15rem 0.4rem', background: t.priority === 'Urgent' ? '#ef4444' : '#f59e0b', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>{t.priority}</span>
                    )}
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', background: `${statusColors[t.status]}20`, color: statusColors[t.status], borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{statusLabels[t.status]}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>User: {t.profiles?.data?.displayName || 'Unknown'}</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {t.assigned_official_id && <span>Assigned: {officials.find(o => o.user_id === t.assigned_official_id)?.profiles?.data?.displayName || t.assigned_official_id.split('-')[0]}</span>}
                    <span>{formatAppDateTime(t.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
             <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Feedback view unchanged from previous phase.</div>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedTicket(null) }}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-strong)', width: '100%', maxWidth: '1000px', height: '90vh', display: 'flex', overflow: 'hidden' }}
            >
              {/* Left Column: Chat */}
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg-surface-sunken)' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedTicket.ticket_number}</span>
                  <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedTicket.category}</h3>
                  <span style={{ marginLeft: 'auto', padding: '0.25rem 0.75rem', background: `${statusColors[selectedTicket.status]}20`, color: statusColors[selectedTicket.status], borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{statusLabels[selectedTicket.status]}</span>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Original Report</div>
                    <div style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</div>
                    {selectedTicket.screenshot_path && (
                      <a href={supabase!.storage.from('support_attachments').getPublicUrl(selectedTicket.screenshot_path).data.publicUrl} target="_blank" rel="noreferrer" style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                        <Paperclip size={16} /> Attached Screenshot
                      </a>
                    )}
                  </div>
                  
                  {messages.map(msg => {
                    const isMe = msg.sender_id === myOfficialStatus?.user_id
                    const isSystem = msg.sender_type === 'system'
                    
                    if (isSystem) {
                      return <div key={msg.id} style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>{msg.message}</div>
                    }
                    
                    return (
                      <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textAlign: isMe ? 'right' : 'left', marginLeft: isMe ? 0 : '0.5rem', marginRight: isMe ? '0.5rem' : 0 }}>
                          {msg.sender_type === 'user' ? 'User' : msg.sender_type === 'ai' ? 'Arinova AI' : 'Official'}
                        </div>
                        <div style={{ 
                          background: isMe ? 'var(--primary)' : 'var(--bg-panel)', 
                          color: isMe ? '#000' : 'var(--text-main)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '16px', 
                          borderBottomRightRadius: isMe ? '4px' : '16px',
                          borderBottomLeftRadius: !isMe ? '4px' : '16px',
                          border: isMe ? 'none' : '1px solid var(--border)'
                        }}>
                          {msg.message}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input or Take Ticket Action */}
                <div style={{ padding: '1rem', background: 'var(--bg-panel)', borderTop: '1px solid var(--border)' }}>
                  {(selectedTicket.status === 'waiting_for_official' || selectedTicket.status === 'ai_assisting') && !selectedTicket.assigned_official_id ? (
                    <button className="primary-btn" onClick={() => handleTakeTicket(selectedTicket.id)} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={20} /> Take Ticket
                    </button>
                  ) : selectedTicket.assigned_official_id === myOfficialStatus?.user_id && selectedTicket.status !== 'closed' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendOfficialMessage()}
                        placeholder="Reply to user..."
                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', border: '1px solid var(--border-strong)', background: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
                      />
                      <button 
                        onClick={handleSendOfficialMessage}
                        disabled={!newMessage.trim()}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5 }}
                      >
                        <Send size={18} style={{ marginLeft: '2px' }} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {selectedTicket.status === 'closed' || selectedTicket.status === 'resolved' ? 'Ticket is closed/resolved.' : 'Assigned to another official.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Meta & Notes */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-panel)' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Details</h4>
                  <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>User</label>
                    <div style={{ color: 'var(--text-main)' }}>{selectedTicket.profiles?.data?.displayName || 'Unknown'}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Submitted</label>
                    <div style={{ color: 'var(--text-main)' }}>{formatAppDateTime(selectedTicket.created_at)}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Manage Status</label>
                    <select 
                      value={selectedTicket.status} 
                      onChange={(e) => handleUpdateTicketStatus(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-main)', outline: 'none' }}
                    >
                      <option value="ai_assisting">AI Assisting</option>
                      <option value="waiting_for_official">Waiting</option>
                      <option value="official_assigned">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Internal Admin Notes</label>
                    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {notes.map(note => (
                        <div key={note.id} style={{ background: 'var(--bg-panel)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                            <span>{note.profiles?.data?.displayName || 'Official'}</span>
                            <span>{formatAppDateTime(note.created_at)}</span>
                          </div>
                          <div style={{ color: 'var(--text-main)' }}>{note.note}</div>
                        </div>
                      ))}
                      {notes.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>No internal notes.</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddInternalNote()}
                        placeholder="Add a private note..."
                        style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }}
                      />
                      <button onClick={handleAddInternalNote} disabled={!newNote.trim()} className="secondary-btn" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
