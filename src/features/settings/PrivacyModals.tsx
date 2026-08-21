import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Shield, UserX } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function PrivacyModals({ 
  chatState,
  onChatStateChange,
  isPasswordOpen,
  setIsPasswordOpen,
  isSessionsOpen,
  setIsSessionsOpen,
  isBlockedOpen,
  setIsBlockedOpen
}: any) {

  // ---- PASSWORD MODAL ----
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    if (!supabase) return
    if (!oldPassword || !newPassword || !confirmPassword) return setPasswordError('All fields required.')
    if (newPassword !== confirmPassword) return setPasswordError('New passwords do not match.')
    if (newPassword.length < 6) return setPasswordError('Password must be at least 6 characters.')

    setPasswordLoading(true)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!user?.email) {
      setPasswordError('Cannot verify user email.')
      setPasswordLoading(false)
      return
    }
    
    // Verify old password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword
    })
    
    if (signInError) {
      setPasswordError('Incorrect old password.')
      setPasswordLoading(false)
      return
    }
    
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    
    setPasswordLoading(false)
    if (updateError) {
      setPasswordError(updateError.message)
    } else {
      setPasswordSuccess(true)
      setTimeout(() => {
        setIsPasswordOpen(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordSuccess(false)
      }, 2000)
    }
  }

  // ---- SESSIONS MODAL ----
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  
  useEffect(() => {
    if (isSessionsOpen) {
      loadSessions()
    }
  }, [isSessionsOpen])

  const loadSessions = async () => {
    setSessionsLoading(true)
    if (!supabase) return
    const { data } = await supabase.rpc('get_my_sessions')
    if (data) setSessions(data)
    setSessionsLoading(false)
  }

  const handleRevokeSession = async (sessionId: string) => {
    if (!supabase) return;
    const { error } = await supabase.rpc('revoke_my_session', { p_session_id: sessionId })
    if (!error) {
      setSessions(prev => prev.filter(s => s.id !== sessionId))
    }
  }

  // ---- BLOCKED MODAL ----
  const [blockedUsers, setBlockedUsers] = useState<any[]>([])
  const [blockedLoading, setBlockedLoading] = useState(false)

  useEffect(() => {
    if (isBlockedOpen) {
      loadBlockedUsers()
    }
  }, [isBlockedOpen, chatState?.blockedUsers])

  const loadBlockedUsers = async () => {
    if (!supabase) return;
    const blockedIds = chatState?.blockedUsers || []
    if (blockedIds.length === 0) {
      setBlockedUsers([])
      return
    }
    setBlockedLoading(true)
    const { data } = await supabase.from('profiles').select('user_id, data').in('user_id', blockedIds)
    if (data) {
      setBlockedUsers(data.map(d => ({
        id: d.user_id,
        displayName: d.data?.displayName || 'Unknown User',
        avatarUrl: d.data?.avatarUrl
      })))
    }
    setBlockedLoading(false)
  }

  const handleUnblock = async (targetId: string) => {
    if (!supabase) return;
    const currentBlocked = chatState?.blockedUsers || []
    const updated = currentBlocked.filter((id: string) => id !== targetId)
    
    const newChat = { ...(chatState || {}), blockedUsers: updated }
    
    // Optimistic update
    onChatStateChange(newChat)
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ data: newChat }).eq('user_id', user.id).eq('key', 'chat');
  }

  const modalStyle = {
    position: 'fixed' as const, inset: 0, zIndex: 1000, 
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }

  const boxStyle = {
    background: 'var(--bg-base)', border: '1px solid var(--border)', 
    borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative' as const,
    maxHeight: '90vh', display: 'flex', flexDirection: 'column' as const
  }

  const closeBtn = (onClose: () => void) => (
    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
      <X size={20} />
    </button>
  )

  const inputStyle = { width: '100%', padding: '0.75rem', background: 'var(--bg-surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: '#fff', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box' as const }
  const btnStyle = { width: '100%', padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }

  return (
    <AnimatePresence>
      {isPasswordOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalStyle}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={boxStyle} onClick={e => e.stopPropagation()}>
            {closeBtn(() => setIsPasswordOpen(false))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Lock size={24} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Change Password</h3>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Password</label>
              <input type="password" style={inputStyle} value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>New Password</label>
              <input type="password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
              
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Confirm New Password</label>
              <input type="password" style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
              
              {passwordError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 0 }}>{passwordError}</p>}
              {passwordSuccess && <p style={{ color: 'var(--green)', fontSize: '0.85rem', marginTop: 0 }}>Password updated successfully.</p>}
              
              <button type="submit" style={{...btnStyle, opacity: passwordLoading ? 0.7 : 1}} disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {isSessionsOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalStyle}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{...boxStyle, maxWidth: '500px'}} onClick={e => e.stopPropagation()}>
            {closeBtn(() => setIsSessionsOpen(false))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Shield size={24} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Active Sessions</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {sessionsLoading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No other active sessions found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sessions.map(s => {
                    // Current session check (naive by timestamp or actual check if we had session id, but we don't have current session id easily. Let's just list them)
                    // Supabase js auth.getSession() has the current session.
                    return (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div>
                          <p style={{ margin: '0 0 0.25rem', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                            {s.user_agent ? s.user_agent.substring(0, 40) + '...' : 'Unknown Device'}
                          </p>
                          <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                            IP: {s.ip || 'Unknown'} • Last active: {new Date(s.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleRevokeSession(s.id)}
                          style={{ padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Revoke
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {isBlockedOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalStyle}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{...boxStyle, maxWidth: '500px'}} onClick={e => e.stopPropagation()}>
            {closeBtn(() => setIsBlockedOpen(false))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <UserX size={24} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Blocked Users</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {blockedLoading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading blocked users...</p>
              ) : blockedUsers.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>You haven't blocked any users.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blockedUsers.map(u => (
                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-sunken)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{u.displayName.charAt(0)}</div>
                        )}
                        <span style={{ color: '#fff', fontSize: '0.95rem' }}>{u.displayName}</span>
                      </div>
                      <button 
                        onClick={() => handleUnblock(u.id)}
                        style={{ padding: '0.4rem 0.75rem', background: 'var(--bg-base)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
