import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search, Info } from 'lucide-react';
import { formatAppDateTime } from '../../../lib/dateFormatting';

export function AdminOrphansView() {
  const [orphans, setOrphans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadOrphans = async () => {
    setLoading(true);
    // Find identities where user_id is null
    const { data, error } = await supabase
      .from('user_identities')
      .select('*')
      .is('user_id', null);
    
    if (data) {
      setOrphans(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrphans();
  }, []);

  const filtered = orphans.filter(u => 
    u.login_id?.toLowerCase().includes(search.toLowerCase()) || 
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const reservedCount = orphans.filter(o => o.status === 'RESERVED').length;
  const unlinkedCount = orphans.filter(o => o.status !== 'RESERVED').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Orphaned Records</h2>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Info size={14} /> Total Unlinked: {orphans.length}
            </span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>Reserved: {reservedCount}</span>
            <span>•</span>
            <span style={{ color: '#ef4444' }}>Orphaned Active: {unlinkedCount}</span>
          </div>
        </div>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by ID or Username"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Login ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Created At</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Notice</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading orphaned records...</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id || u.login_id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.login_id}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {u.role?.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: u.status === 'RESERVED' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: u.status === 'RESERVED' ? '#10b981' : '#ef4444',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {formatAppDateTime(u.created_at)}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {u.status === 'RESERVED' ? 'Future Official' : 'Unlinked Data (Safe to ignore)'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No orphaned records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
