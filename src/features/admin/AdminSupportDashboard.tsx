import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, AlertTriangle, ArrowLeft, X, Paperclip } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatAppDateTime } from '../../lib/dateFormatting'

export function AdminSupportDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'reports' | 'feedback'>('reports')
  const [reports, setReports] = useState<any[]>([])
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null)

  const [stats, setStats] = useState({
    reports: { new: 0, active: 0, resolved: 0 },
    feedback: { new: 0, reviewed: 0, planned: 0, implemented: 0 }
  })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [reportsRes, feedbackRes] = await Promise.all([
        supabase!.from('support_reports').select('*, profiles(data)').order('created_at', { ascending: false }),
        supabase!.from('support_feedback').select('*, profiles(data)').order('created_at', { ascending: false })
      ])

      if (reportsRes.error) throw reportsRes.error
      if (feedbackRes.error) throw feedbackRes.error

      setReports(reportsRes.data || [])
      setFeedback(feedbackRes.data || [])

      // Calculate stats
      const rStats = { new: 0, active: 0, resolved: 0 }
      ;(reportsRes.data || []).forEach(r => {
        if (r.status === 'new') rStats.new++
        else if (r.status === 'in_progress') rStats.active++
        else if (r.status === 'resolved') rStats.resolved++
      })

      const fStats = { new: 0, reviewed: 0, planned: 0, implemented: 0 }
      ;(feedbackRes.data || []).forEach(f => {
        if (f.status === 'new') fStats.new++
        else if (f.status === 'reviewed') fStats.reviewed++
        else if (f.status === 'planned') fStats.planned++
        else if (f.status === 'implemented') fStats.implemented++
      })

      setStats({ reports: rStats, feedback: fStats })
    } catch (err: any) {
      setError(err.message || 'Failed to load support data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateReportStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase!.from('support_reports').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport({ ...selectedReport, status: newStatus })
      }
      loadData() // Refresh
    } catch (e: any) {
      alert(e.message)
    }
  }

  const updateReportNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase!.from('support_reports').update({ admin_notes: notes }).eq('id', id)
      if (error) throw error
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport({ ...selectedReport, admin_notes: notes })
      }
      loadData()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const updateFeedbackStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase!.from('support_feedback').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus })
      }
      loadData()
    } catch (e: any) {
      alert(e.message)
    }
  }
  
  const updateFeedbackNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase!.from('support_feedback').update({ admin_notes: notes }).eq('id', id)
      if (error) throw error
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({ ...selectedFeedback, admin_notes: notes })
      }
      loadData()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return r.category.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      }
      return true
    })
  }, [reports, searchQuery, statusFilter])

  const filteredFeedback = useMemo(() => {
    return feedback.filter(f => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return f.feedback_type.toLowerCase().includes(q) || f.message.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)
      }
      return true
    })
  }, [feedback, searchQuery, statusFilter])

  const statusColors: any = {
    new: '#ef4444',
    in_progress: '#eab308',
    resolved: '#10b981',
    closed: '#6b7280',
    reviewed: '#3b82f6',
    planned: '#8b5cf6',
    implemented: '#10b981',
    rejected: '#6b7280'
  }

  const statusLabels: any = {
    new: 'New',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    reviewed: 'Reviewed',
    planned: 'Planned',
    implemented: 'Implemented',
    rejected: 'Rejected'
  }

  const [tempNotes, setTempNotes] = useState('')

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
            Admin Support Dashboard
          </h2>
        </div>
        <button className="secondary-btn" onClick={loadData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ flex: 1, padding: '1rem', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reports</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.new }}>{stats.reports.new}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.in_progress }}>{stats.reports.active}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 600, color: statusColors.resolved }}>{stats.reports.resolved}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolved</div></div>
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
      </div>

      {/* Filters and Tabs */}
      <div style={{ padding: '1.5rem 2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('reports'); setStatusFilter('all'); setSearchQuery('') }}
            style={{ padding: '0.5rem 1rem', background: activeTab === 'reports' ? 'var(--primary)' : 'transparent', border: activeTab === 'reports' ? 'none' : '1px solid var(--border)', borderRadius: '8px', color: activeTab === 'reports' ? '#fff' : 'var(--text-muted)' }}
          >
            Reports
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
            {activeTab === 'reports' ? (
              <>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
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
        ) : activeTab === 'reports' ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No reports found.</div>
            ) : filteredReports.map(r => (
              <div 
                key={r.id} 
                className="drawer-card"
                onClick={() => { setSelectedReport(r); setTempNotes(r.admin_notes || '') }}
                style={{ background: 'var(--bg-panel)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.id.split('-')[0]}</span>
                    <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem' }}>{r.category}</h4>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', background: `${statusColors[r.status]}20`, color: statusColors[r.status], borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{statusLabels[r.status]}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>User: {r.profiles?.data?.displayName || 'Unknown'}</span>
                  <span>{formatAppDateTime(r.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredFeedback.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No feedback found.</div>
            ) : filteredFeedback.map(f => (
              <div 
                key={f.id} 
                className="drawer-card"
                onClick={() => { setSelectedFeedback(f); setTempNotes(f.admin_notes || '') }}
                style={{ background: 'var(--bg-panel)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{f.id.split('-')[0]}</span>
                    <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem' }}>{f.feedback_type} {f.rating ? `(${f.rating}/5)` : ''}</h4>
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', background: `${statusColors[f.status]}20`, color: statusColors[f.status], borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{statusLabels[f.status]}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>User: {f.profiles?.data?.displayName || 'Unknown'}</span>
                  <span>{formatAppDateTime(f.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modals */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedReport(null) }}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border-strong)', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Report Details</h3>
                <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID</label><div style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{selectedReport.id}</div></div>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>User</label><div style={{ color: 'var(--text-main)' }}>{selectedReport.profiles?.data?.displayName || 'Unknown'} ({selectedReport.user_id.split('-')[0]})</div></div>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</label><div style={{ color: 'var(--text-main)' }}>{selectedReport.category}</div></div>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submitted</label><div style={{ color: 'var(--text-main)' }}>{formatAppDateTime(selectedReport.created_at)}</div></div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Description</label>
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selectedReport.description}
                  </div>
                </div>

                {selectedReport.attachment_path && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Attachment</label>
                    <a href={supabase!.storage.from('support_attachments').getPublicUrl(selectedReport.attachment_path).data.publicUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--primary)', textDecoration: 'none' }}>
                      <Paperclip size={16} /> View Attachment
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update Status</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['new', 'in_progress', 'resolved', 'closed'].map(s => (
                      <button 
                        key={s}
                        onClick={() => updateReportStatus(selectedReport.id, s)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', border: 'none', background: selectedReport.status === s ? statusColors[s] : 'var(--bg-surface)', color: selectedReport.status === s ? '#fff' : 'var(--text-main)' }}
                      >
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Internal Admin Notes</label>
                  <textarea 
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Add private notes here..."
                    style={{ width: '100%', minHeight: '100px', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', padding: '1rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                    <button className="primary-btn" onClick={() => updateReportNotes(selectedReport.id, tempNotes)}>Save Notes</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {selectedFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedFeedback(null) }}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border-strong)', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Feedback Details</h3>
                <button onClick={() => setSelectedFeedback(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID</label><div style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{selectedFeedback.id}</div></div>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>User</label><div style={{ color: 'var(--text-main)' }}>{selectedFeedback.profiles?.data?.displayName || 'Unknown'}</div></div>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type</label><div style={{ color: 'var(--text-main)' }}>{selectedFeedback.feedback_type}</div></div>
                  <div><label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rating</label><div style={{ color: 'var(--text-main)' }}>{selectedFeedback.rating ? `${selectedFeedback.rating}/5` : 'N/A'}</div></div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Message</label>
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selectedFeedback.message}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update Status</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['new', 'reviewed', 'planned', 'implemented', 'rejected'].map(s => (
                      <button 
                        key={s}
                        onClick={() => updateFeedbackStatus(selectedFeedback.id, s)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', border: 'none', background: selectedFeedback.status === s ? statusColors[s] : 'var(--bg-surface)', color: selectedFeedback.status === s ? '#fff' : 'var(--text-main)' }}
                      >
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Internal Admin Notes</label>
                  <textarea 
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Add private notes here..."
                    style={{ width: '100%', minHeight: '100px', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', padding: '1rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                    <button className="primary-btn" onClick={() => updateFeedbackNotes(selectedFeedback.id, tempNotes)}>Save Notes</button>
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
