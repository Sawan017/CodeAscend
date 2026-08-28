// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export type ChatGroup = {
  id: string
  name: string
  description?: string
  avatar?: string
  created_by: string
  created_at: string
}

export type ChatGroupMember = {
  group_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
}

export type ChatGroupMessage = {
  id: string
  group_id: string
  sender_id: string
  content: string
  created_at: string
  deleted_for_everyone: boolean
  edited_at?: string
}

export function useGroupChat(userId: string | undefined) {
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [groupMembers, setGroupMembers] = useState<Record<string, ChatGroupMember[]>>({})
  const [groupMessages, setGroupMessages] = useState<Record<string, ChatGroupMessage[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !supabase) return

    let mounted = true
    
    const fetchGroups = async () => {
      // 1. Fetch groups I belong to
      const { data: memberGroups, error: memErr } = await supabase
        .from('chat_group_members')
        .select('group_id')
        .eq('user_id', userId)
        
      if (memErr || !memberGroups || memberGroups.length === 0) {
        if (mounted) { setGroups([]); setLoading(false); }
        return
      }

      const groupIds = memberGroups.map(mg => mg.group_id)

      const { data: myGroups, error: gErr } = await supabase
        .from('chat_groups')
        .select('*')
        .in('id', groupIds)
        
      if (myGroups && mounted) {
        setGroups(myGroups as ChatGroup[])
      }

      // 2. Fetch all members for these groups
      const { data: allMembers, error: membersErr } = await supabase
        .from('chat_group_members')
        .select('*')
        .in('group_id', groupIds)

      if (allMembers && mounted) {
        const membersMap: Record<string, ChatGroupMember[]> = {}
        allMembers.forEach(m => {
          if (!membersMap[m.group_id]) membersMap[m.group_id] = []
          membersMap[m.group_id].push(m as ChatGroupMember)
        })
        setGroupMembers(membersMap)
      }

      // 3. Fetch recent messages
      const { data: recentMsgs, error: msgErr } = await supabase
        .from('chat_group_messages')
        .select('*')
        .in('group_id', groupIds)
        .order('created_at', { ascending: false })
        .limit(200)

      if (recentMsgs && mounted) {
        const msgMap: Record<string, ChatGroupMessage[]> = {}
        recentMsgs.reverse().forEach(m => {
          if (!msgMap[m.group_id]) msgMap[m.group_id] = []
          msgMap[m.group_id].push(m as ChatGroupMessage)
        })
        setGroupMessages(msgMap)
      }

      if (mounted) setLoading(false)
    }

    fetchGroups()

    // Subscribe to ALL groups, members, messages changes
    // Because of RLS, we only receive changes we are allowed to see
    const channel = supabase.channel('group-chat')
      
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_group_messages' }, payload => {
        if (!mounted) return
        if (payload.eventType === 'INSERT') {
          setGroupMessages(prev => {
            const gid = payload.new.group_id
            const existing = prev[gid] || []
            return { ...prev, [gid]: [...existing, payload.new as ChatGroupMessage] }
          })
        } else if (payload.eventType === 'UPDATE') {
          setGroupMessages(prev => {
            const gid = payload.new.group_id
            const existing = prev[gid] || []
            return { ...prev, [gid]: existing.map(m => m.id === payload.new.id ? payload.new as ChatGroupMessage : m) }
          })
        } else if (payload.eventType === 'DELETE') {
          setGroupMessages(prev => {
            const oldId = payload.old.id
            const nextMap = { ...prev }
            for (const gid in nextMap) {
               nextMap[gid] = nextMap[gid].filter(m => m.id !== oldId)
            }
            return nextMap
          })
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_group_members' }, payload => {
        if (!mounted) return
        fetchGroups() // Reload fully to be safe on membership changes
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_groups' }, payload => {
        if (!mounted) return
        fetchGroups() // Reload
      })
      .subscribe()

    return () => {
      mounted = false
      supabase?.removeChannel(channel)
    }
  }, [userId])

  const createGroup = async (name: string, description?: string, avatar?: string, memberIds: string[] = []): Promise<ChatGroup | null> => {
    if (!supabase) return null
    
    // Call the atomic RPC to create the group, which handles the creator's membership,
    // the optional additional members, and properly validates auth.uid()
    const { data: groupData, error: rpcErr } = await supabase
      .rpc('create_chat_group', {
        p_name: name,
        p_description: description || null,
        p_avatar: avatar || null,
        p_members: memberIds
      })

    if (rpcErr) {
      console.error("Create group RPC error:", rpcErr)
      throw new Error(rpcErr.message || 'Failed to create group')
    }

    if (!groupData) {
      throw new Error('Failed to retrieve created group data')
    }

    return groupData as ChatGroup
  }

  const sendGroupMessage = async (groupId: string, content: string) => {
    if (!supabase) return
    const { error } = await supabase.from('chat_group_messages').insert({
      group_id: groupId,
      sender_id: userId,
      content
    })
    if (error) {
      console.error("sendGroupMessage error:", error)
      throw new Error(error.message)
    }
  }

  const updateGroup = async (groupId: string, updates: Partial<ChatGroup>) => {
    if (!supabase) return
    await supabase.from('chat_groups').update(updates).eq('id', groupId)
  }

  const addMembers = async (groupId: string, userIds: string[]) => {
    if (!supabase) return
    const inserts = userIds.map(uid => ({ group_id: groupId, user_id: uid, role: 'member' }))
    await supabase.from('chat_group_members').insert(inserts)
  }

  const removeMember = async (groupId: string, targetUserId: string) => {
    if (!supabase) return
    await supabase.from('chat_group_members').delete().eq('group_id', groupId).eq('user_id', targetUserId)
  }

  const updateMemberRole = async (groupId: string, targetUserId: string, role: 'owner' | 'admin' | 'member') => {
    if (!supabase) return
    const { error } = await supabase.rpc('update_group_member_role', {
      p_group_id: groupId,
      p_target_user_id: targetUserId,
      p_new_role: role
    })
    if (error) {
      console.error('Failed to update role:', error)
      throw error
    }
  }

  const deleteGroup = async (groupId: string) => {
    if (!supabase) return
    await supabase.from('chat_groups').delete().eq('id', groupId)
  }

  const editGroupMessage = async (messageId: string, newContent: string) => {
    if (!supabase) return
    await supabase.from('chat_group_messages')
      .update({ content: newContent, edited_at: new Date().toISOString() })
      .eq('id', messageId)
  }

  const deleteGroupMessageForEveryone = async (messageId: string) => {
    if (!supabase) return
    await supabase.from('chat_group_messages')
      .update({ deleted_for_everyone: true, content: '' }) // Optionally blank the content
      .eq('id', messageId)
  }

  return {
    groups,
    groupMembers,
    groupMessages,
    loading,
    createGroup,
    sendGroupMessage,
    updateGroup,
    addMembers,
    removeMember,
    updateMemberRole,
    deleteGroup,
    editGroupMessage,
    deleteGroupMessageForEveryone
  }
}
