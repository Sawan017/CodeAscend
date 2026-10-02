import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { formatAppDateTime } from '../../../lib/dateFormatting';
import { Search, Clock, Trash2, CalendarDays } from 'lucide-react';

export function AdminLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('admin_search_audit_logs', {
        p_search_query: debouncedSearch,
        p_limit: 100
      });
      
      if (data) {
        setLogs(data);
      } else if (error) {
        console.error("Failed to load audit logs:", error);
      }
      
      setLoading(false);
    }
    loadLogs();
  }, [debouncedSearch]);

  // Calculate days remaining until 10-day expiration
  const getExpirationText = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const daysLeft = Math.max(0, 10 - diffDays);
    
    if (daysLeft === 0) return 'Expires soon';
    if (daysLeft < 1) return 'Expires < 1 day';
    return `Expires in ${Math.round(daysLeft)} days`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0' }}>Audit Logs</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <CalendarDays size={16} />
            <span>Logs retained for 10 days</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by action, user, details..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-panel)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 12px 10px 40px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time / Retention</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Admin</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading logs...</td></tr>
            ) : logs.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <div>{formatAppDateTime(l.created_at)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginTop: '4px', color: '#f59e0b' }}>
                    <Clock size={12} />
                    {getExpirationText(l.created_at)}
                  </div>
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>
                  <div style={{ fontSize: '0.95rem' }}>{l.admin_username || 'Unknown'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {l.admin_id.substring(0, 8)}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: 'rgba(59,130,246,0.1)',
                    color: '#3b82f6',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {l.action}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{l.target_id || '-'}</td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <pre style={{ margin: 0, fontFamily: 'inherit', maxWidth: '300px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(l.details)}
                  </pre>
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No matching audit logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
