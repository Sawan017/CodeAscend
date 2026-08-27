import { formatAppTime } from '../../lib/dateFormatting'
import { motion } from 'framer-motion'
import { Send, ChevronLeft, MessageSquare, MoreVertical, Edit2, X, Copy, CheckSquare, Trash2, Ban, BellOff, Eraser } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { ChatMessage, FriendRelationship } from '../../types'
import { fetchPublicProfiles } from '../../lib/api'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Avatar } from '../../components/Avatar'

type PublicUser = {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  login_id?: string;
  arinova_id?: string;
}

type ChatPanelProps = {
  activeUserId: string
  chatState: import('../../types').ChatState
  friendState: { relationships: FriendRelationship[] }
  incomingMessages: ChatMessage[]
  onSendMessage: (receiverId: string, content: string) => void
  onMarkRead: (friendId: string, timestamp: string) => void
  onOpenProfile: (userId: string) => void
  activeFriendId: string | null
  onSetActiveFriendId: (userId: string | null) => void
  onlineUsers?: string[]
  onEditMessage?: (messageId: string, content: string) => void
  onDeleteForMe?: (messageId: string) => void
  onDeleteForEveryone?: (messageId: string) => void
  onToggleMute?: (friendId: string) => void
  onToggleBlock?: (friendId: string) => void
  onClearChat?: (friendId: string) => void
}

type ContextMenuState = {
  msgId: string
  x: number
  y: number
  isMe: boolean
  content: string
  deletedForEveryone?: boolean
} | null

// Shared menu item style
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

const menuItemDangerStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: '#ef4444',
}

const menuItemDisabledStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: '#9A958C',
  cursor: 'not-allowed',
  opacity: 0.5,
}

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

export function DirectChatPanel({ 
  activeUserId, chatState, friendState, incomingMessages, 
  onSendMessage, onMarkRead, onOpenProfile, activeFriendId, 
  onSetActiveFriendId, onlineUsers = [],
  onEditMessage, onDeleteForMe, onDeleteForEveryone,
  onToggleMute, onToggleBlock, onClearChat
}: ChatPanelProps) {
  const [publicProfiles, setPublicProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set())
  const touchTimer = useRef<number | null>(null)
  
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Load public profiles
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const neededIds = friendState.relationships.map(r => r.userId)
      const profiles = await fetchPublicProfiles(neededIds.length > 0 ? neededIds : undefined)
      if (!mounted) return
      setPublicProfiles(profiles)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [friendState.relationships])

  // Close menus on outside mousedown (not click — click races with contextmenu) and Escape
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only close on left-click (button 0), not right-click (button 2)
      if (e.button !== 0) return
      // Don't close if clicking inside the context menu itself
      if (contextMenuRef.current && contextMenuRef.current.contains(e.target as Node)) return
      setContextMenu(null)
      setHeaderMenuOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null)
        setHeaderMenuOpen(false)
        if (selectionMode) {
          setSelectionMode(false)
          setSelectedMessageIds(new Set())
        }
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectionMode])

  // After context menu renders, measure it and adjust position so it stays in viewport
  useEffect(() => {
    if (contextMenu && contextMenuRef.current) {
      const rect = contextMenuRef.current.getBoundingClientRect()
      let newX = contextMenu.x
      let newY = contextMenu.y
      // If menu overflows right edge, flip left
      if (newX + rect.width > window.innerWidth - 8) {
        newX = window.innerWidth - rect.width - 8
      }
      // If menu overflows bottom edge, flip up
      if (newY + rect.height > window.innerHeight - 8) {
        newY = window.innerHeight - rect.height - 8
      }
      // Ensure never goes off left/top
      newX = Math.max(8, newX)
      newY = Math.max(8, newY)
      if (newX !== contextMenu.x || newY !== contextMenu.y) {
        setContextMenu(prev => prev ? { ...prev, x: newX, y: newY } : null)
      }
    }
  }, [contextMenu?.msgId]) // only re-run when a new menu opens (new msgId)

  // Auto-scroll to newest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatState.messages, incomingMessages, activeFriendId])

  // Merge sent messages and incoming messages
  let allMessages = [...(chatState.messages || []), ...(incomingMessages || [])]
  
  // Filter out hidden messages (Delete for Me)
  const hiddenMsgs = chatState.hiddenMessages || []
  allMessages = allMessages.filter(m => !hiddenMsgs.includes(m.id))
  
  allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Get accepted friends
  const acceptedIds = friendState.relationships.filter(r => r.status === 'accepted').map(r => r.userId)
  const friends = publicProfiles.filter(p => acceptedIds.includes(p.userId))

  const activeFriend = friends.find(f => f.userId === activeFriendId)
  
  // Conversations list data
  const conversations = friends.map(friend => {
    const friendClearedAt = chatState.clearedChats?.[friend.userId] || '1970-01-01T00:00:00.000Z'
    
    const friendMsgs = allMessages.filter(m => 
      (m.senderId === friend.userId || m.receiverId === friend.userId) &&
      new Date(m.timestamp) > new Date(friendClearedAt)
    )
    const lastMsg = friendMsgs.length > 0 ? friendMsgs[friendMsgs.length - 1] : null
    
    // Calculate unread count
    const lastReadTime = chatState.lastRead?.[friend.userId] || '1970-01-01T00:00:00.000Z'
    const unreadCount = incomingMessages.filter(m => 
      m.senderId === friend.userId && 
      new Date(m.timestamp) > new Date(lastReadTime) &&
      new Date(m.timestamp) > new Date(friendClearedAt)
    ).length

    return {
      friend,
      lastMsg,
      unreadCount
    }
  }).sort((a, b) => {
    if (!a.lastMsg && !b.lastMsg) return 0
    if (!a.lastMsg) return 1
    if (!b.lastMsg) return -1
    return new Date(b.lastMsg.timestamp).getTime() - new Date(a.lastMsg.timestamp).getTime()
  })

  // Mark as read when opening a chat
  useEffect(() => {
    if (activeFriendId) {
      const friendMsgs = incomingMessages.filter(m => m.senderId === activeFriendId)
      if (friendMsgs.length > 0) {
        const latest = friendMsgs[friendMsgs.length - 1].timestamp
        const currentLastRead = chatState.lastRead?.[activeFriendId] || '1970-01-01T00:00:00.000Z'
        if (new Date(latest) > new Date(currentLastRead)) {
          onMarkRead(activeFriendId, latest)
        }
      }
    }
  }, [activeFriendId, incomingMessages, chatState.lastRead, onMarkRead])

  // Context menu handlers — position at cursor, then useEffect adjusts if off-screen
  const openContextMenu = useCallback((x: number, y: number, msg: ChatMessage, isMe: boolean) => {
    setContextMenu({
      msgId: msg.id,
      x,
      y,
      isMe,
      content: msg.content,
      deletedForEveryone: msg.deletedForEveryone
    })
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent, msg: ChatMessage, isMe: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    openContextMenu(e.clientX, e.clientY, msg, isMe)
  }, [openContextMenu])

  const handleTouchStart = useCallback((e: React.TouchEvent, msg: ChatMessage, isMe: boolean) => {
    const touch = e.touches[0]
    touchTimer.current = window.setTimeout(() => {
      openContextMenu(touch.clientX, touch.clientY, msg, isMe)
    }, 500)
  }, [openContextMenu])

  const handleTouchEnd = useCallback(() => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current)
      touchTimer.current = null
    }
  }, [])

  const handleSend = async () => {
    if (!activeFriendId) return
    
    if (editingMessageId && onEditMessage) {
      if (!editDraft.trim()) return
      try {
        await onEditMessage(editingMessageId, editDraft.trim())
        setEditingMessageId(null)
        setEditDraft('')
      } catch (err: any) {
        console.error("Failed to edit message:", err)
        alert(err.message || "Failed to edit message. Please try again.")
      }
    } else {
      if (!draft.trim()) return
      try {
        await onSendMessage(activeFriendId, draft.trim())
        setDraft('')
      } catch (err: any) {
        console.error("Failed to send message:", err)
        alert(err.message || "Failed to send message. Please try again.")
      }
    }
  }

  const toggleSelection = (msgId: string) => {
    const newSet = new Set(selectedMessageIds)
    if (newSet.has(msgId)) newSet.delete(msgId)
    else newSet.add(msgId)
    setSelectedMessageIds(newSet)
  }

  const clearedAt = (activeFriendId && chatState.clearedChats?.[activeFriendId]) || '1970-01-01T00:00:00.000Z'
  const activeConversationMsgs = allMessages
    .filter(m => m.senderId === activeFriendId || m.receiverId === activeFriendId)
    .filter(m => new Date(m.timestamp) > new Date(clearedAt))
    
  const isMuted = activeFriendId ? chatState.mutedUsers?.includes(activeFriendId) : false
  const isBlocked = activeFriendId ? chatState.blockedUsers?.includes(activeFriendId) : false

  // Check if all selected messages belong to me (for bulk unsend)
  const allSelectedAreMine = selectedMessageIds.size > 0 && [...selectedMessageIds].every(id => {
    const msg = activeConversationMsgs.find(m => m.id === id)
    return msg && msg.senderId === activeUserId && !msg.deletedForEveryone
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="section-shell" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      <div className="panel" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden', minHeight: 0 }}>
        
        {/* Sidebar / Conversation List */}
        <div 
          className={`chat-sidebar ${activeFriendId ? 'mobile-hidden' : ''}`}
          style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface-sunken)', flexShrink: 0 }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ margin: 0 }}>Conversations</h4>
          </div>
          <motion.div style={{ flex: 1, overflowY: 'auto' }} variants={container} initial="hidden" animate="show">
            {loading ? (
              <p className="muted" style={{ padding: '1.5rem', textAlign: 'center' }}>Loading friends...</p>
            ) : conversations.length === 0 ? (
              <p className="muted" style={{ padding: '1.5rem', textAlign: 'center' }}>No friends yet. Add some friends to start chatting!</p>
            ) : (
              conversations.map(conv => (
                <motion.div 
                  key={conv.friend.userId} 
                  variants={item}
                  className="chat-list-item"
                  onClick={() => onSetActiveFriendId(conv.friend.userId)}
                  style={{ 
                    padding: '1rem 1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    cursor: 'pointer',
                    background: activeFriendId === conv.friend.userId ? 'var(--surface)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.2s'
                  }}
                >
                  <div className="avatar-badge" style={{ width: '48px', height: '48px', flexShrink: 0, position: 'relative' }}>
                    <Avatar src={conv.friend.avatar} alt={conv.friend.displayName} size={48} isOnline={onlineUsers.includes(conv.friend.userId)} showStatus={true} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }}>{conv.friend.displayName}</h4>
                      {conv.lastMsg && <span className="muted" style={{ fontSize: '0.75rem' }}>
                        {formatAppTime(conv.lastMsg.timestamp)}
                      </span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <p className="muted" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                        {conv.lastMsg ? (conv.lastMsg.senderId === activeUserId ? `You: ${conv.lastMsg.content}` : conv.lastMsg.content) : 'Say hi!'}
                      </p>
                      {(() => {
                        const isConvMuted = chatState.mutedUsers?.includes(conv.friend.userId);
                        if (isConvMuted) {
                          return (
                            <span style={{ display: 'flex', alignItems: 'center', color: '#9A958C' }}>
                              <BellOff size={16} />
                            </span>
                          );
                        }
                        if (conv.unreadCount > 0) {
                          return (
                            <span style={{ background: 'var(--primary)', color: '#000', borderRadius: '12px', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                              {conv.unreadCount}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Main Panel (Chat Window or Empty State) */}
        <div 
          className={`chat-main ${!activeFriendId ? 'mobile-hidden' : ''}`} 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}
        >
          {activeFriendId && activeFriend ? (
            <>
              {/* Header */}
              {selectionMode ? (
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-sunken)' }}>
                  <button className="icon-button" onClick={() => { setSelectionMode(false); setSelectedMessageIds(new Set()) }} style={{ marginRight: '-0.5rem' }}>
                    <X size={20} />
                  </button>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{selectedMessageIds.size} selected</h4>
                  </div>
                  {selectedMessageIds.size > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {allSelectedAreMine && (
                        <button className="icon-button" onClick={() => {
                          selectedMessageIds.forEach(id => onDeleteForEveryone?.(id))
                          setSelectionMode(false)
                          setSelectedMessageIds(new Set())
                        }} style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Unsend all
                        </button>
                      )}
                      <button className="icon-button" onClick={() => {
                        selectedMessageIds.forEach(id => onDeleteForMe?.(id))
                        setSelectionMode(false)
                        setSelectedMessageIds(new Set())
                      }} style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-sunken)' }}>
                  <button className="icon-button" onClick={() => onSetActiveFriendId(null)} style={{ marginRight: '-0.5rem' }}>
                    <ChevronLeft size={20} />
                  </button>
                  <div 
                    className="avatar-badge" 
                    style={{ width: '40px', height: '40px', flexShrink: 0, cursor: 'pointer', position: 'relative' }}
                    onClick={() => onOpenProfile(activeFriend.userId)}
                  >
                    <Avatar src={activeFriend.avatar} alt={activeFriend.displayName} size={40} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 
                      style={{ margin: 0, cursor: 'pointer' }}
                      onClick={() => onOpenProfile(activeFriend.userId)}
                    >{activeFriend.displayName}</h4>
                    <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
                      @{activeFriend.login_id || activeFriend.arinova_id || activeFriend.username} • {onlineUsers.includes(activeFriend.userId) ? <span style={{ color: '#10b981' }}>Online</span> : 'Offline'}
                    </p>
                  </div>
                  {/* Header three-dot menu */}
                  <div style={{ position: 'relative' }}>
                    <button className="icon-button" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setHeaderMenuOpen(!headerMenuOpen) }}>
                      <MoreVertical size={20} />
                    </button>
                    {headerMenuOpen && (
                      <div style={{ 
                        position: 'absolute', 
                        zIndex: 9998, 
                        background: '#1e1e2e', 
                        border: '1px solid rgba(255,255,255,0.12)', 
                        borderRadius: '0.5rem', 
                        padding: '0.3rem',
                        width: '180px',
                        right: 0,
                        top: 'calc(100% + 4px)',
                        boxShadow: '0 10px 40px rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.05)'
                      }} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                        <MenuItem
                          icon={<BellOff size={16} />}
                          label={isMuted ? "Unmute" : "Mute"}
                          onClick={() => {
                            if (activeFriendId && onToggleMute) onToggleMute(activeFriendId)
                            setHeaderMenuOpen(false)
                          }}
                        />
                        <MenuItem
                          icon={<Ban size={16} />}
                          label={isBlocked ? "Unblock" : "Block"}
                          danger={!isBlocked}
                          onClick={() => {
                            if (activeFriendId && onToggleBlock) onToggleBlock(activeFriendId)
                            setHeaderMenuOpen(false)
                          }}
                        />
                        <MenuItem
                          icon={<Eraser size={16} />}
                          label="Clear chat"
                          onClick={() => {
                            if (activeFriendId && onClearChat) {
                              setShowClearConfirm(true)
                            }
                            setHeaderMenuOpen(false)
                          }}
                        />
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />
                        <MenuItem
                          icon={<CheckSquare size={16} />}
                          label="Select messages"
                          onClick={() => { setSelectionMode(true); setHeaderMenuOpen(false) }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages Area — prevent browser default context menu */}
              <div
                style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                onContextMenu={(e) => {
                  // Only prevent default if we didn't already handle a message-level context menu
                  e.preventDefault()
                }}
              >
                {activeConversationMsgs.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: '#9A958C' }}>
                    <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                    <p>No messages yet.</p>
                    <p style={{ fontSize: '0.85rem' }}>Start the conversation with {activeFriend.displayName}!</p>
                  </div>
                ) : (
                  activeConversationMsgs.map((msg, i) => {
                    const isMe = msg.senderId === activeUserId
                    const isSelected = selectedMessageIds.has(msg.id)
                    const showTimestamp = (() => {
                      if (i === activeConversationMsgs.length - 1) return true
                      const nextMsg = activeConversationMsgs[i + 1]
                      if (nextMsg.senderId !== msg.senderId) return true

                      const currTime = new Date(msg.timestamp)
                      const nextTime = new Date(nextMsg.timestamp)

                      const isSameMinute = 
                        currTime.getFullYear() === nextTime.getFullYear() &&
                        currTime.getMonth() === nextTime.getMonth() &&
                        currTime.getDate() === nextTime.getDate() &&
                        currTime.getHours() === nextTime.getHours() &&
                        currTime.getMinutes() === nextTime.getMinutes()

                      return !isSameMinute
                    })()

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '0.5rem', 
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          alignItems: 'flex-end',
                          marginBottom: showTimestamp ? '0' : '-0.5rem' // tighter spacing for grouped messages
                        }}
                        onContextMenu={(e) => {
                          if (!selectionMode) {
                            handleContextMenu(e, msg, isMe)
                          }
                        }}
                        onTouchStart={(e) => {
                          if (!selectionMode) handleTouchStart(e, msg, isMe)
                        }}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchEnd}
                      >
                        {/* Selection checkbox */}
                        {selectionMode && (
                          <div 
                            style={{
                              width: '22px', 
                              height: '22px', 
                              borderRadius: '50%', 
                              border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                              background: isSelected ? 'var(--primary)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                              alignSelf: 'center',
                              transition: 'all 0.15s ease'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSelection(msg.id)
                            }}
                          >
                            {isSelected && <span style={{ color: '#000', fontSize: '12px', lineHeight: 1, fontWeight: 'bold' }}>✓</span>}
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                          <div 
                            style={{ 
                              background: msg.deletedForEveryone ? 'transparent' : msg.isFailed ? 'rgba(239, 68, 68, 0.1)' : isMe ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)', 
                              color: msg.deletedForEveryone ? '#9A958C' : msg.isFailed ? '#ef4444' : isMe ? '#000' : 'var(--text)',
                              padding: '0.75rem 1rem', 
                              borderRadius: '1rem',
                              borderBottomRightRadius: isMe && !showTimestamp ? '1rem' : isMe ? '0.25rem' : '1rem',
                              borderBottomLeftRadius: !isMe && !showTimestamp ? '1rem' : !isMe ? '0.25rem' : '1rem',
                              border: msg.deletedForEveryone ? '1px dashed var(--border)' : msg.isFailed ? '1px solid rgba(239, 68, 68, 0.5)' : 'none',
                              fontStyle: msg.deletedForEveryone ? 'italic' : 'normal',
                              cursor: selectionMode ? 'pointer' : 'default',
                              opacity: selectionMode && !isSelected ? 0.6 : 1,
                              transition: 'opacity 0.15s ease',
                              userSelect: 'text',
                            }}
                            onClick={() => {
                              if (selectionMode) toggleSelection(msg.id)
                            }}
                          >
                            <p style={{ margin: 0, wordBreak: 'break-word', lineHeight: 1.4 }}>
                              {msg.deletedForEveryone ? 'Message unsent' : msg.content}
                            </p>
                          </div>
                          
                          {(showTimestamp || (msg.editedAt && !msg.deletedForEveryone) || msg.isFailed) && (
                            <span className="muted" style={{ fontSize: '0.7rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: msg.isFailed ? '#ef4444' : '#9A958C' }}>
                              {msg.isFailed ? 'Failed to send' : (showTimestamp && formatAppTime(msg.timestamp))}
                              {msg.editedAt && !msg.deletedForEveryone && !msg.isFailed && <span>(edited)</span>}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-sunken)' }}>
                {editingMessageId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0.5rem', background: 'var(--surface)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                      <Edit2 size={14} />
                      <span style={{ fontSize: '0.85rem' }}>Editing message</span>
                    </div>
                    <button className="icon-button" type="button" style={{ padding: '0.25rem' }} onClick={() => { setEditingMessageId(null); setEditDraft('') }}>
                      <X size={16} />
                    </button>
                  </div>
                )}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend() }}
                  style={{ display: 'flex', gap: '0.5rem' }}
                >
                  <input
                    type="text"
                    value={editingMessageId ? editDraft : draft}
                    onChange={(e) => editingMessageId ? setEditDraft(e.target.value) : setDraft(e.target.value)}
                    placeholder={isBlocked ? "Unblock to send messages..." : "Type a message..."}
                    disabled={!!isBlocked}
                    style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '2rem', color: 'var(--text)', opacity: isBlocked ? 0.5 : 1 }}
                  />
                  <button 
                    type="submit" 
                    disabled={isBlocked || (editingMessageId ? !editDraft.trim() : !draft.trim())}
                    className="icon-button"
                    style={{ background: 'var(--primary)', color: '#000', borderRadius: '50%', width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9A958C' }}>
              <MessageSquare size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

      </div>
      
      {/* Right-click context menu — fixed position, high z-index, opaque dark background */}
      {contextMenu && createPortal(
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 99999,
            background: '#1e1e2e',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.5rem',
            padding: '0.3rem',
            width: '200px',
            boxShadow: '0 10px 40px rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {/* Copy (if message has content) */}
          {!contextMenu.deletedForEveryone && (
            <MenuItem
              icon={<Copy size={16} />}
              label="Copy"
              onClick={() => {
                navigator.clipboard.writeText(contextMenu.content)
                setContextMenu(null)
              }}
            />
          )}

          {/* Edit — only for my own non-deleted messages */}
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

          {/* Unsend — only for my own non-deleted messages */}
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

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0' }} />

          {/* Delete for me — available to everyone */}
          <MenuItem
            icon={<Trash2 size={16} />}
            label="Delete for me"
            onClick={() => {
              onDeleteForMe?.(contextMenu.msgId)
              setContextMenu(null)
            }}
          />

          {/* Select message */}
          <MenuItem
            icon={<CheckSquare size={16} />}
            label="Select message"
            onClick={() => {
              setSelectionMode(true)
              setSelectedMessageIds(new Set([contextMenu.msgId]))
              setContextMenu(null)
            }}
          />
        </div>,
        document.body
      )}

      {/* Clear Chat Confirmation Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear this chat?"
        message="This will remove the messages from your view."
        confirmLabel="Clear Chat"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (activeFriendId && onClearChat) {
            onClearChat(activeFriendId)
          }
          setShowClearConfirm(false)
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  )
}

