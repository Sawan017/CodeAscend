import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Users, Ticket, Activity, Database, ArrowLeft, TerminalSquare, ShieldCheck, Lock, Mail } from 'lucide-react'

import { AdminDashboardView } from './views/AdminDashboardView'
import { AdminUsersView } from './views/AdminUsersView'
import { AdminSupportView } from './views/AdminSupportView'
import { AdminLogsView } from './views/AdminLogsView'
import { AdminOrphansView } from './views/AdminOrphansView'
import { AdminMailView } from './views/AdminMailView'

export function AdminConsole({ onBack }: { onBack: () => void }) {
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'support' | 'logs' | 'orphans' | 'mail'>('dashboard')
  
  const navItems = [
    { id: 'dashboard', label: 'Control Dashboard', icon: Activity },
    { id: 'mail', label: 'Mail Log', icon: Mail },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'support', label: 'Escalated Support', icon: Ticket },
    { id: 'logs', label: 'Audit Logs', icon: TerminalSquare },
    { id: 'orphans', label: 'Orphaned Records', icon: Database },
  ] as const

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-main)', // Use existing premium background
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Background Ambience (Subtle Indigo Depth) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.03) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Top Header */}
      <div style={{
        height: '64px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)', // Deep charcoal/navy translucent
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button onClick={onBack} 
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
              borderRadius: '8px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
            title="Return to ARINOVA Dashboard"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-sunken)'; e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-main)'; }}
          >
            <ArrowLeft size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f59e0b' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="#f59e0b" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: '1.05rem', textTransform: 'uppercase' }}>
              Control Center
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-strong)',
            color: 'var(--text-main)',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <Lock size={12} color="#10b981" />
            <span style={{ color: 'var(--text-muted)' }}>SESSION:</span> 
            <span style={{ color: '#10b981' }}>AUTHORIZED SECURE</span>
          </div>
        </div>
      </div>

      <div className="admin-console-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <style>{`
          @media (max-width: 768px) {
            .admin-console-layout { flex-direction: column !important; }
            .admin-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border); padding: 1rem !important; overflow-x: auto; flex-direction: row !important; }
            .admin-sidebar-btn { padding: 0.5rem 1rem !important; white-space: nowrap; }
            .admin-sidebar-label { display: none; }
          }
        `}</style>
        
        {/* Sidebar */}
        <div className="admin-sidebar" style={{
          width: '260px',
          flexShrink: 0,
          background: 'var(--bg-panel)', // Deep charcoal/navy
          borderRight: '1px solid var(--border)',
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
            System Modules
          </div>
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="admin-sidebar-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px', // Premium soft rounded corners
                  background: isActive ? 'linear-gradient(90deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.02) 100%)' : 'transparent',
                  color: isActive ? '#f59e0b' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(245,158,11,0.2)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: '#f59e0b', borderRadius: '0 4px 4px 0' }} />
                )}
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#f59e0b' : 'inherit' }} />
                <span className="admin-sidebar-label">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'transparent' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ minHeight: '100%', padding: '3rem' }}
            >
              {activeView === 'dashboard' && <AdminDashboardView />}
              {activeView === 'mail' && <AdminMailView />}
              {activeView === 'users' && <AdminUsersView />}
              {activeView === 'support' && <AdminSupportView />}
              {activeView === 'logs' && <AdminLogsView />}
              {activeView === 'orphans' && <AdminOrphansView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
