// @ts-nocheck
import { Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, ShieldAlert, UserMinus, LogOut, Edit2 } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import type { ChatGroup, ChatGroupMember } from '../../hooks/useGroupChat'
import { supabase } from '../../lib/supabase'

export function GroupInfoPanel({
  group,
  members,
  activeUserId,
  onClose,
  onRemoveMember,
  onUpdateRole,
  onLeaveGroup,
  onDeleteGroup,
  onUpdateGroup
}: {
  group: ChatGroup
  members: ChatGroupMember[]
  activeUserId: string
  onClose: () => void
  onRemoveMember: (uid: string) => void
  onUpdateRole: (uid: string, role: 'owner'|'admin'|'member') => void
  onLeaveGroup: () => void
  onDeleteGroup: () => void
  onUpdateGroup: (updates: Partial<ChatGroup>) => void
}) {
  const [profiles, setProfiles] = useState<Record<string, any>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [editDesc, setEditDesc] = useState(group.description || '')

  const myRole = members.find(m => m.user_id === activeUserId)?.role || 'member'
  const isOwner = myRole === 'owner'
  const isAdmin = isOwner || myRole === 'admin'

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!supabase) return
      const { data } = await supabase.from('profiles').select('user_id, data').eq('key', 'profile').in('user_id', members.map(m => m.user_id))
      if (data) {
        const pMap: Record<string, any> = {}
        data.forEach(p => { pMap[p.user_id] = p.data })
        setProfiles(pMap)
      }
    }
    fetchProfiles()
  }, [members])

  const handleSave = () => {
    onUpdateGroup({ name: editName.trim(), description: editDesc.trim() })
    setIsEditing(false)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-panel)', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-button" onClick={onClose} style={{ marginLeft: '-0.5rem' }}>
          <X size={20} />
        </button>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', flex: 1 }}>About Group</h3>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <Avatar src={group.avatar}  size={80} />
          {isEditing ? (
            <div style={{ width: '100%', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px', color: '#fff' }} />
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px', color: '#fff', minHeight: '60px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '6px', background: 'var(--cyan)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '6px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{ margin: '12px 0 4px', fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>{group.name}</h2>
              {group.description && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>{group.description}</p>}
              {isAdmin && (
                <button onClick={() => setIsEditing(true)} style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '100px', color: 'var(--text)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <Edit2 size={14} /> Edit Group Info
                </button>
              )}
            </>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Members ({members.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {members.map(m => {
              const p = profiles[m.user_id]
              const isMe = m.user_id === activeUserId
              return (
                <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={p?.avatar}  size={32} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontSize: '0.9rem' }}>{isMe ? 'You' : (p?.displayName || 'Unknown')}</span>
                      {m.role !== 'member' && <span style={{ fontSize: '0.7rem', color: m.role === 'owner' ? '#fbbf24' : 'var(--cyan)' }}>{m.role.toUpperCase()}</span>}
                    </div>
                  </div>
                  
                  {isAdmin && !isMe && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {isOwner && m.role === 'member' && (
                        <button onClick={() => onUpdateRole(m.user_id, 'admin')} title="Promote to Admin" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Shield size={16} /></button>
                      )}
                      {isOwner && m.role === 'admin' && (
                        <button onClick={() => onUpdateRole(m.user_id, 'member')} title="Demote to Member" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ShieldAlert size={16} /></button>
                      )}
                      {(isOwner || (isAdmin && m.role === 'member')) && (
                        <button onClick={() => onRemoveMember(m.user_id)} title="Remove Member" style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer' }}><UserMinus size={16} /></button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
        {isOwner ? (
          <button onClick={onDeleteGroup} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 69, 58, 0.1)', color: '#ff453a', border: '1px solid rgba(255, 69, 58, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <Trash2 size={16} /> Delete Group
          </button>
        ) : (
          <button onClick={onLeaveGroup} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 69, 58, 0.1)', color: '#ff453a', border: '1px solid rgba(255, 69, 58, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <LogOut size={16} /> Leave Group
          </button>
        )}
      </div>
    </div>
  )
}
