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
      // Enforce strict UUID format to prevent PostgREST filter injection
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(activeUserId)) return;

      const { data } = await supabase
        .from('friendships')
        .select('user_id1, user_id2')
        .or(`user_id1.eq.${activeUserId},user_id2.eq.${activeUserId}`)

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
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .cg-input {
          width: 100%;
          background: var(--ca-bg, #F7F7F2);
          border: 1px solid var(--ca-border, rgba(0,0,0,0.12));
          padding: 10px 14px;
          border-radius: 8px;
          color: var(--ca-text, #1E1D1B);
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cg-input:focus {
          border-color: var(--primary, #3b82f6);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }
        .cg-input::placeholder {
          color: var(--ca-text-muted, #9A958C);
        }
      `}} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--ca-surface, #ffffff)', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '440px', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', border: '1px solid var(--ca-border, rgba(0,0,0,0.1))', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', margin: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--ca-text, #000)', fontWeight: 600 }}>Create Group</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ca-text-muted, #9A958C)', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Group Avatar Picker */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid var(--ca-border, rgba(0,0,0,0.15))',
                background: 'var(--ca-bg, #f5f5f5)',
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
                  <Users size={32} color="var(--ca-text-muted, #9A958C)" />
                )}
              </div>
              {/* Pencil overlay */}
              <div style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'var(--primary, #3b82f6)',
                border: '2px solid var(--ca-surface, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s'
              }}>
                <Edit2 size={12} color="#ffffff" />
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
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--ca-text-secondary, #5A5750)', fontWeight: 500 }}>Group Name</label>
            <input className="cg-input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter group name..." />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--ca-text-secondary, #5A5750)', fontWeight: 500 }}>Description (optional)</label>
            <input className="cg-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Group description..." />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--ca-text-secondary, #5A5750)', fontWeight: 500 }}>Add Members ({selectedFriends.length})</label>
            <div style={{ maxHeight: '180px', overflowY: 'auto', background: 'var(--ca-bg, #f5f5f5)', border: '1px solid var(--ca-border, rgba(0,0,0,0.12))', borderRadius: '8px', padding: '6px' }}>
              {loading ? <div style={{ padding: '12px', textAlign: 'center', color: 'var(--ca-text-muted, #9A958C)', fontSize: '0.9rem' }}>Loading friends...</div> : friends.length === 0 ? <div style={{ padding: '12px', textAlign: 'center', color: 'var(--ca-text-muted, #9A958C)', fontSize: '0.9rem' }}>No friends found.</div> : friends.map(f => (
                <div key={f.userId} onClick={() => toggleFriend(f.userId)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '6px', background: selectedFriends.includes(f.userId) ? 'var(--ca-green-light, rgba(62,163,84,0.08))' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={f.avatar} size={32} />
                    <span style={{ color: 'var(--ca-text, #000)', fontSize: '0.9rem', fontWeight: 500 }}>{f.displayName}</span>
                  </div>
                  {selectedFriends.includes(f.userId) && <Check size={18} color="var(--ca-green, #3EA354)" />}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={!name.trim() || creating} style={{ width: '100%', padding: '12px', background: (!name.trim() || creating) ? 'var(--ca-surface-alt, #e5e7eb)' : 'var(--primary, #3b82f6)', color: (!name.trim() || creating) ? 'var(--ca-text-muted, #9A958C)' : '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, marginTop: '8px', cursor: (!name.trim() || creating) ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1, transition: 'background-color 0.2s', boxShadow: (!name.trim() || creating) ? 'none' : '0 2px 8px rgba(0,0,0,0.1)' }}>
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </motion.div>
    </div>,
    portalTarget
  )
}


