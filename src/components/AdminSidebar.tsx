import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Ticket, Activity, Database, TerminalSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Route } from '../types'

type AdminSidebarProps = {
  currentRoute: Route
  onNavigate: (route: Route) => void
}

export function AdminSidebar({ currentRoute, onNavigate }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(true)

  const navItems = [
    { id: 'admin_dashboard', label: 'Control Dashboard', icon: Activity },
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_support', label: 'Escalated Support', icon: Ticket },
    { id: 'admin_logs', label: 'Audit Logs', icon: TerminalSquare },
    { id: 'admin_orphans', label: 'Orphaned Records', icon: Database },
  ] as const

  return (
    <motion.div
      animate={{ width: collapsed ? 70 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        background: 'var(--bg-surface-sunken)',
        borderRight: '1px solid var(--border-strong)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      <div style={{
        height: '60px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0' : '0 1.25rem',
        justifyContent: collapsed ? 'center' : 'space-between',
        cursor: 'pointer'
      }} onClick={() => setCollapsed(!collapsed)}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f59e0b' }}>
            <Shield size={22} fill="currentColor" stroke="none" />
            <span style={{ fontWeight: 800, letterSpacing: '0.05em', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>CONTROL</span>
          </div>
        )}
        {collapsed ? (
          <Shield size={22} fill="#f59e0b" stroke="none" style={{ color: '#f59e0b' }} />
        ) : (
          <ChevronLeft size={18} color="var(--text-muted)" />
        )}
      </div>

      <div style={{ padding: collapsed ? '1rem 0' : '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map(item => {
          const isActive = currentRoute.view === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate({ view: item.id as any })}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '0.75rem',
                padding: collapsed ? '0.75rem 0' : '0.85rem 1rem',
                borderRadius: '10px',
                background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: isActive ? '#f59e0b' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: isActive ? 'rgba(245,158,11,0.2)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-surface)'
                  e.currentTarget.style.color = 'var(--text-main)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
