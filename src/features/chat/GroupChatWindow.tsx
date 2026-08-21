// @ts-nocheck
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronLeft, MoreVertical, X, Trash2, Edit2, Shield, Info, Copy, VolumeX, Volume2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Avatar } from '../../components/Avatar'
import type { ChatGroup, ChatGroupMember, ChatGroupMessage } from '../../hooks/useGroupChat'
import { supabase } from '../../lib/supabase'
import { GroupInfoPanel } from './GroupInfoPanel'
import { ConfirmDialog } from './ConfirmDialog'


type ContextMenuState = {
  msgId: string
  x: number
  y: number
  isMe: boolean
  content: string
  deletedForEveryone?: boolean
} | null

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  background: 'transparent',
  border: 'none',
  color: 'var(--text)',
  cursor: 'pointer',
  borderRadius: '0.375rem',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
}
const menuItemDangerStyle: React.CSSProperties = { ...menuItemStyle, color: '#ef4444' }
const menuItemDisabledStyle: React.CSSProperties = { ...menuItemStyle, color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.5 }

function MenuItem({ label, icon, onClick, danger, disabled }: { label: string, icon: React.ReactNode, onClick?: () => void, danger?: boolean, disabled?: boolean }) {
  const style = disabled ? menuItemDisabledStyle : danger ? menuItemDangerStyle : menuItemStyle
  return (
    <button
      style={style}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--surface-sunken)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {icon}
      {label}
    </button>
  )
}

export function GroupChatWindow({
  activeUserId,
  group,
  members,
  messages,
  onSendMessage,
  onClose,
  onRemoveMember,
  onUpdateRole,
  onAddMembers,
  onLeaveGroup,
  onDeleteGroup,
  onUpdateGroup,
  onEditMessage,
  onDeleteForMe,
  onDeleteForEveryone,
  isMuted,
  onToggleMute,
  onClearChat
}: {
  activeUserId: string
  group: ChatGroup
  members: ChatGroupMember[]
  messages: ChatGroupMessage[]
  onSendMessage: (groupId: string, content: string) => void
  onClose: () => void
  onRemoveMember: (uid: string) => void
  onUpdateRole: (uid: string, role: 'owner'|'admin'|'member') => void
  onAddMembers: (uids: string[]) => void
  onLeaveGroup: () => void
  onDeleteGroup: () => void
  onUpdateGroup: (updates: Partial<ChatGroup>) => void
  onEditMessage?: (messageId: string, content: string) => void
  onDeleteForMe?: (messageId: string) => void
  onDeleteForEveryone?: (messageId: string) => void
  isMuted?: boolean
  onToggleMute?: () => void
  onClearChat?: () => void
}) {
  const [draft, setDraft] = useState('')
  const [infoOpen, setInfoOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [profiles, setProfiles] = useState<Record<string, any>>({})

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (contextMenu && contextMenuRef.current) {
      const rect = contextMenuRef.current.getBoundingClientRect()
      let newX = contextMenu.x
      let newY = contextMenu.y
      if (newX + rect.width > window.innerWidth - 8) {
        newX = window.innerWidth - rect.width - 8
      }
      if (newY + rect.height > window.innerHeight - 8) {
        newY = window.innerHeight - rect.height - 8
      }
      newX = Math.max(8, newX)
      newY = Math.max(8, newY)
      if (newX !== contextMenu.x || newY !== contextMenu.y) {
        setContextMenu(prev => prev ? { ...prev, x: newX, y: newY } : null)
      }
    }
  }, [contextMenu?.msgId])


  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target as Node)) return
      setContextMenu(null)
      setHeaderMenuOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null)
        setHeaderMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!supabase) return
      const uids = Array.from(new Set(messages.map(m => m.sender_id)))
      if (uids.length === 0) return
      const { data } = await supabase.from('profiles').select('user_id, data').eq('key', 'profile').in('user_id', uids)
      if (data) {
        const map: Record<string, any> = {}
        data.forEach(p => { map[p.user_id] = p.data })
        setProfiles(map)
      }
    }
    fetchProfiles()
  }, [messages])

  const handleSend = () => {
    if (editingMessageId) {
      if (!editDraft.trim()) return
      onEditMessage?.(editingMessageId, editDraft.trim())
      setEditingMessageId(null)
      setEditDraft('')
      return
    }
    if (!draft.trim()) return
    onSendMessage(group.id, draft.trim())
    setDraft('')
  }

  const myRole = members.find(m => m.user_id === activeUserId)?.role || 'member'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {infoOpen ? (
        <GroupInfoPanel 
          group={group}
          members={members}
          activeUserId={activeUserId}
          onClose={() => setInfoOpen(false)}
          onRemoveMember={onRemoveMember}
          onUpdateRole={onUpdateRole}
          onAddMembers={onAddMembers}
          onLeaveGroup={onLeaveGroup}
          onDeleteGroup={onDeleteGroup}
          onUpdateGroup={onUpdateGroup}
        />
      ) : <>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-sunken)' }}>
        <button className="icon-button mobile-only" onClick={onClose} style={{ marginRight: '-0.5rem' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ width: '40px', height: '40px' }}>
          <Avatar src={group.avatar}  size={40} />
        </div>
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setInfoOpen(true)}>
          <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1.1rem' }}>{group.name}</h4>
          <span className="muted" style={{ fontSize: '0.8rem' }}>{members.length} members</span>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="icon-button" onClick={(e) => { e.stopPropagation(); setHeaderMenuOpen(!headerMenuOpen) }}>
            <MoreVertical size={20} />
          </button>
          {headerMenuOpen && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              padding: '0.5rem', 
              minWidth: '150px',
              zIndex: 9999,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              <MenuItem
                icon={isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
                label={isMuted ? "Unmute" : "Mute"}
                onClick={() => {
                  onToggleMute?.()
                  setHeaderMenuOpen(false)
                }}
              />
              <MenuItem
                icon={<Trash2 size={16} />}
                label="Clear Chat"
                danger
                onClick={() => {
                  setClearConfirmOpen(true)
                  setHeaderMenuOpen(false)
                }}
              />
              <MenuItem
                icon={<Info size={16} />}
                label="About Group"
                onClick={() => {
                  setInfoOpen(true)
                  setHeaderMenuOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No messages yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Start the conversation!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === activeUserId
            const senderProfile = profiles[msg.sender_id]
            const senderName = isMe ? 'You' : (senderProfile?.displayName || 'Unknown')

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.75rem' }}>
                {!isMe && (
                  <Avatar src={senderProfile?.avatar}  size={32} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}
                  onContextMenu={e => {
                    e.preventDefault();
                    setContextMenu({
                      msgId: msg.id,
                      x: e.clientX,
                      y: e.clientY,
                      isMe,
                      content: msg.content,
                      deletedForEveryone: msg.deleted_for_everyone
                    })
                  }}>
                  {!isMe && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '4px' }}>
                      {senderName}
                    </span>
                  )}
                  <div style={{ 
                    padding: '0.75rem 1rem', 
                    background: isMe ? 'var(--cyan)' : 'var(--surface-sunken)', 
                    color: isMe ? '#000' : '#fff', 
                    borderRadius: '16px',
                    borderBottomRightRadius: isMe ? '4px' : '16px',
                    borderBottomLeftRadius: !isMe ? '4px' : '16px',
                    wordBreak: 'break-word',
                    position: 'relative'
                  }}>
                    {msg.deleted_for_everyone ? (
                      <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Message deleted</span>
                    ) : (
                      <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{msg.content}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginRight: '4px' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.edited_at && !msg.deleted_for_everyone && <span style={{ marginLeft: '4px', fontStyle: 'italic' }}>(edited)</span>}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      {editingMessageId && (
        <div style={{ padding: '0.5rem 1.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit2 size={14} color="var(--cyan)" />
            Editing message
          </div>
          <button onClick={() => { setEditingMessageId(null); setEditDraft('') }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input 
          style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '100px', color: '#fff' }}
          placeholder="Type a message..."
          value={editingMessageId ? editDraft : draft}
          onChange={e => editingMessageId ? setEditDraft(e.target.value) : setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button 
          onClick={handleSend}
          disabled={editingMessageId ? !editDraft.trim() : !draft.trim()}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: (editingMessageId ? editDraft.trim() : draft.trim()) ? 'var(--cyan)' : 'var(--bg-surface)', color: (editingMessageId ? editDraft.trim() : draft.trim()) ? '#000' : 'var(--text-muted)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (editingMessageId ? editDraft.trim() : draft.trim()) ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
        >
          <Send size={18} style={{ transform: 'translateX(-1px)' }} />
        </button>
      </div>

      </>}

      {contextMenu && createPortal(
        <div 
          ref={contextMenuRef}
          style={{ 
            position: 'fixed', 
            left: contextMenu.x, 
            top: contextMenu.y, 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            minWidth: '160px',
            zIndex: 10000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {contextMenu.isMe && !contextMenu.deletedForEveryone && (
            <MenuItem
              icon={<Edit2 size={16} />}
              label="Edit"
              onClick={() => {
                setEditingMessageId(contextMenu.msgId)
                setEditDraft(contextMenu.content)
                setContextMenu(null)
              }}
            />
          )}

          {contextMenu.isMe && !contextMenu.deletedForEveryone && (
            <MenuItem
              icon={<Trash2 size={16} />}
              label="Delete for everyone"
              danger
              onClick={() => {
                onDeleteForEveryone?.(contextMenu.msgId)
                setContextMenu(null)
              }}
            />
          )}
          
          {(contextMenu.isMe && !contextMenu.deletedForEveryone) && <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />}

          <MenuItem
            icon={<Trash2 size={16} />}
            label="Delete for me"
            onClick={() => {
              onDeleteForMe?.(contextMenu.msgId)
              setContextMenu(null)
            }}
          />
        </div>,
        document.body
      )}
      {clearConfirmOpen && (
        <ConfirmDialog
          title="Clear Chat"
          message="Are you sure you want to clear this chat history for yourself? This will hide past messages but won't delete them for other members."
          confirmText="Clear Chat"
          danger
          onConfirm={() => {
            onClearChat?.()
            setClearConfirmOpen(false)
          }}
          onCancel={() => setClearConfirmOpen(false)}
        />
      )}
    </div>
  )
}
