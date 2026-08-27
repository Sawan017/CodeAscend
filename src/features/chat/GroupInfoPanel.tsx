// @ts-nocheck
import { Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, ShieldAlert, UserMinus, LogOut, Edit2, UserPlus } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import type { ChatGroup, ChatGroupMember } from '../../hooks/useGroupChat'
import { supabase } from '../../lib/supabase'
import { AddMembersModal } from './AddMembersModal'
import { ConfirmDialog } from './ConfirmDialog'
import { uploadProfileImage } from '../../lib/storage_upload'

export function GroupInfoPanel({
  group,
  members,
  activeUserId,
  onClose,
  onRemoveMember,
  onUpdateRole,
  onAddMembers,
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
  onAddMembers: (uids: string[]) => void
  onLeaveGroup: () => void
  onDeleteGroup: () => void
  onUpdateGroup: (updates: Partial<ChatGroup>) => void
}) {
  const [profiles, setProfiles] = useState<Record<string, any>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [editDesc, setEditDesc] = useState(group.description || '')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<{ file: File, dataUrl: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please select a JPG, PNG, or WEBP image.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPreviewImage({ file, dataUrl: ev.target.result as string })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveImage = async () => {
    if (!previewImage) return
    try {
      setUploadingImage(true)
      const optimizedBase64 = await uploadProfileImage(activeUserId, previewImage.file, 'avatar')
      if (optimizedBase64) {
        onUpdateGroup({ avatar: optimizedBase64 })
      }
      setPreviewImage(null)
    } catch (err) {
      console.error('Failed to upload image:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCancelImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

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
    <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-button" onClick={onClose} style={{ marginLeft: '-0.5rem' }}>
          <X size={20} />
        </button>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', flex: 1 }}>About Group</h3>
      </div>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', marginBottom: previewImage ? '8px' : '0' }}>
            <Avatar src={previewImage ? previewImage.dataUrl : group.avatar} size={80} />
            {isAdmin && !previewImage && (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleImageSelect} 
                  style={{ display: 'none' }} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    background: 'var(--cyan)', 
                    color: '#000', 
                    border: '2px solid #fff', 
                    borderRadius: '50%', 
                    width: '28px', 
                    height: '28px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    opacity: uploadingImage ? 0.5 : 1
                  }}
                  title="Change Group Image"
                >
                  <Edit2 size={14} />
                </button>
              </>
            )}
          </div>
          
          {previewImage && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
              <button 
                onClick={handleSaveImage} 
                disabled={uploadingImage}
                style={{ padding: '6px 16px', background: 'var(--cyan)', color: '#000', border: 'none', borderRadius: '100px', cursor: uploadingImage ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: uploadingImage ? 0.7 : 1 }}
              >
                {uploadingImage ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={handleCancelImage} 
                disabled={uploadingImage}
                style={{ padding: '6px 16px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '100px', cursor: uploadingImage ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: uploadingImage ? 0.7 : 1 }}
              >
                Cancel
              </button>
            </div>
          )}

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
              {group.description && <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A958C', textAlign: 'center' }}>{group.description}</p>}
              {isAdmin && (
                <button onClick={() => setIsEditing(true)} style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '100px', color: 'var(--text)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <Edit2 size={14} /> Edit Group Info
                </button>
              )}
            </>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#9A958C', textTransform: 'uppercase' }}>Members ({members.length})</h4>
            {isAdmin && (
              <button onClick={() => setAddMembersOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                <UserPlus size={14} /> Add
              </button>
            )}
          </div>
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
                        <button onClick={() => onUpdateRole(m.user_id, 'admin')} title="Promote to Admin" style={{ background: 'none', border: 'none', color: '#9A958C', cursor: 'pointer' }}><Shield size={16} /></button>
                      )}
                      {isOwner && m.role === 'admin' && (
                        <button onClick={() => onUpdateRole(m.user_id, 'member')} title="Demote to Member" style={{ background: 'none', border: 'none', color: '#9A958C', cursor: 'pointer' }}><ShieldAlert size={16} /></button>
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
          <button onClick={() => setDeleteConfirmOpen(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 69, 58, 0.1)', color: '#ff453a', border: '1px solid rgba(255, 69, 58, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <Trash2 size={16} /> Delete Group
          </button>
        ) : (
          <button onClick={() => setLeaveConfirmOpen(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 69, 58, 0.1)', color: '#ff453a', border: '1px solid rgba(255, 69, 58, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <LogOut size={16} /> Leave Group
          </button>
        )}
      </div>
      
      {addMembersOpen && (
        <AddMembersModal
          activeUserId={activeUserId}
          existingMemberIds={members.map(m => m.user_id)}
          onClose={() => setAddMembersOpen(false)}
          onAddMembers={onAddMembers}
        />
      )}
      
      {leaveConfirmOpen && (
        <ConfirmDialog
          title="Leave Group"
          message="Are you sure you want to leave this group? You won't be able to send or receive new messages."
          confirmText="Leave Group"
          danger
          onConfirm={onLeaveGroup}
          onCancel={() => setLeaveConfirmOpen(false)}
        />
      )}
      
      {deleteConfirmOpen && (
        <ConfirmDialog
          title="Delete Group"
          message="Are you sure you want to completely delete this group? This action cannot be undone."
          confirmText="Delete Group"
          danger
          onConfirm={onDeleteGroup}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}
    </div>
  )
}

