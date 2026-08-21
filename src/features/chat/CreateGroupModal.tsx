// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, Check, Edit2, Users } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { supabase } from '../../lib/supabase'
import { uploadProfileImage } from '../../lib/storage_upload'

export function CreateGroupModal({ 
  activeUserId, 
  onClose, 
  onCreate 
}: { 
  activeUserId: string
  onClose: () => void
  onCreate: (name: string, desc: string, avatar: string, members: string[]) => Promise<void> | void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarData, setAvatarData] = useState('')
  const [friends, setFriends] = useState<any[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchFriends = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('friendships')
        .select('user_id1, user_id2')
        .or('user_id1.eq.' + activeUserId + ',user_id2.eq.' + activeUserId)

      if (data) {
        const friendIds = data.map(f => f.user_id1 === activeUserId ? f.user_id2 : f.user_id1)
        if (friendIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, data')
            .eq('key', 'profile')
            .in('user_id', friendIds)
          
          if (profiles) {
             setFriends(profiles.map(p => ({
               userId: p.user_id,
               displayName: p.data?.displayName || 'Unknown',
               avatar: p.data?.avatar || ''
             })))
          }
        }
      }
      setLoading(false)
    }
    fetchFriends()
  }, [activeUserId])

  const toggleFriend = (id: string) => {
    setSelectedFriends(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show immediate preview
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    // Process into optimized base64 using the existing utility
    const base64 = await uploadProfileImage(activeUserId, file, 'avatar')
    if (base64) {
      setAvatarData(base64)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || creating) return
    setCreating(true)
    setError('')
    try {
      await onCreate(name.trim(), description.trim(), avatarData, selectedFriends)
    } catch (err: any) {
      setError(err.message || 'Failed to create group')
      setCreating(false)
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const portalTarget = document.getElementById('modal-root') || document.body

  return createPortal(
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#1a1b2e', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', margin: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Create Group</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Group Avatar Picker */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s'
              }}>
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Group avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <Users size={36} color="rgba(255,255,255,0.25)" />
                )}
              </div>
              {/* Pencil overlay */}
              <div style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--cyan, #22d3ee)',
                border: '2px solid #1a1b2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s'
              }}>
                <Edit2 size={13} color="#000" />
              </div>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarSelect}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Group Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} placeholder="Enter group name..." />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description (optional)</label>
            <input value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} placeholder="Group description..." />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add Members ({selectedFriends.length})</label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
              {loading ? <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading friends...</div> : friends.length === 0 ? <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>No friends found.</div> : friends.map(f => (
                <div key={f.userId} onClick={() => toggleFriend(f.userId)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '6px', background: selectedFriends.includes(f.userId) ? 'rgba(6, 182, 212, 0.1)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={f.avatar} size={32} />
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>{f.displayName}</span>
                  </div>
                  {selectedFriends.includes(f.userId) && <Check size={18} color="var(--cyan)" />}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={!name.trim() || creating} style={{ width: '100%', padding: '12px', background: (!name.trim() || creating) ? 'var(--bg-surface)' : 'var(--cyan)', color: (!name.trim() || creating) ? 'var(--text-muted)' : '#000', border: 'none', borderRadius: '8px', fontWeight: 600, marginTop: '10px', cursor: (!name.trim() || creating) ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}>
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </motion.div>
    </div>,
    portalTarget
  )
}

