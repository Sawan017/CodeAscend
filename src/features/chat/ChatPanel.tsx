// @ts-nocheck
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DirectChatPanel } from './DirectChatPanel'
import { GroupChatWindow } from './GroupChatWindow'
import { CreateGroupModal } from './CreateGroupModal'
import { useGroupChat } from '../../hooks/useGroupChat'
import { Avatar } from '../../components/Avatar'
import type { ChatMessage, FriendRelationship, ChatState } from '../../types'

type ChatPanelProps = {
  activeUserId: string
  chatState: ChatState
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

export function ChatPanel(props: ChatPanelProps) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct')

  const {
    groups,
    groupMembers,
    groupMessages,
    createGroup,
    sendGroupMessage,
    updateGroup,
    addMembers,
    removeMember,
    updateMemberRole,
    deleteGroup,
    editGroupMessage,
    deleteGroupMessageForEveryone
  } = useGroupChat(props.activeUserId)

  // Switch tabs handler
  const handleTabSwitch = (tab: 'direct' | 'groups') => {
    setActiveTab(tab)
    if (tab === 'direct') {
      setActiveGroupId(null)
    } else {
      props.onSetActiveFriendId(null)
    }
  }

  const handleSetFriendId = (id: string | null) => {
    props.onSetActiveFriendId(id)
    if (id) {
      setActiveGroupId(null)
      setActiveTab('direct')
    }
  }

  const isGroupActive = !!activeGroupId

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, height: 'calc(100vh - 140px)' }}>
      {/* Header Tabs */}
      <div style={{ display: 'flex', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', gap: '1rem', background: 'var(--surface)' }}>
        <button 
          onClick={() => handleTabSwitch('direct')}
          style={{ background: activeTab === 'direct' ? 'var(--cyan)' : 'transparent', color: activeTab === 'direct' ? '#000' : 'var(--text)', border: '1px solid ' + (activeTab === 'direct' ? 'var(--cyan)' : 'var(--border)'), padding: '8px 16px', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Direct Messages
        </button>
        <button 
          onClick={() => handleTabSwitch('groups')}
          style={{ background: activeTab === 'groups' ? 'var(--cyan)' : 'transparent', color: activeTab === 'groups' ? '#000' : 'var(--text)', border: '1px solid ' + (activeTab === 'groups' ? 'var(--cyan)' : 'var(--border)'), padding: '8px 16px', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Groups
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'direct' ? (
           <DirectChatPanel {...props} onSetActiveFriendId={handleSetFriendId} />
        ) : (
          <>
            {/* Group Sidebar */}
            <div className={'chat-sidebar ' + (isGroupActive ? 'mobile-hidden' : '')} style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface-sunken)', flexShrink: 0 }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Groups</h4>
                <button onClick={() => setCreateModalOpen(true)} className="icon-button" style={{ background: 'var(--cyan)', color: '#000', padding: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {groups.length === 0 ? (
                  <p className="muted" style={{ padding: '1.5rem', textAlign: 'center' }}>You are not in any groups yet.</p>
                ) : (
                  groups.map(g => {
                    const lastMsg = groupMessages[g.id] && groupMessages[g.id].length > 0 ? groupMessages[g.id][groupMessages[g.id].length - 1] : null;
                    return (
                      <div 
                        key={g.id}
                        onClick={() => setActiveGroupId(g.id)}
                        style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: activeGroupId === g.id ? 'var(--surface)' : 'transparent', borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                      >
                        <Avatar src={g.avatar}  size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }}>{g.name}</h4>
                          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lastMsg ? lastMsg.content : 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Group Main Content */}
            <div className={'chat-main ' + (!isGroupActive ? 'mobile-hidden' : '')} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
              {activeGroupId ? (() => {
                const hiddenMsgs = props.chatState.hiddenMessages || []
                const clearedAt = props.chatState.clearedChats?.[activeGroupId] || '1970-01-01T00:00:00.000Z'
                const clearedTime = new Date(clearedAt).getTime()
                const filteredMessages = (groupMessages[activeGroupId] || []).filter(m => !hiddenMsgs.includes(m.id) && new Date(m.created_at).getTime() > clearedTime)
                return (
                  <GroupChatWindow 
                    activeUserId={props.activeUserId}
                    group={groups.find(g => g.id === activeGroupId)!}
                    members={groupMembers[activeGroupId] || []}
                    messages={filteredMessages}
                    onSendMessage={sendGroupMessage}
                    onClose={() => setActiveGroupId(null)}
                    onRemoveMember={uid => removeMember(activeGroupId, uid)}
                    onUpdateRole={(uid, role) => updateMemberRole(activeGroupId, uid, role)}
                    onLeaveGroup={() => { removeMember(activeGroupId, props.activeUserId); setActiveGroupId(null); }}
                    onDeleteGroup={() => { deleteGroup(activeGroupId); setActiveGroupId(null); }}
                    onUpdateGroup={(updates) => updateGroup(activeGroupId, updates)}
                    onEditMessage={editGroupMessage}
                    onDeleteForMe={props.onDeleteForMe}
                    onDeleteForEveryone={deleteGroupMessageForEveryone}
                    isMuted={(props.chatState.mutedUsers || []).includes(activeGroupId)}
                    onToggleMute={() => props.onToggleMute?.(activeGroupId)}
                    onClearChat={() => props.onClearChat?.(activeGroupId)}
                  />
                )
              })() : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <p>Select a group to start chatting</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {createModalOpen && (
        <CreateGroupModal 
          activeUserId={props.activeUserId}
          onClose={() => setCreateModalOpen(false)}
          onCreate={async (name, desc, avatar, members) => {
            try {
              const group = await createGroup(name, desc, avatar, members)
              setCreateModalOpen(false)
              if (group) {
                 setActiveGroupId(group.id)
                 setActiveTab('groups')
              }
            } catch (err: any) {
              console.error('Group creation failed:', err)
              alert('Failed to create group: ' + (err.message || 'Unknown error'))
            }
          }}
        />
      )}
    </div>
  )
}
