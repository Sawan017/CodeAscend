import React, { useState, useEffect } from 'react';
import { Ban, LogOut, Clock, AlertTriangle, PauseCircle } from 'lucide-react';
import { formatAppDateTime } from '../../lib/dateFormatting';

type BanScreenProps = {
  type: 'BANNED' | 'SUSPENDED';
  reason: string | null;
  expiresAt: string | null;
  isPermanent: boolean;
  onSignOut: () => void;
};

export function BanScreen({ type, reason, expiresAt, isPermanent, onSignOut }: BanScreenProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (isPermanent || !expiresAt) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        window.location.reload(); // Reload to check auto-unban
        return;
      }
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, isPermanent]);

  const isSuspend = type === 'SUSPENDED';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-strong)', padding: '3rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: isSuspend ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isSuspend ? '#f59e0b' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          {isSuspend ? <PauseCircle size={40} /> : <Ban size={40} />}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 1rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          {isSuspend ? 'Account Temporarily Suspended' : 'Account Banned'}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
          {isSuspend 
            ? 'Your access to ARINOVA has been temporarily suspended pending investigation or due to moderate policy violations.' 
            : 'Your access to ARINOVA has been revoked due to a serious violation of our community guidelines or terms of service.'}
        </p>

        <div style={{ background: 'var(--bg-surface-sunken)', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', margin: '0 0 2.5rem', border: '1px solid var(--border)' }}>
          {reason && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Reason</div>
              <div style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 }}>{reason}</div>
            </div>
          )}

          <div style={{ paddingTop: reason ? '1.5rem' : 0, borderTop: reason ? '1px solid var(--border)' : 'none' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Status</div>
            
            {isPermanent ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  <span>PERMANENT BAN</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Your account has been permanently banned.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isSuspend ? '#f59e0b' : '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Clock size={18} />
                  <span>{isSuspend ? 'Temporary Suspension' : 'Temporary Ban'}</span>
                </div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  {isSuspend ? 'Access restored' : 'Ban expires'}: <strong>{expiresAt ? formatAppDateTime(expiresAt) : 'Unknown'}</strong>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Time remaining: <span style={{ color: 'var(--text-main)', fontWeight: 600, fontFamily: 'monospace' }}>{timeLeft}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isPermanent && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            If you believe this was an error, please contact ARINOVA Support.
          </p>
        )}

        <button 
          onClick={onSignOut}
          style={{ width: '100%', padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-panel)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
