import { formatAppDateTime } from '../../../lib/dateFormatting';
﻿import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {  PauseCircle, X , Loader2 } from 'lucide-react';
import { CustomSelect } from '../../../components/CustomSelect';

type SuspendUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (durationHours: number, reason: string) => void;
  isProcessing: boolean;
  targetUser?: any;
};

export function SuspendUserModal({ isOpen, onClose, onConfirm, isProcessing, targetUser }: SuspendUserModalProps) {
  const [duration, setDuration] = useState<string>('24');
  const [customHours, setCustomHours] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleConfirm = () => {
    let hours = parseInt(duration, 10);
    if (duration === 'custom') {
      hours = parseInt(customHours, 10);
    }
    if (isNaN(hours) || hours <= 0) return;
    onConfirm(hours, reason);
  };

  const isReady = duration !== 'custom' || parseInt(customHours, 10) > 0;

  let hours: number | null = null;
  if (duration === 'custom') {
    hours = parseInt(customHours, 10);
  } else {
    hours = parseInt(duration, 10);
  }
  
  let expiresAt = null;
  if (hours && !isNaN(hours) && hours > 0) {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    expiresAt = d;
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => !isProcessing && onClose()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{ 
              position: 'relative', 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-strong)', 
              borderRadius: '16px',
              padding: '2rem',
              width: '90%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '8px' }}>
                  <PauseCircle size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Suspend User</h2>
              </div>
              <button onClick={() => { if (!isProcessing) onClose(); }} disabled={isProcessing} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {targetUser && (
                <div style={{ background: 'var(--bg-surface-sunken)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>Target User</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{targetUser.login_id}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{targetUser.display_name || targetUser.username}</div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>Suspension Duration</label>
                <CustomSelect
                  value={duration}
                  onChange={setDuration}
                  options={[
                    { value: '1', label: '1 Hour' },
                    { value: '6', label: '6 Hours' },
                    { value: '12', label: '12 Hours' },
                    { value: '24', label: '1 Day' },
                    { value: '72', label: '3 Days' },
                    { value: '168', label: '7 Days' },
                    { value: 'custom', label: 'Custom (Hours)' }
                  ]}
                />
              </div>

              {duration === 'custom' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>Custom Hours</label>
                  <input 
                    type="number"
                    min="1"
                    value={customHours}
                    onChange={e => setCustomHours(e.target.value)}
                    placeholder="Enter number of hours"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.95rem' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>Reason (Optional but recommended)</label>
                <textarea 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Internal reason for this suspension..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-main)', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <div style={{ marginBottom: '0.25rem' }}><strong>User:</strong> {targetUser?.login_id}</div>
                <div style={{ marginBottom: '0.25rem' }}><strong>Duration:</strong> {duration === 'custom' ? (customHours ? `${customHours} ${customHours === '1' ? 'Hour' : 'Hours'}` : 'Not set') : [
  { value: '1', label: '1 Hour' },
  { value: '6', label: '6 Hours' },
  { value: '12', label: '12 Hours' },
  { value: '24', label: '1 Day' },
  { value: '72', label: '3 Days' },
  { value: '168', label: '7 Days' }
].find(o => o.value === duration)?.label}</div>
                <div style={{ marginTop: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  This account will automatically return to ACTIVE on {expiresAt ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(expiresAt) + ' at ' + new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(expiresAt) : 'Unknown'}.
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                onClick={() => { if (!isProcessing) onClose(); }}
                disabled={isProcessing}
                className="secondary-btn"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button 
                disabled={isProcessing || !isReady}
                onClick={handleConfirm}
                style={{
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.9rem',
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: (isProcessing || !isReady) ? 'not-allowed' : 'pointer',
                  opacity: (isProcessing || !isReady) ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
              >
                {isProcessing && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />}{isProcessing ? 'Processing...' : 'Suspend User'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    const targetNode = document.getElementById('app-shell-root') || document.body;
    return createPortal(modalContent, targetNode);
  }
  return modalContent;
}
