import { AdminGodMode } from './AdminGodMode';
﻿import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search, Ban, PauseCircle, ShieldAlert, Shield, ShieldCheck } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { BanUserModal } from './BanUserModal';
import { SuspendUserModal } from './SuspendUserModal';
import { useToasts } from '../../../hooks/useToasts';
import { formatAppDateTime } from '../../../lib/dateFormatting';

export function AdminUsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { push } = useToasts();
  const [banState, setBanState] = useState<any | null>(null);
  const [suspendState, setSuspendState] = useState<any | null>(null);
  const [confirmState, setConfirmState] = useState<{ userId: string, action: 'BANNED' | 'SUSPENDED' | 'ACTIVE' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    // Join user_identities and profiles
    const { data, error } = await supabase.rpc('admin_get_users');
    
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const executeAction = async () => {
    if (isProcessing) return; // Prevent double clicks
    if (!confirmState) return;
    
    console.log('[REVOKE] START');
    const { userId, action } = confirmState;
    console.log('[REVOKE] TARGET USER:', userId);
    console.log('[REVOKE] NEW STATUS:', action);
    
    setIsProcessing(true);
    let success = false;
    
    try {
      console.log('[REVOKE] CALLING BACKEND (admin_set_user_status)');
      const { data, error } = await supabase.rpc('admin_set_user_status', {
        target_user_id: userId,
        new_status: action,
        reason: 'Admin action from console'
      });
      
      console.log('[REVOKE] BACKEND RESPONSE:', { data, error });

      if (error) {
        console.error('[REVOKE] BACKEND ERROR:', error);
        push(`Error: ${error.message}`);
      } else {
        console.log('[REVOKE] DATABASE UPDATE APPARENTLY SUCCESSFUL, VERIFYING...');
        
        // VERIFY: Fetch user identity directly
        const { data: verifyData, error: verifyError } = await supabase.from('user_identities').select('status, banned_at, ban_expires_at, suspended_until').eq('user_id', userId).single();
        console.log('[REVOKE] VERIFICATION RESULT:', { verifyData, verifyError });
        
        if (verifyData?.status === 'ACTIVE' && !verifyData?.banned_at && !verifyData?.suspended_until) {
          console.log('[REVOKE] VERIFIED ACTIVE.');
          push('User status updated successfully');
          success = true;
          loadUsers();
        } else {
          console.error('[REVOKE] VERIFICATION FAILED! RESTRICTION STILL ACTIVE.', verifyData);
          push('Failed to verify status update. DB restriction may still be active.');
        }
      }
    } catch (err: any) {
      console.error('[REVOKE] UNEXPECTED EXCEPTION:', err);
      push(`Unexpected Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      console.log('[REVOKE] FINAL CLEANUP COMPLETE');
      if (success) {
        setConfirmState(null);
      }
    }
  };

  
  const executeBan = async (durationHours: number | null, reason: string) => {
    if (isProcessing) return;
    if (!banState) return;
    setIsProcessing(true);
    let success = false;
    const { user_id: userId } = banState;
    
    let expiresAt = null;
    if (durationHours !== null) {
      const d = new Date();
      d.setHours(d.getHours() + durationHours);
      expiresAt = d.toISOString();
    }
    
    try {
      const { error } = await supabase.rpc('admin_set_user_status', {
        target_user_id: userId,
        new_status: 'BANNED',
        reason: reason || 'Admin action from console',
        p_ban_expires_at: expiresAt
      });

      if (error) {
        push(`Error: ${error.message}`);
      } else {
        push('User has been banned');
        success = true;
        loadUsers();
      }
    } catch (err: any) {
      push(`Unexpected Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      if (success) {
        setBanState(null);
      }
    }
  };

  
  const executeSuspend = async (durationHours: number, reason: string) => {
    if (!suspendState) return;
    setIsProcessing(true);
    const { user_id: userId } = suspendState;
    
    const d = new Date();
    d.setHours(d.getHours() + durationHours);
    const expiresAt = d.toISOString();
    
    const { error } = await supabase.rpc('admin_set_user_status', {
      target_user_id: userId,
      new_status: 'SUSPENDED',
      reason: reason || 'Admin action from console',
      p_ban_expires_at: expiresAt
    });

    if (error) {
      push(`Error: ${error.message}`);
    } else {
      push('User has been suspended');
      loadUsers();
    }
    setIsProcessing(false);
    setSuspendState(null);
  };

  const handleActionClick = (userId: string, action: 'ACTIVE') => {
    setConfirmState({ userId, action });
  };

  const filtered = users.filter(u => 
    u.login_id?.toLowerCase().includes(search.toLowerCase()) || 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {selectedUserId && (
        <AdminGodMode 
          user={users.find(u => u.user_id === selectedUserId)} 
          onBack={() => setSelectedUserId(null)} 
        />
      )}

      
      
      <SuspendUserModal
        isOpen={suspendState !== null}
        targetUser={suspendState}
        onClose={() => !isProcessing && setSuspendState(null)}
        onConfirm={executeSuspend}
        isProcessing={isProcessing}
      />
      <BanUserModal
        isOpen={banState !== null}
        targetUser={banState}
        onClose={() => !isProcessing && setBanState(null)}
        onConfirm={executeBan}
        isProcessing={isProcessing}
      />
      <ConfirmDialog
        isOpen={confirmState !== null}
        title={confirmState?.action === 'ACTIVE' ? "Restore User" : "Suspend User"}
        message={confirmState?.action === 'ACTIVE' ? "Are you sure you want to restore this user's access to ARINOVA?" : "Are you sure you want to temporarily suspend this user?"}
        subMessage={confirmState?.action === 'ACTIVE' ? '' : "This action will be logged in the admin audit trail."}
        confirmLabel={isProcessing ? (users.find(u => u.user_id === confirmState?.userId)?.status === 'BANNED' ? 'Unbanning...' : 'Restoring...') : 'Confirm'}
        cancelLabel="Cancel"
        onConfirm={executeAction}
        onCancel={() => { if (!isProcessing) setConfirmState(null) }}
        isProcessing={isProcessing}
      />
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>User Management</h2>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by ID or Username"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Login ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>User Info</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Joined</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</td></tr>
            ) : filtered.map(u => (
              <tr key={u.user_id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.login_id}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{u.display_name || u.username}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: u.role.includes('admin') ? 'rgba(245,158,11,0.1)' : 'var(--bg-surface)',
                    color: u.role.includes('admin') ? '#f59e0b' : 'var(--text-main)',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: u.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: u.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {formatAppDateTime(u.created_at)}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                      className="secondary-btn" 
                      title="Manage User Data"
                      onClick={() => setSelectedUserId(u.user_id)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        borderRadius: '8px',
                        color: 'var(--text-main)', 
                        background: 'rgba(150, 140, 200, 0.1)',
                        border: '1px solid rgba(150, 140, 200, 0.2)'
                      }}
                    >
                      <Shield size={16} /> Manage
                    </button>
                    
                    {u.status === 'SUSPENDED' ? (
                      <button 
                        className="secondary-btn" 
                        title="Restore User"
                        disabled={u.role.includes('admin')}
                        onClick={() => handleActionClick(u.user_id, 'ACTIVE')}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', cursor: u.role.includes('admin') ? 'not-allowed' : 'pointer' }}
                      >
                        <ShieldCheck size={18} />
                      </button>
                    ) : (
                      <button 
                        className="secondary-btn" 
                        title="Temporarily restrict this account"
                        disabled={u.role.includes('admin') || u.status === 'BANNED'}
                        onClick={() => setSuspendState(u)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', cursor: (u.role.includes('admin') || u.status === 'BANNED') ? 'not-allowed' : 'pointer' }}
                      >
                        <PauseCircle size={18} />
                      </button>
                    )}

                    {u.status === 'BANNED' ? (
                      <button 
                        className="secondary-btn" 
                        title="Unban User"
                        disabled={u.role.includes('admin')}
                        onClick={() => handleActionClick(u.user_id, 'ACTIVE')}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', cursor: u.role.includes('admin') ? 'not-allowed' : 'pointer' }}
                      >
                        <ShieldCheck size={18} />
                      </button>
                    ) : (
                      <button 
                        className="secondary-btn" 
                        title="Block this account for a serious violation"
                        disabled={u.role.includes('admin')}
                        onClick={() => setBanState(u)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', cursor: u.role.includes('admin') ? 'not-allowed' : 'pointer' }}
                      >
                        <Ban size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}