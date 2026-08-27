// @ts-nocheck
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DirectChatPanel } from './DirectChatPanel'
import { GroupChatWindow } from './GroupChatWindow'
import { CreateGroupModal } from './CreateGroupModal'
import { useGroupChat } from '../../hooks/useGroupChat'
import { Avatar } from '../../components/Avatar'
import type { ChatMessage, FriendRelationship, ChatState } from '../../types'

export function ChatPanel(props: any) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct')

  const {
    groups, groupMembers, groupMessages, createGroup, sendGroupMessage,
    updateGroup, addMembers, removeMember, updateMemberRole, deleteGroup,
    editGroupMessage, deleteGroupMessageForEveryone
  } = useGroupChat(props.activeUserId)

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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, height: 'calc(100vh - 120px)', background: '#fff', borderRadius: '20px', border: '1px solid rgba(140, 135, 125, 0.12)', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      
      {/* Header Tabs */}
      <div style={{ display: 'flex', padding: '16px 24px', borderBottom: '1px solid rgba(140, 135, 125, 0.12)', gap: '16px', background: '#FAFAFA' }}>
        <button 
          onClick={() => handleTabSwitch('direct')}
          style={{ background: activeTab === 'direct' ? '#8B5CF6' : 'transparent', color: activeTab === 'direct' ? '#fff' : '#5A5750', border: '1px solid ' + (activeTab === 'direct' ? '#8B5CF6' : 'rgba(140, 135, 125, 0.2)'), padding: '8px 20px', borderRadius: '100px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab === 'direct' ? '0 4px 12px rgba(139, 92, 246, 0.25)' : 'none' }}
        >
          Direct Messages
        </button>
        <button 
          onClick={() => handleTabSwitch('groups')}
          style={{ background: activeTab === 'groups' ? '#8B5CF6' : 'transparent', color: activeTab === 'groups' ? '#fff' : '#5A5750', border: '1px solid ' + (activeTab === 'groups' ? '#8B5CF6' : 'rgba(140, 135, 125, 0.2)'), padding: '8px 20px', borderRadius: '100px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeTab === 'groups' ? '0 4px 12px rgba(139, 92, 246, 0.25)' : 'none' }}
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
            <div className={'chat-sidebar ' + (isGroupActive ? 'mobile-hidden' : '')} style={{ width: '320px', borderRight: '1px solid rgba(140, 135, 125, 0.12)', display: 'flex', flexDirection: 'column', background: '#FAFAFA', flexShrink: 0 }}>
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(140, 135, 125, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1E1D1B', fontWeight: 800 }}>Groups</h4>
                <button onClick={() => setCreateModalOpen(true)} style={{ background: '#8B5CF6', color: '#fff', padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
                  <Plus size={18} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {groups.length === 0 ? (
                  <p style={{ padding: '32px 24px', textAlign: 'center', color: '#9A958C', fontSize: '0.95rem' }}>You are not in any groups yet.</p>
                ) : (
                  groups.map((g: any) => {
                    const lastMsg = groupMessages[g.id] && groupMessages[g.id].length > 0 ? groupMessages[g.id][groupMessages[g.id].length - 1] : null;
                    return (
                      <div 
                        key={g.id}
                        onClick={() => setActiveGroupId(g.id)}
                        style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', background: activeGroupId === g.id ? '#fff' : 'transparent', borderBottom: '1px solid rgba(140, 135, 125, 0.08)', transition: 'background 0.2s' }}
                      >
                        <Avatar src={g.avatar} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1.05rem', color: '#1E1D1B', fontWeight: 700 }}>{g.name}</h4>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#9A958C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
            <div className={'chat-main ' + (!isGroupActive ? 'mobile-hidden' : '')} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
              {activeGroupId ? (() => {
                const hiddenMsgs = props.chatState.hiddenMessages || []
                const clearedAt = props.chatState.clearedChats?.[activeGroupId] || '1970-01-01T00:00:00.000Z'
                const clearedTime = new Date(clearedAt).getTime()
                const filteredMessages = (groupMessages[activeGroupId] || []).filter((m: any) => !hiddenMsgs.includes(m.id) && new Date(m.created_at).getTime() > clearedTime)
                return (
                  <GroupChatWindow 
                    activeUserId={props.activeUserId}
                    group={groups.find((g: any) => g.id === activeGroupId)!}
                    members={groupMembers[activeGroupId] || []}
                    messages={filteredMessages}
                    onSendMessage={sendGroupMessage}
                    onClose={() => setActiveGroupId(null)}
                    onRemoveMember={(uid: any) => removeMember(activeGroupId, uid)}
                    onUpdateRole={(uid: any, role: any) => updateMemberRole(activeGroupId, uid, role)}
                    onAddMembers={(uids: any) => addMembers(activeGroupId, uids)}
                    onLeaveGroup={() => { removeMember(activeGroupId, props.activeUserId); setActiveGroupId(null); }}
                    onDeleteGroup={() => { deleteGroup(activeGroupId); setActiveGroupId(null); }}
                    onUpdateGroup={(updates: any) => updateGroup(activeGroupId, updates)}
                    onEditMessage={editGroupMessage}
                    onDeleteForMe={props.onDeleteForMe}
                    onDeleteForEveryone={deleteGroupMessageForEveryone}
                    isMuted={(props.chatState.mutedUsers || []).includes(activeGroupId)}
                    onToggleMute={() => props.onToggleMute?.(activeGroupId)}
                    onClearChat={() => props.onClearChat?.(activeGroupId)}
                  />
                )
              })() : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A958C', fontSize: '1.1rem' }}>
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
          onCreate={async (name: string, desc: string, avatar: string, members: any[]) => {
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

