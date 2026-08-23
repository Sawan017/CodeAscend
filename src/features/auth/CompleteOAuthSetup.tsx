import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { validatePassword, getPasswordError } from '../../lib/passwordValidation'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { Eye, EyeOff, Loader, CheckCircle, XCircle } from 'lucide-react'

interface CompleteOAuthSetupProps {
  onComplete: () => void
}

export function CompleteOAuthSetup({ onComplete }: CompleteOAuthSetupProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Real-time username validation
  const [isValidating, setIsValidating] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const checkUsername = async () => {
      const clean = username.replace(/[^a-zA-Z0-9_ ]/g, '')
      if (clean.length < 4) {
        setUsernameAvailable(null)
        return
      }

      setIsValidating(true)
      const { data, error } = await supabase!
        .from('user_identities')
        .select('id')
        .eq('normalized_name', clean)
        .limit(1)

      if (error) {
        setUsernameAvailable(null)
      } else {
        setUsernameAvailable(data.length === 0)
      }
      setIsValidating(false)
    }

    const timeoutId = setTimeout(checkUsername, 500)
    return () => clearTimeout(timeoutId)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (username.length < 4) {
      setError('Username must be at least 4 characters.')
      return
    }

    if (usernameAvailable === false) {
      setError('Username is already taken.')
      return
    }

    if (!validatePassword(password).isValid) {
      setError(getPasswordError())
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Securely bind the new password to the existing Google-authenticated account
      const { error: pwdError } = await supabase!.auth.updateUser({ password })
      if (pwdError) throw pwdError

      // 2. Claim the identity securely using the server-side RPC
      const { error: claimError } = await supabase!.rpc('claim_oauth_identity', {
        username_input: username
      })
      if (claimError) throw claimError

      // Successfully claimed and password bound. 
      // The App.tsx will now resume its flow, see the identity exists, and safely generate the profile.
      onComplete()
    } catch (err: any) {
      console.error('Account setup failed:', err)
      setError(err.message || 'Failed to complete account setup.')
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Complete Your Account</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Welcome! Please choose a unique Codeascend username and create a password for your account.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* USERNAME FIELD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>USERNAME</label>
              {isValidating ? (
                <Loader size={14} color="var(--text-dim)" className="spin" />
              ) : username.length >= 4 && usernameAvailable === true ? (
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><CheckCircle size={14} /> Available</span>
              ) : username.length >= 4 && usernameAvailable === false ? (
                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><XCircle size={14} /> Taken</span>
              ) : null}
            </div>
            <input
              type="text"
              placeholder="e.g. ShadowDev"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={12}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--bg-surface-sunken)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {username.length > 0 && (
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-dim)', 
                marginTop: '4px',
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                Preview Codeascend ID: <strong style={{ color: 'var(--text-main)' }}>{username.replace(/[^a-zA-Z0-9_ ]/g, '')}#xxxx</strong>
                <div style={{ marginTop: '2px', opacity: 0.7 }}>A unique 4-digit number will be securely assigned.</div>
              </div>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>CREATE PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingRight: '2.5rem',
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} color="rgba(255,255,255,0.4)" /> : <Eye size={16} color="rgba(255,255,255,0.4)" />}
              </button>
            </div>
            {password && (
              <PasswordStrengthIndicator password={password} confirmPassword={confirmPassword} />
            )}
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>CONFIRM PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm secure password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingRight: '2.5rem',
                  background: 'var(--bg-surface-sunken)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || username.length < 4 || usernameAvailable === false || !validatePassword(password).isValid || password !== confirmPassword}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: (isSubmitting || username.length < 4 || usernameAvailable === false || !validatePassword(password).isValid || password !== confirmPassword) ? 'not-allowed' : 'pointer',
              opacity: (isSubmitting || username.length < 4 || usernameAvailable === false || !validatePassword(password).isValid || password !== confirmPassword) ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s, transform 0.1s'
            }}
          >
            {isSubmitting ? (
              <><Loader size={18} className="spin" /> Setting up...</>
            ) : (
              'Complete Account'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
