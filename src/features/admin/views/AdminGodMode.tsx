import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useToasts } from '../../../hooks/useToasts'
import { Shield, ArrowLeft, Star, Edit3, Trash2, Award, Zap, Activity } from 'lucide-react'

export function AdminGodMode({ user, onBack }: { user: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('PROGRESSION')
  const [progression, setProgression] = useState<any>(null)
  const [xpInput, setXpInput] = useState('')
  const [levelInput, setLevelInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { push } = useToasts()

  useEffect(() => {
    loadData()
  }, [user.user_id])

  const loadData = async () => {
    const { data, error } = await supabase.from('progression').select('data').eq('user_id', user.user_id).eq('key', 'progression').single()
    if (data) {
      setProgression(data.data)
      setXpInput(data.data.xp?.toString() || '0')
      setLevelInput(data.data.level?.toString() || '1')
    }
  }

  const handleSaveProgression = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.rpc('admin_update_progression', {
        p_target_user_id: user.user_id,
        p_xp: parseInt(xpInput, 10) || 0,
        p_level: parseInt(levelInput, 10) || 1
      })
      if (error) throw error
      push('Progression updated securely.')
      loadData()
    } catch (e: any) {
      push(`Error: ${e.message}`)
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-surface-sunken)', border: '1px solid var(--border)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} color="#f59e0b" />
            God Mode: {user.display_name || user.username}
          </h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{user.login_id} &middot; {user.email} &middot; {user.role.toUpperCase()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 220, borderRight: '1px solid var(--border)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
          {['PROFILE', 'PROGRESSION', 'ACHIEVEMENTS', 'SKILLS', 'PROJECTS', 'SECURITY'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '1rem', textAlign: 'left', background: activeTab === tab ? 'rgba(245,158,11,0.1)' : 'transparent', color: activeTab === tab ? '#f59e0b' : 'var(--text-muted)', border: 'none', borderRight: activeTab === tab ? '3px solid #f59e0b' : '3px solid transparent', fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer' }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {activeTab === 'PROGRESSION' && (
            <div style={{ maxWidth: 600 }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> Level & XP Control</h3>
              
              <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Level</label>
                    <input type="number" value={levelInput} onChange={e => setLevelInput(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1.1rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current XP</label>
                    <input type="number" value={xpInput} onChange={e => setXpInput(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1.1rem' }} />
                  </div>
                  <button onClick={handleSaveProgression} disabled={loading} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}>
                    {loading ? 'Saving...' : 'OVERRIDE PROGRESSION'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab !== 'PROGRESSION' && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>
              <Star size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
              <h3>{activeTab} Management</h3>
              <p>Section accessible to administrators. Additional controls coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
