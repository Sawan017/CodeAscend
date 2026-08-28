import { motion } from 'framer-motion'
import { Check, X, MessageSquare, UserMinus, UserPlus, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import type { FriendRelationship } from '../../types'
import { fetchPublicProfiles, searchDeveloperByLoginId, sendFriendRequest } from '../../lib/api'

type PublicUser = {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  login_id?: string;
  arinova_id?: string;
}

type FriendsPanelProps = {
  friendState: { relationships: FriendRelationship[] }
  incomingRequests: string[]
  onAccept: (userId: string) => void
  onReject: (userId: string) => void
  onRemove: (userId: string) => void
  onOpenProfile: (userId: string) => void
  onMessage: (userId: string) => void
  onlineUsers?: string[]
}

export function FriendsPanel({ friendState, incomingRequests, onAccept, onReject, onRemove, onOpenProfile, onMessage, onlineUsers = [] }: FriendsPanelProps) {
  const [activeTab, setActiveTab] = useState<'connections' | 'find' | 'requests'>('connections')
  const [publicProfiles, setPublicProfiles] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PublicUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const neededIds = [...new Set([...friendState.relationships.map(r => r.userId), ...incomingRequests])]
      const profiles = await fetchPublicProfiles(neededIds)
      if (!mounted) return
      setPublicProfiles(profiles)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [friendState, incomingRequests])

  const acceptedIds = friendState.relationships.filter(r => r.status === 'accepted').map(r => r.userId)
  const pendingOutgoingIds = friendState.relationships.filter(r => r.status === 'pending_outgoing').map(r => r.userId)

  const friends = publicProfiles.filter(p => acceptedIds.includes(p.userId))
  const incoming = publicProfiles.filter(p => incomingRequests.includes(p.userId))
  const outgoing = publicProfiles.filter(p => pendingOutgoingIds.includes(p.userId))

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  }

  const handleSearch = async () => {
    setSearchError(null)
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    const profile = await searchDeveloperByLoginId(searchQuery.trim())
    if (profile) {
      setSearchResults([{
        userId: profile.userId,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
        level: profile.level,
        login_id: profile.login_id
      }])
    } else {
      setSearchResults([])
      setSearchError('No developer found with that ID or username.')
    }
    setIsSearching(false)
  }

  const handleSendRequest = async (targetId: string) => {
    if (acceptedIds.includes(targetId) || pendingOutgoingIds.includes(targetId) || sentRequests.has(targetId)) return;
    try {
      await sendFriendRequest(targetId);
      setSentRequests(prev => new Set(prev).add(targetId));
    } catch (err: any) {
      setSearchError(err.message || 'Failed to send request');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Network Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(140, 135, 125, 0.15)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1E1D1B', margin: '0 0 8px 0' }}>Your Network</h2>
          <p style={{ margin: 0, color: '#5A5750', fontSize: '0.95rem' }}>Connect, collaborate, and build together.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: '#F8FAFC', padding: '6px', borderRadius: '12px', border: '1px solid rgba(140, 135, 125, 0.1)' }}>
          <button 
            onClick={() => setActiveTab('connections')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'connections' ? '#fff' : 'transparent', color: activeTab === 'connections' ? '#8B5CF6' : '#5A5750', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: activeTab === 'connections' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
          >
            Connections ({friends.length})
          </button>
          <button 
            onClick={() => setActiveTab('find')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'find' ? '#fff' : 'transparent', color: activeTab === 'find' ? '#8B5CF6' : '#5A5750', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: activeTab === 'find' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
          >
            Find People
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'requests' ? '#fff' : 'transparent', color: activeTab === 'requests' ? '#8B5CF6' : '#5A5750', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: activeTab === 'requests' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Requests 
            {incoming.length > 0 && (
              <span style={{ background: '#EF4444', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {incoming.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9A958C', fontWeight: 700 }}>Loading network...</div>
      ) : activeTab === 'connections' ? (
        <div>
          {friends.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderRadius: '20px', border: '1px dashed rgba(140, 135, 125, 0.3)', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={32} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: '#1E1D1B', fontWeight: 900 }}>No connections yet</h3>
              <p style={{ margin: '0 0 24px 0', color: '#5A5750', maxWidth: '400px', lineHeight: 1.5 }}>Your network is empty. Search for other developers by their username or ARINOVA ID to start collaborating.</p>
              <button 
                onClick={() => setActiveTab('find')}
                style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
              >
                <Search size={18} /> Find People
              </button>
            </motion.div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {friends.map(friend => (
                <motion.div key={friend.userId} variants={item} style={{ background: '#fff', border: '1px solid rgba(140, 135, 125, 0.15)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => onOpenProfile(friend.userId)}>
                    <Avatar src={friend.avatar} alt={friend.displayName} size={52} isOnline={onlineUsers.includes(friend.userId)} showStatus={true} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 2px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1E1D1B', fontSize: '1.05rem', fontWeight: 800 }} onClick={() => onOpenProfile(friend.userId)}>
                      {friend.displayName}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5A5750', fontWeight: 600 }}>@{friend.login_id || friend.username} ? Lvl {friend.level}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button onClick={() => onMessage(friend.userId)} style={{ background: '#F8FAFC', border: '1px solid rgba(140, 135, 125, 0.1)', color: '#8B5CF6', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Message">
                      <MessageSquare size={16} />
                    </button>
                    <button onClick={() => onRemove(friend.userId)} style={{ background: '#FEF2F2', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#EF4444', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Remove Connection">
                      <UserMinus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      ) : activeTab === 'find' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(140, 135, 125, 0.15)', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1E1D1B', fontWeight: 800 }}>Search Directory</h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9A958C' }}>
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Enter username or ARINOVA ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '12px', border: '1px solid rgba(140, 135, 125, 0.2)', fontSize: '0.95rem', background: '#F8FAFC', outline: 'none', color: '#1E1D1B', fontWeight: 600 }}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              style={{ background: '#1E293B', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '12px', fontWeight: 800, cursor: isSearching ? 'wait' : 'pointer', transition: 'all 0.2s', opacity: (isSearching || !searchQuery.trim()) ? 0.7 : 1 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchError && (
            <div style={{ color: '#EF4444', background: '#FEF2F2', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {searchResults.map(profile => {
                const isFriend = acceptedIds.includes(profile.userId);
                const isPending = pendingOutgoingIds.includes(profile.userId) || sentRequests.has(profile.userId);
                
                return (
                  <div key={profile.userId} style={{ background: '#FAFAFA', border: '1px solid rgba(140, 135, 125, 0.15)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ cursor: 'pointer' }} onClick={() => onOpenProfile(profile.userId)}>
                      <Avatar src={profile.avatar} alt={profile.displayName} size={48} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1E1D1B', fontSize: '1.05rem', fontWeight: 800 }} onClick={() => onOpenProfile(profile.userId)}>
                        {profile.displayName}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#5A5750', fontWeight: 600 }}>@{profile.login_id || profile.username}</p>
                    </div>
                    <div>
                      {isFriend ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3EA354', background: 'rgba(62,163,84,0.1)', padding: '6px 10px', borderRadius: '100px' }}>Connected</span>
                      ) : isPending ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '6px 10px', borderRadius: '100px' }}>Request Sent</span>
                      ) : (
                        <button 
                          onClick={() => handleSendRequest(profile.userId)}
                          style={{ background: '#8B5CF6', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                          title="Connect"
                        >
                          <UserPlus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* Incoming Requests */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(140, 135, 125, 0.15)', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1E1D1B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Incoming Requests
              <span style={{ fontSize: '0.85rem', color: '#5A5750', background: '#F8FAFC', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(140,135,125,0.1)' }}>{incoming.length}</span>
            </h3>
            
            {incoming.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9A958C', background: '#FAFAFA', borderRadius: '12px', border: '1px dashed rgba(140,135,125,0.2)', fontWeight: 600 }}>
                No pending incoming requests.
              </div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {incoming.map(req => (
                  <motion.div key={req.userId} variants={item} style={{ background: '#FAFAFA', border: '1px solid rgba(140, 135, 125, 0.15)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ cursor: 'pointer' }} onClick={() => onOpenProfile(req.userId)}>
                      <Avatar src={req.avatar} alt={req.displayName} size={48} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1E1D1B', fontSize: '1.05rem', fontWeight: 800 }} onClick={() => onOpenProfile(req.userId)}>
                        {req.displayName}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#5A5750', fontWeight: 600 }}>@{req.login_id || req.username} ? Lvl {req.level}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => onAccept(req.userId)} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10B981', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Accept">
                        <Check size={16} />
                      </button>
                      <button onClick={() => onReject(req.userId)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#EF4444', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Decline">
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(140, 135, 125, 0.15)', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1E1D1B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Sent Requests
              <span style={{ fontSize: '0.85rem', color: '#5A5750', background: '#F8FAFC', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(140,135,125,0.1)' }}>{outgoing.length}</span>
            </h3>
            
            {outgoing.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9A958C', background: '#FAFAFA', borderRadius: '12px', border: '1px dashed rgba(140,135,125,0.2)', fontWeight: 600 }}>
                No pending sent requests.
              </div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {outgoing.map(req => (
                  <motion.div key={req.userId} variants={item} style={{ background: '#FAFAFA', border: '1px dashed rgba(140, 135, 125, 0.2)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
                    <div><Avatar src={req.avatar} alt={req.displayName} size={40} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1E1D1B', fontSize: '1rem', fontWeight: 800 }}>{req.displayName}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700 }}>Pending Approval</p>
                    </div>
                    <button onClick={() => onRemove(req.userId)} style={{ background: '#fff', border: '1px solid rgba(140, 135, 125, 0.2)', color: '#5A5750', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                      Withdraw
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
