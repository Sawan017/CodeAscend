import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { validatePassword, getPasswordError } from '../../lib/passwordValidation'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

export function UpdatePasswordUI({ onComplete }: { onComplete: () => void }) {
  const { updatePassword } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!newPassword || !validatePassword(newPassword).isValid) {
      setError(getPasswordError())
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      if (updatePassword) {
        await updatePassword(newPassword)
        setIsSuccess(true)
        // Clear persistence immediately so reload doesn't show this again,
        // but keep the component mounted so the user sees the Success screen.
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('isRecoveringPassword')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: '1rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--surface)',
            padding: '3rem',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '440px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', margin: '0 0 1rem 0', color: '#fff' }}>Password Updated</h2>
          <p className="muted" style={{ marginBottom: '2rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)' }}>
            Your password has been successfully changed. You can now return to the login screen.
          </p>
          <button 
            onClick={onComplete}
            className="primary-btn" 
            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            Back to Login <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(10, 13, 20, 0.85)', backdropFilter: 'blur(10px)',
          padding: '3rem',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '440px',
          border: '1px solid rgba(0, 200, 255, 0.1)'
        }}
      >
        <button 
          onClick={onComplete}
          style={{ 
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', 
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
            padding: 0, marginBottom: '2rem', fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>UPDATE PASSWORD</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%', padding: '16px 48px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
              />
            </div>
            {newPassword.length > 0 && <div style={{marginTop: '0.5rem'}}><PasswordStrengthIndicator password={newPassword} /></div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%', padding: '16px 48px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="primary-btn"
            disabled={isSubmitting}
            style={{
              padding: '16px', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  )
}