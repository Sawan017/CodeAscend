import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { formatAppDateTime } from '../../../lib/dateFormatting';

export function AdminLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      // Get logs and join with the admin's profile for display
      const { data } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (data) setLogs(data);
      setLoading(false);
    }
    loadLogs();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>Audit Logs</h2>
      
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time</th>
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
                  {formatAppDateTime(l.created_at)}
                </td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>
                  {l.admin_id.substring(0, 8)}
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
                  <pre style={{ margin: 0, fontFamily: 'inherit' }}>{JSON.stringify(l.details)}</pre>
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No audit logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
