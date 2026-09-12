import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Users, Ticket, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AdminDashboardView() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTickets: 0,
    bannedUsers: 0,
    systemHealth: '100%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Parallel fetch
      
      const startTime = performance.now();
      const { data, error } = await supabase.rpc('admin_get_stats');
      const latency = performance.now() - startTime;
      const health = latency < 500 ? '100%' : latency < 1000 ? '98%' : '95%';
      if (data) {
        setStats({ ...(data as any), systemHealth: health });
      }

      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Active Support Tickets', value: stats.activeTickets, icon: Ticket, color: '#f59e0b' },
    { label: 'Banned Users', value: stats.bannedUsers, icon: AlertTriangle, color: '#ef4444' },
    { label: 'System Health', value: stats.systemHealth, icon: ShieldCheck, color: stats.systemHealth === '100%' ? '#10b981' : '#f59e0b' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>Platform Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              width: 48, height: 48, 
              borderRadius: '12px', 
              background: `${s.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: s.color
            }}>
              <s.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
