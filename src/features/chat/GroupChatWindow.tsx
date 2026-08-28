// @ts-nocheck
import { formatAppTime } from '../../lib/dateFormatting'
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
const menuItemDisabledStyle: React.CSSProperties = { ...menuItemStyle, color: '#9A958C', cursor: 'not-allowed', opacity: 0.5 }

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
  const chatContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (contextMenu && contextMenuRef.current && chatContainerRef.current) {
      const rect = contextMenuRef.current.getBoundingClientRect()
      const chatRect = chatContainerRef.current.getBoundingClientRect()
      
      let newX = contextMenu.x
      let newY = contextMenu.y
      
      // If it overflows right, move left of cursor
      if (newX + rect.width > chatRect.right) {
        newX = contextMenu.x - rect.width
      }
      // If it overflows bottom, move above cursor
      if (newY + rect.height > chatRect.bottom) {
        newY = contextMenu.y - rect.height
      }
      
      // Clamp to chat container
      newX = Math.max(chatRect.left, Math.min(newX, chatRect.right - rect.width))
      newY = Math.max(chatRect.top, Math.min(newY, chatRect.bottom - rect.height))
      
      if (newX !== contextMenu.x || newY !== contextMenu.y) {
        setContextMenu(prev => prev ? { ...prev, x: newX, y: newY } : null)
      }
    }
  }, [contextMenu])


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
    <div ref={chatContainerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }}>
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
              top: 'calc(100% + 4px)', 
              right: 0, 
              background: 'var(--ca-surface, #ffffff)', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '0.35rem', 
              minWidth: '160px',
              zIndex: 9999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#9A958C' }}>
            <p>No messages yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === activeUserId
            const senderProfile = profiles[msg.sender_id]
            const senderName = isMe ? 'You' : (senderProfile?.displayName || 'Unknown')

            const prevMsg = idx > 0 ? messages[idx - 1] : null
            const nextMsg = messages[idx + 1];
            const showTimestamp = true;
            const currentMsgDate = new Date(msg.created_at);
            const prevMsgDate = prevMsg ? new Date(prevMsg.created_at) : null;
            const nextMsgDate = nextMsg ? new Date(nextMsg.created_at) : null;
            
            const isSameSenderAsPrev = prevMsg && msg.sender_id === prevMsg.sender_id;
            const isSameSenderAsNext = nextMsg && msg.sender_id === nextMsg.sender_id;

            const isSameMinuteAsPrev = prevMsgDate ? (
              currentMsgDate.getHours() === prevMsgDate.getHours() && 
              currentMsgDate.getMinutes() === prevMsgDate.getMinutes() &&
              currentMsgDate.toDateString() === prevMsgDate.toDateString()
            ) : false;
            
            const isSameMinuteAsNext = nextMsgDate ? (
              currentMsgDate.getHours() === nextMsgDate.getHours() && 
              currentMsgDate.getMinutes() === nextMsgDate.getMinutes() &&
              currentMsgDate.toDateString() === nextMsgDate.toDateString()
            ) : false;

            const isGroupedWithPrev = isSameSenderAsPrev && isSameMinuteAsPrev;
            const isGroupedWithNext = isSameSenderAsNext && isSameMinuteAsNext;

            let marginTop = '16px';
            if (idx === 0) {
              marginTop = '0px';
            } else if (isSameSenderAsPrev) {
              marginTop = isSameMinuteAsPrev ? '2px' : '16px';
            }

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.75rem', marginTop }}>
                {!isMe && (
                  <div style={{ width: '32px' }}>
                    {(!nextMsg || msg.sender_id !== nextMsg.sender_id) && <Avatar src={senderProfile?.avatar} size={32} />}
                  </div>
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
                  {!isMe && !isSameSenderAsPrev && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--ca-text-secondary, #9A958C)', marginBottom: '4px', marginLeft: '4px', fontWeight: 600 }}>
                      {senderName}
                    </span>
                  )}
                  <div style={{ 
                    padding: '0.4rem 0.65rem', 
                    background: isMe ? 'var(--primary)' : 'var(--bg-surface)', 
                    color: isMe ? '#ffffff' : 'var(--text-main)', 
                    borderTopLeftRadius: !isMe && isGroupedWithPrev ? '4px' : '16px',
                    borderTopRightRadius: isMe && isGroupedWithPrev ? '4px' : '16px',
                    borderBottomRightRadius: isMe && isGroupedWithNext ? '4px' : '16px',
                    borderBottomLeftRadius: !isMe && isGroupedWithNext ? '4px' : '16px',
                    position: 'relative',
                    minWidth: showTimestamp ? '75px' : 'auto',
                    border: msg.deleted_for_everyone ? '1px dashed var(--border)' : !isMe ? '1px solid var(--border)' : 'none'
                  }}>
                    <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                      {msg.deleted_for_everyone ? (
                        <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Message deleted</span>
                      ) : (
                        msg.content
                      )}
                      {showTimestamp && (
                        <span style={{ display: 'inline-block', width: (msg.edited_at && !msg.deleted_for_everyone) ? '85px' : '55px', height: '1px' }} />
                      )}
                    </div>
                    {showTimestamp && (
                      <span style={{ 
                        position: 'absolute', 
                        bottom: '4px', 
                        right: '8px', 
                        fontSize: '0.65rem', 
                        color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center',
                        lineHeight: 1
                      }}>
                        {formatAppTime(msg.created_at)}
                        {msg.edited_at && !msg.deleted_for_everyone && <span style={{ fontStyle: 'italic' }}>(edited)</span>}
                      </span>
                    )}
                  </div>
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
          <button onClick={() => { setEditingMessageId(null); setEditDraft('') }} style={{ background: 'none', border: 'none', color: '#9A958C', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input 
          style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '100px', color: 'var(--ca-text, #111827)' }}
          placeholder="Type a message..."
          value={editingMessageId ? editDraft : draft}
          onChange={e => editingMessageId ? setEditDraft(e.target.value) : setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button 
          onClick={handleSend}
          disabled={editingMessageId ? !editDraft.trim() : !draft.trim()}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: (editingMessageId ? editDraft.trim() : draft.trim()) ? 'var(--cyan)' : '#fff', color: (editingMessageId ? editDraft.trim() : draft.trim()) ? '#000' : '#9A958C', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (editingMessageId ? editDraft.trim() : draft.trim()) ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
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
            background: '#fff', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            minWidth: '160px',
            maxWidth: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10000,
            boxShadow: '0 8px 24px rgba(255,255,255,0.8)',
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

