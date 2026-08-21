import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { supabase } from '../../lib/supabase'

export function AddMembersModal({
  activeUserId,
  existingMemberIds,
  onClose,
  onAddMembers
}: {
  activeUserId: string
  existingMemberIds: string[]
  onClose: () => void
  onAddMembers: (userIds: string[]) => Promise<void> | void
}) {
  const [friends, setFriends] = useState<any[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchFriends = async () => {
      if (!supabase) return
      const { data } = await supabase
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

  const handleAdd = async () => {
    if (selectedFriends.length === 0) return
    setAdding(true)
    await onAddMembers(selectedFriends)
    setAdding(false)
    onClose()
  }

  const availableFriends = friends.filter(f => !existingMemberIds.includes(f.userId))

  return createPortal(
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', margin: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Add Members</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', marginBottom: '16px' }}>
          {loading ? (
            <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading friends...</div>
          ) : availableFriends.length === 0 ? (
            <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>No available friends to add.</div>
          ) : (
            availableFriends.map(f => (
              <div key={f.userId} onClick={() => toggleFriend(f.userId)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '6px', background: selectedFriends.includes(f.userId) ? 'rgba(6, 182, 212, 0.1)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar src={f.avatar} size={32} />
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>{f.displayName}</span>
                </div>
                {selectedFriends.includes(f.userId) && <Check size={18} color="var(--cyan)" />}
              </div>
            ))
          )}
        </div>

        <button onClick={handleAdd} disabled={selectedFriends.length === 0 || adding} style={{ width: '100%', padding: '12px', background: (selectedFriends.length === 0 || adding) ? 'var(--bg-surface-sunken)' : 'var(--cyan)', color: (selectedFriends.length === 0 || adding) ? 'var(--text-muted)' : '#000', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 600, cursor: (selectedFriends.length === 0 || adding) ? 'not-allowed' : 'pointer', opacity: adding ? 0.7 : 1 }}>
          {adding ? 'Adding...' : `Add ${selectedFriends.length} Members`}
        </button>
      </motion.div>
    </div>,
    document.body
  )
}
