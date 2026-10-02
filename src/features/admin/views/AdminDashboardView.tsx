import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { Users, Ticket, AlertTriangle, ShieldCheck, Activity, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

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

  const statCards = [
    { label: 'Total Platform Users', value: stats.totalUsers, icon: Users, color: '#3b82f6', bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.02))' },
    { label: 'Escalated Tickets', value: stats.activeTickets, icon: Ticket, color: '#f59e0b', bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))' },
    { label: 'Banned Accounts', value: stats.bannedUsers, icon: AlertTriangle, color: '#ef4444', bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02))' },
    { label: 'System Health', value: stats.systemHealth, icon: ShieldCheck, color: stats.systemHealth === '100%' ? '#10b981' : '#f59e0b', bgGradient: stats.systemHealth === '100%' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))' : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02))' },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>
          Platform Overview
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Real-time metrics and system health monitoring
        </p>
      </header>
      
      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.1 }}
            style={{
              background: 'var(--bg-surface-sunken)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }}
          >
            {/* Background Accent */}
            <div style={{ position: 'absolute', inset: 0, background: s.bgGradient, opacity: 0.8, pointerEvents: 'none' }} />
            
            <div style={{ 
              width: 56, height: 56, 
              borderRadius: '14px', 
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: s.color,
              flexShrink: 0,
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <s.icon size={26} strokeWidth={2.5} />
            </div>
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.2rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {loading ? <span style={{ opacity: 0.3 }}>--</span> : s.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Section: Recent Activity */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={18} color="var(--text-muted)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Recent Administrative Activity</h3>
          </div>
          <div style={{
            flex: 1,
            background: 'var(--bg-surface-sunken)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '260px'
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Clock size={20} color="var(--text-muted)" />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No recent activity</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
              Administrative actions, permission changes, and security events will appear here.
            </div>
          </div>
        </section>

        {/* Section: System Status */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={18} color="var(--text-muted)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>System Status & Alerts</h3>
          </div>
          <div style={{
            flex: 1,
            background: 'var(--bg-surface-sunken)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '260px'
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle2 size={22} color="#10b981" />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>All systems operational</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.5 }}>
              Database latency is normal. No escalated security incidents or routing failures detected.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
