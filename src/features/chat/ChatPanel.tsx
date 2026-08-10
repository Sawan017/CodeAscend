import { motion } from 'framer-motion'
import { User, Send, ChevronLeft, MessageSquare } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { ChatMessage, FriendRelationship } from '../../types'
import { fetchPublicProfiles } from '../../lib/api'

type PublicUser = {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
}

type ChatPanelProps = {
  activeUserId: string
  chatState: { messages: ChatMessage[]; lastRead: Record<string, string> }
  friendState: { relationships: FriendRelationship[] }
  incomingMessages: ChatMessage[]
  onSendMessage: (receiverId: string, content: string) => void
  onMarkRead: (friendId: string, timestamp: string) => void
  onOpenProfile: (userId: string) => void
  activeFriendId: string | null
  onSetActiveFriendId: (userId: string | null) => void
}

export function ChatPanel({ activeUserId, chatState, friendState, incomingMessages, onSendMessage, onMarkRead, onOpenProfile, activeFriendId, onSetActiveFriendId }: ChatPanelProps) {
  const [publicProfiles, setPublicProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const profiles = await fetchPublicProfiles()
      if (!mounted) return
      setPublicProfiles(profiles)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatState.messages, incomingMessages, activeFriendId])

  // Merge sent messages and incoming messages
  const allMessages = [...chatState.messages, ...incomingMessages]
  allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Get accepted friends
  const acceptedIds = friendState.relationships.filter(r => r.status === 'accepted').map(r => r.userId)
  const friends = publicProfiles.filter(p => acceptedIds.includes(p.userId))

  const activeFriend = friends.find(f => f.userId === activeFriendId)
  
  // Conversations list data
  const conversations = friends.map(friend => {
    const friendMsgs = allMessages.filter(m => m.senderId === friend.userId || m.receiverId === friend.userId)
    const lastMsg = friendMsgs.length > 0 ? friendMsgs[friendMsgs.length - 1] : null
    
    // Calculate unread count
    const lastReadTime = chatState.lastRead[friend.userId] || '1970-01-01T00:00:00.000Z'
    const unreadCount = incomingMessages.filter(m => m.senderId === friend.userId && new Date(m.timestamp) > new Date(lastReadTime)).length

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
        const currentLastRead = chatState.lastRead[activeFriendId] || '1970-01-01T00:00:00.000Z'
        if (new Date(latest) > new Date(currentLastRead)) {
          onMarkRead(activeFriendId, latest)
        }
      }
    }
  }, [activeFriendId, incomingMessages, chatState.lastRead, onMarkRead])

  const handleSend = () => {
    if (!draft.trim() || !activeFriendId) return
    onSendMessage(activeFriendId, draft.trim())
    setDraft('')
  }

  const activeConversationMsgs = allMessages.filter(m => m.senderId === activeFriendId || m.receiverId === activeFriendId)

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
    <div className="section-shell" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="card-heading" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow">MESSAGES</p>
        <h2 style={{ margin: 0 }}>Direct Messages</h2>
      </div>

      <div className="panel" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden', minHeight: 0 }}>
        
        {/* Sidebar / Conversation List */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border)', display: activeFriendId ? 'none' : 'flex', flexDirection: 'column', background: 'var(--surface-sunken)' }} className="chat-sidebar">
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
                  <div className="avatar-badge" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                    {conv.friend.avatar ? <img src={conv.friend.avatar} alt={conv.friend.displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={24} />}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid var(--surface-sunken)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }}>{conv.friend.displayName}</h4>
                      {conv.lastMsg && <span className="muted" style={{ fontSize: '0.75rem' }}>
                        {new Date(conv.lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                      <p className="muted" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                        {conv.lastMsg ? (conv.lastMsg.senderId === activeUserId ? `You: ${conv.lastMsg.content}` : conv.lastMsg.content) : 'Say hi!'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span style={{ background: 'var(--primary)', color: '#000', borderRadius: '12px', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1, display: activeFriendId ? 'flex' : 'none', flexDirection: 'column', background: 'var(--surface)' }} className="chat-window">
          {activeFriend ? (
            <>
              {/* Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-sunken)' }}>
                <button className="icon-button mobile-only" onClick={() => onSetActiveFriendId(null)} style={{ marginRight: '-0.5rem' }}>
                  <ChevronLeft size={20} />
                </button>
                <div 
                  className="avatar-badge" 
                  style={{ width: '40px', height: '40px', flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => onOpenProfile(activeFriend.userId)}
                >
                  {activeFriend.avatar ? <img src={activeFriend.avatar} alt={activeFriend.displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 
                    style={{ margin: 0, cursor: 'pointer' }}
                    onClick={() => onOpenProfile(activeFriend.userId)}
                  >{activeFriend.displayName}</h4>
                  <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>@{activeFriend.username}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeConversationMsgs.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                    <p>No messages yet.</p>
                    <p style={{ fontSize: '0.85rem' }}>Start the conversation with {activeFriend.displayName}!</p>
                  </div>
                ) : (
                  activeConversationMsgs.map((msg, i) => {
                    const isMe = msg.senderId === activeUserId
                    const showAvatar = !isMe && (i === activeConversationMsgs.length - 1 || activeConversationMsgs[i + 1].senderId !== msg.senderId)
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
                          alignItems: 'flex-end'
                        }}
                      >
                        {!isMe && (
                          <div style={{ width: '28px', flexShrink: 0 }}>
                            {showAvatar && (
                              <div className="avatar-badge" style={{ width: '28px', height: '28px' }} onClick={() => onOpenProfile(msg.senderId)}>
                                {activeFriend.avatar ? <img src={activeFriend.avatar} style={{ borderRadius: '50%' }} /> : <User size={14} />}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{ 
                            background: isMe ? 'var(--primary)' : 'var(--surface-sunken)', 
                            color: isMe ? '#000' : 'var(--text)',
                            padding: '0.75rem 1rem', 
                            borderRadius: '1rem',
                            borderBottomRightRadius: isMe ? '0.25rem' : '1rem',
                            borderBottomLeftRadius: !isMe ? '0.25rem' : '1rem',
                          }}>
                            <p style={{ margin: 0, wordBreak: 'break-word', lineHeight: 1.4 }}>{msg.content}</p>
                          </div>
                          <span className="muted" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-sunken)' }}>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend() }}
                  style={{ display: 'flex', gap: '0.5rem' }}
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '2rem', color: 'var(--text)' }}
                  />
                  <button 
                    type="submit" 
                    disabled={!draft.trim()}
                    className="primary-btn" 
                    style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
              <p>Select a conversation</p>
            </div>
          )}
        </div>

        {/* Desktop Empty State (when no chat is selected) */}
        {!activeFriendId && (
          <div className="desktop-only" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', color: 'var(--text-muted)' }}>
            <MessageSquare size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <h3>Your Messages</h3>
            <p>Select a friend from the sidebar to start chatting.</p>
          </div>
        )}

      </div>
    </div>
  )
}
