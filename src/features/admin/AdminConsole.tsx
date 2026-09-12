import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Users, Ticket, Activity, Database, ArrowLeft, TerminalSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'

import { AdminDashboardView } from './views/AdminDashboardView'
import { AdminUsersView } from './views/AdminUsersView'
import { AdminSupportView } from './views/AdminSupportView'
import { AdminLogsView } from './views/AdminLogsView'
import { AdminOrphansView } from './views/AdminOrphansView'

export function AdminConsole({ onBack }: { onBack: () => void }) {
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'support' | 'logs' | 'orphans'>('dashboard')
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  
  useEffect(() => {
    // Aggressive secondary validation
    async function verifyAdminAccess() {
      const { data, error } = await supabase.rpc('is_admin')
      if (error || !data) {
        setIsAdmin(false)
        onBack() // Eject if unauthorized
      } else {
        setIsAdmin(true)
      }
    }
    verifyAdminAccess()
  }, [onBack])

  if (isAdmin === null) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-main)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse">Verifying Authorization...</div>
      </div>
    )
  }

  if (isAdmin === false) {
    return null // Ejecting
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'support', label: 'Escalated Support', icon: Ticket },
    { id: 'logs', label: 'Audit Logs', icon: TerminalSquare },
    { id: 'orphans', label: 'Orphaned Records', icon: Database },
  ] as const

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-main)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Top Header */}
      <div style={{
        height: '60px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} className="icon-btn" title="Exit Admin Console">
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
            <Shield size={22} fill="currentColor" stroke="none" />
            <span style={{ fontWeight: 800, letterSpacing: '0.05em', fontSize: '1.1rem' }}>ARINOVA ADMIN</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'rgba(245,158,11,0.1)', 
            border: '1px solid rgba(245,158,11,0.2)',
            color: '#f59e0b',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            admin#ARSA • Official / Owner
          </div>
        </div>
      </div>

      <div className="admin-console-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <style>{`
          @media (max-width: 768px) {
            .admin-console-layout { flex-direction: column !important; }
            .admin-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border); padding: 1rem !important; overflow-x: auto; flex-direction: row !important; }
            .admin-sidebar-btn { padding: 0.5rem !important; white-space: nowrap; }
            .admin-sidebar-label { display: none; }
          }
        `}</style>
        {/* Sidebar */}
        <div className="admin-sidebar" style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--bg-panel)',
          borderRight: '1px solid var(--border)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="admin-sidebar-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: activeView === item.id ? 'var(--primary)' : 'transparent',
                color: activeView === item.id ? '#fff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: activeView === item.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={18} />
              <span className="admin-sidebar-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ minHeight: '100%', padding: '2rem' }}
            >
              {activeView === 'dashboard' && <AdminDashboardView />}
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
