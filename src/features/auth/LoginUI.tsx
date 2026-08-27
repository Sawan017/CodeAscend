import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, User, X } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useAuth } from '../../lib/auth'
import { reserveUsername, resolveAuthEmail } from '../../lib/api'
import { LegalModal } from '../settings/LegalModal'
import { privacyPolicyText, termsOfServiceText } from '../settings/legalText'
import { supabase } from '../../lib/supabase'
import { validatePassword, getPasswordError } from '../../lib/passwordValidation'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

export function LoginUI() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, loading: authLoading } = useAuth()
  const [identifier, setIdentifier] = useState('') // Used for Email (signup claim) OR Username/ID (login)
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [password, setPassword] = useState('') // Used for login
  const [displayName, setDisplayName] = useState('') // Username
  const [createPassword, setCreatePassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [dob, setDob] = useState('')
  const [showLegalModal, setShowLegalModal] = useState<{isOpen: boolean, type: 'privacy' | 'tos'}>({isOpen: false, type: 'privacy'})
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const [error, setError] = useState<string | null>(null)
  const [successIdentity, setSuccessIdentity] = useState<{ id: string; login_id: string; dummy_email: string } | null>(null)
  const [rememberMe, setRememberMe] = useState(true)
  const [rememberedAccounts, setRememberedAccounts] = useState<string[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [showSavedAccounts, setShowSavedAccounts] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [accountToRemove, setAccountToRemove] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('remembered_accounts')
      if (saved) {
        const accounts = JSON.parse(saved) as string[]
        if (Array.isArray(accounts) && accounts.length > 0) {
          setRememberedAccounts(accounts)
          setShowSavedAccounts(true)
        }
      }
    } catch (e) {
      console.error('Failed to parse remembered accounts', e)
    }
  }, [])

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading) return
    if (!agreeTerms || !agreePrivacy || !dob) {
      setError('You must accept the legal terms and provide your Date of Birth to register.')
      return
    }
    if (calculateAge(dob) < 18) {
      setError('ARINOVA is restricted to users aged 18 and above.')
      return
    }
    if (displayName.length < 4 || displayName.length > 12 || !/^[a-zA-Z0-9_]+$/.test(displayName)) {
      setError('Username must be 4-12 characters (letters, numbers, underscores).')
      return
    }
    if (!createPassword || !validatePassword(createPassword).isValid) {
      setError(getPasswordError())
      return
    }
    if (createPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const data = await reserveUsername(displayName, createPassword, "1.0", "1.0")
      setSuccessIdentity({ id: data.id, login_id: data.login_id, dummy_email: data.dummy_email })
    } catch (err: any) {
      console.error("Signup error:", err)
      setError("Unable to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueToDashboard = async () => {
    if (!successIdentity) return
    if (isSubmitting || authLoading) return
    if (!captchaToken) {
      setError('Please complete the security check to continue.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      if (!signInWithEmail) throw new Error("Email auth not configured")
      
      if (!signUpWithEmail) throw new Error("Email sign-up not configured")
      
      window.localStorage.setItem('auth_remember_me', 'true') // Always remember newly created accounts by default
      window.localStorage.setItem('current_login_id', successIdentity.login_id)
      
      // Use signUpWithEmail to ensure the account is created via Supabase Auth API,
      // which strictly verifies the Turnstile captcha token.
      const signUpData = await signUpWithEmail(successIdentity.dummy_email, createPassword, { captchaToken, dob })
      
      if (!signUpData?.session) {
        throw new Error('Sign up blocked or email confirmation required. Please contact support.')
      }
      
      // The auth trigger link_reserved_identity automatically links the user_identities row.
    } catch (err: any) {
      let msg = err.message || 'Failed to establish session.'
      if (msg.includes('Database error querying schema')) {
        msg = 'Unable to establish session. Please try again.'
      }
      if (msg.includes('RATE_LIMIT_EXCEEDED:')) {
        const secs = parseInt(msg.split('RATE_LIMIT_EXCEEDED:')[1], 10) || 60;
        const time = secs > 60 ? `${Math.floor(secs/60)}m ${secs%60}s` : `${secs}s`;
        msg = `You're doing that too quickly. Please try again in ${time}.`;
      }
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading) return
    if (!identifier) {
      setError('Please provide an identifier')
      return
    }
    if (!isSignUp && !password) {
      setError('Please provide a password')
      return
    }
    setError(null)
    setIsSubmitting(true)
    
    try {
      if (!isSignUp) {
        if (!signInWithEmail) throw new Error("Email sign in not configured")
        
        // 1. Securely resolve the email for the provided username/login_id
        let resolvedEmail: string | null = identifier
        
        if (!identifier.includes('@')) {
          // It's a ARINOVA ID. Resolve securely using the password to prevent enumeration.
          resolvedEmail = await resolveAuthEmail(identifier, password)
        }
        
        if (!resolvedEmail) {
          throw new Error('Invalid login credentials')
        }
        
        // Save preferences before calling signInWithEmail (so the custom storage adapter knows what to do)
        window.localStorage.setItem('auth_remember_me', rememberMe ? 'true' : 'false')
        
        // Delegate actual password verification to Supabase Auth
        if (!captchaToken) {
          throw new Error('Please complete the security check to continue.')
        }
        const authData = await signInWithEmail(resolvedEmail, password, { captchaToken })
        
        // Always save the current login ID so signOut knows which account to manage
        // IMPORTANT: We must use the permanent login_id, not the identifier (which might be an email)
        let finalLoginId = identifier
        if (identifier.includes('@') && authData?.user) {
          const { data } = await supabase!.from('user_identities').select('login_id').eq('user_id', authData.user.id).limit(1).single()
          if (data) finalLoginId = data.login_id
        }
        
        window.localStorage.setItem('current_login_id', finalLoginId)
      }
    } catch (err: any) {
      console.error("EXACT LOGIN ERROR:", err);
      let msg = err.message || 'Authentication failed. Please try again.'
      if (msg.includes('schema cache') || msg.includes('does not exist')) {
        msg = `Authentication service is temporarily unavailable. Detailed Error: ${err.message}`
      } else if (msg.includes('Invalid login credentials') || msg.includes('Invalid login')) {
        msg = 'Invalid username or password'
      } else if (err?.status === 429 || err?.code === 'over_request_rate_limit' || msg.includes('rate limit reached')) {
        msg = 'Too many failed login attempts. Please wait a few minutes and try again.'
      } else if (msg.includes('ACCOUNT_COOLDOWN')) {
        msg = 'Too many failed login attempts. Account temporarily locked for security. Please try again later.'
      } else if (msg.includes('RATE_LIMIT_EXCEEDED:')) {
        const secs = parseInt(msg.split('RATE_LIMIT_EXCEEDED:')[1], 10) || 60;
        const time = secs > 60 ? `${Math.floor(secs/60)}m ${secs%60}s` : `${secs}s`;
        msg = `You're doing that too quickly. Please try again in ${time}.`;
      } else if (msg.includes('Account created, but identity reservation expired')) {
        msg = 'Unable to create account identity. Please contact support.'
      }
      setError(msg)
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      let msg = err.message || 'Login failed'
      if (msg.includes('Database error querying schema')) {
        msg = 'Unable to establish session. Please try again.'
      }
      setError(msg)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    if (!resetEmail || !resetEmail.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    if (!captchaToken) {
      setError('Please complete the security check to continue.')
      return
    }
    
    setError(null)
    setIsSubmitting(true)
    
    try {
      if (resetPassword) {
        await resetPassword(resetEmail, { captchaToken })
        setResetSuccess(true)
      }
    } catch (err: any) {
      turnstileRef.current?.reset()
      setError(err.message || 'Failed to send recovery email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isForgotPasswordMode) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        style={{
          width: '100%', maxWidth: '440px', padding: '3rem',
          background: 'rgba(10, 13, 20, 0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 200, 255, 0.1)', borderRadius: '4px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', margin: 'auto'
        }}
      >
        <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>RECOVER PASSWORD</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Enter the email address associated with your ARINOVA account to receive a reset link.
        </p>

        {resetSuccess ? (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
              If an account exists for {resetEmail}, you will receive a password reset link shortly.
            </div>
            <button 
              onClick={() => { setIsForgotPasswordMode(false); setResetSuccess(false); setResetEmail(''); }}
              style={{
                width: '100%', padding: '14px', letterSpacing: '0.1em',
                background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff', cursor: 'pointer', borderRadius: '2px', outline: 'none'
              }}
            >
              BACK TO LOGIN
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ padding: '12px', background: 'rgba(255, 50, 50, 0.1)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff4444', borderRadius: '4px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            
            <div style={{ position: 'relative' }}>
              <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={{
                  width: '100%', padding: '16px 48px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
              <Turnstile 
                ref={turnstileRef}
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY as string} 
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => setError('Security check failed. Please try again.')}
                onExpire={() => setCaptchaToken(null)}
              />
            </div>

            <button 
              type="submit" 
              className="primary-btn" 
              disabled={isSubmitting || !captchaToken}
              style={{ padding: '12px', fontSize: '0.9rem', letterSpacing: '0.1em', opacity: (isSubmitting || !captchaToken) ? 0.7 : 1 }}
            >
              {isSubmitting ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
            
            <button 
              type="button"
              onClick={() => { setIsForgotPasswordMode(false); setError(null); }}
              style={{ 
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', 
                fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem',
                textDecoration: 'underline'
              }}
            >
              Back to Login
            </button>
          </form>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div 
      key="login-ui"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      style={{
      width: '100vw', height: '100vh', 
      background: '#030407',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      color: '#F5F5F0', fontFamily: 'Inter, sans-serif'
    }}>
      {/* Background Ambient Glow */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 200, 255, 0.05) 0%, rgba(3, 4, 7, 1) 70%)',
          zIndex: 0, pointerEvents: 'none'
        }} 
      />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '420px',
          padding: '24px 32px',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '2px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
        }}
      >
        <h1 style={{ 
          fontFamily: '"Cinzel", serif', 
          fontSize: '2rem', 
          fontWeight: 400, 
          letterSpacing: '0.15em', 
          textAlign: 'center', 
          margin: '0 0 8px 0',
          textShadow: '0 4px 20px rgba(0, 200, 255, 0.3)'
        }}>
          ARINOVA
        </h1>
        <p style={{ 
          textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', 
          letterSpacing: '0.05em', marginBottom: '24px' 
        }}>
          {isSignUp ? 'INITIATE YOUR SEQUENCE' : 'RESUME YOUR SEQUENCE'}
        </p>

        {isSignUp ? (
          successIdentity ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '24px', width: '100%', background: 'rgba(0, 200, 255, 0.05)', 
                  border: '1px solid rgba(0, 200, 255, 0.2)', borderRadius: '4px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  YOUR PERMANENT LOGIN ID
                </div>
                <div style={{ fontSize: '1.75rem', color: '#00c8ff', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {successIdentity.login_id}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '12px', lineHeight: '1.5' }}>
                  This is your unique identifier. Please save it.<br/>You will use this and your password to log in.
                </div>
              </motion.div>
              
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#ff3366', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.02em', overflow: 'hidden' }}>
                    <div style={{ paddingTop: '8px' }}>{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', width: '100%' }}>
                <Turnstile 
                  ref={turnstileRef}
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY as string} 
                  onSuccess={(token) => setCaptchaToken(token)}
                  onError={() => setError('Security check failed. Please try again.')}
                  onExpire={() => setCaptchaToken(null)}
                  options={{ theme: 'dark' }}
                />
              </div>

              <button 
                onClick={handleContinueToDashboard}
                disabled={isSubmitting || authLoading || !captchaToken}
                style={{
                  width: '100%', padding: '12px',
                  background: '#00c8ff', color: '#030407',
                  border: 'none', borderRadius: '2px',
                  fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em',
                  cursor: (isSubmitting || authLoading) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: (isSubmitting || authLoading) ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {(isSubmitting || authLoading) ? 'FINALIZING...' : 'CONTINUE TO DASHBOARD'}
                {!(isSubmitting || authLoading) && <ArrowRight size={16} />}
              </button>
            </div>
          ) : (
          <form onSubmit={handleReserve} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="USERNAME (4-12 LETTERS/NUMBERS)" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={12}
                style={{
                  width: '100%', padding: '12px 12px 12px 42px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="CREATE PASSWORD" 
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                autoComplete="new-password"
                aria-label="Create password"
                style={{
                  width: '100%', padding: '12px 42px 12px 42px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {showPassword ? <EyeOff size={16} color="rgba(255,255,255,0.4)" /> : <Eye size={16} color="rgba(255,255,255,0.4)" />}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="CONFIRM PASSWORD" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                aria-label="Confirm password"
                style={{
                  width: '100%', padding: '12px 42px 12px 42px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            {/* Live password strength indicator */}
            {createPassword && (
              <PasswordStrengthIndicator 
                password={createPassword} 
                confirmPassword={confirmPassword}
              />
            )}
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff3366', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.02em', overflow: 'hidden' }}>
                  <div style={{ paddingTop: '8px' }}>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ marginTop: '0.2rem' }} />
                <span>I agree to the <button type="button" onClick={(e) => { e.preventDefault(); setShowLegalModal({isOpen: true, type: 'tos'}) }} style={{ background: 'none', border: 'none', color: '#00c8ff', cursor: 'pointer', padding: 0 }}>Terms of Service</button>.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} style={{ marginTop: '0.2rem' }} />
                <span>I acknowledge the <button type="button" onClick={(e) => { e.preventDefault(); setShowLegalModal({isOpen: true, type: 'privacy'}) }} style={{ background: 'none', border: 'none', color: '#00c8ff', cursor: 'pointer', padding: 0 }}>Privacy Policy</button> and consent to the processing of my personal data.</span>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                <span>Date of Birth (ARINOVA is strictly 18+)</span>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  style={{ 
                    padding: '0.5rem', 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'white', 
                    borderRadius: '4px' 
                  }} 
                />
              </label>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || authLoading || !agreeTerms || !agreePrivacy || !dob || calculateAge(dob) < 18 || !validatePassword(createPassword).isValid || createPassword !== confirmPassword}
              style={{
                width: '100%', padding: '12px', marginTop: '8px',
                background: '#00c8ff', color: '#030407',
                border: 'none', borderRadius: '2px',
                fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em',
                cursor: (isSubmitting || authLoading || !agreeTerms || !agreePrivacy || !dob || calculateAge(dob) < 18 || !validatePassword(createPassword).isValid || createPassword !== confirmPassword) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: (isSubmitting || authLoading || !agreeTerms || !agreePrivacy || !dob || calculateAge(dob) < 18 || !validatePassword(createPassword).isValid || createPassword !== confirmPassword) ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {(isSubmitting || authLoading) ? 'GENERATING...' : 'CREATE ACCOUNT'}
              {!(isSubmitting || authLoading) && <ArrowRight size={16} />}
            </button>
          </form>
          )
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {showSavedAccounts ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {accountToRemove ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '24px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Remove saved account?</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                      Are you sure you want to remove <span style={{ color: '#00c8ff' }}>{accountToRemove}</span> from this device?
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAccountToRemove(null)}
                        style={{
                          flex: 1, padding: '12px', background: 'transparent', color: '#fff',
                          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px', fontSize: '0.75rem', cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newAccounts = rememberedAccounts.filter(a => a !== accountToRemove)
                          window.localStorage.setItem('remembered_accounts', JSON.stringify(newAccounts))
                          const baseKey = 'sb-' + new URL(import.meta.env.VITE_SUPABASE_URL || '').hostname.split('.')[0] + '-auth-token'
                          window.localStorage.removeItem(`${baseKey}-${accountToRemove}`)
                          window.sessionStorage.removeItem(`${baseKey}-${accountToRemove}`)
                          
                          setRememberedAccounts(newAccounts)
                          setAccountToRemove(null)
                          if (newAccounts.length === 0) {
                            setShowSavedAccounts(false)
                          }
                        }}
                        style={{
                          flex: 1, padding: '12px', background: '#ff3366', color: '#fff',
                          border: 'none', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: '8px', textAlign: 'center' }}>
                      SELECT AN ACCOUNT
                    </div>
                    {rememberedAccounts.map((account) => {
                      const isSelected = selectedAccount === account
                      return (
                        <div key={account} style={{ position: 'relative', width: '100%' }}>
                          <button
                            type="button"
                            disabled={isRestoring}
                            onClick={async () => {
                              setSelectedAccount(account)
                              setIdentifier(account)
                              setIsRestoring(true)
                              setError(null)
                              try {
                                // 1. Set the active account so customStorage knows which namespace to use
                                window.localStorage.setItem('current_login_id', account)

                                // 2. We can try to load it from customStorage directly just to pass to setSession,
                                // which avoids a hard page reload while still strictly using Supabase's native storage formatting.
                                const baseKey = 'sb-' + new URL(import.meta.env.VITE_SUPABASE_URL || '').hostname.split('.')[0] + '-auth-token'
                                const storedTokenStr = window.localStorage.getItem(`${baseKey}-${account}`) || window.sessionStorage.getItem(`${baseKey}-${account}`)
                                
                                if (storedTokenStr) {
                                  const parsed = JSON.parse(storedTokenStr)
                                  if (parsed && parsed.access_token && parsed.refresh_token && supabase) {
                                    const { error } = await supabase.auth.setSession({
                                      access_token: parsed.access_token,
                                      refresh_token: parsed.refresh_token
                                    })
                                    if (!error) {
                                      // Success! Global auth state will redirect
                                      return
                                    }
                                  }
                                }
                                // No valid session data in native storage
                                setShowSavedAccounts(false)
                              } catch (e) {
                                console.error('Failed to restore session', e)
                                setError('Session expired. Please sign in again.')
                                setShowSavedAccounts(false)
                              } finally {
                                setIsRestoring(false)
                              }
                            }}
                            style={{
                              width: '100%', padding: '12px',
                              background: isSelected ? 'rgba(0, 200, 255, 0.15)' : 'rgba(0, 200, 255, 0.05)', 
                              border: `1px solid ${isSelected ? '#00c8ff' : 'rgba(0, 200, 255, 0.2)'}`,
                              color: isSelected ? '#fff' : '#00c8ff', 
                              fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em',
                              borderRadius: '4px', cursor: isRestoring ? 'wait' : 'pointer', transition: 'all 0.2s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              opacity: isRestoring ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => { if (!isSelected && !isRestoring) e.currentTarget.style.background = 'rgba(0, 200, 255, 0.1)' }}
                            onMouseLeave={(e) => { if (!isSelected && !isRestoring) e.currentTarget.style.background = 'rgba(0, 200, 255, 0.05)' }}
                          >
                            <User size={16} style={{ marginRight: '8px' }} />
                            {isRestoring && isSelected ? 'RESTORING SESSION...' : account}
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setAccountToRemove(account)
                            }}
                            style={{
                              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                              cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              borderRadius: '4px', zIndex: 2
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSavedAccounts(false)
                        setSelectedAccount(null)
                        setIdentifier('')
                      }}
                      style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.8rem', letterSpacing: '0.05em', cursor: 'pointer',
                        textDecoration: 'underline', textUnderlineOffset: '4px', marginTop: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      Use another ID
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="LOGIN ID (e.g. Username#1234)"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  readOnly={!!selectedAccount}
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px',
                    background: selectedAccount ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: selectedAccount ? '#00c8ff' : '#fff', 
                    fontSize: '0.85rem', letterSpacing: '0.05em',
                    borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                {(selectedAccount || rememberedAccounts.length > 0) && (
                  <button type="button" onClick={() => {
                    setShowSavedAccounts(true)
                  }} style={{
                    position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textDecoration: 'underline'
                  }}>
                    Saved Accounts
                  </button>
                )}
              </div>
            )}

            {(!showSavedAccounts) && (
              <>
                {/* Password Input (ALWAYS SHOWN) */}
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="PASSWORD" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    aria-label="Password"
                    style={{
                      width: '100%', padding: '12px 42px 12px 42px',
                      background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                      borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {showPassword ? <EyeOff size={16} color="rgba(255,255,255,0.4)" /> : <Eye size={16} color="rgba(255,255,255,0.4)" />}
                  </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPasswordMode(true); setError(null); }}
                    style={{ 
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', 
                      fontSize: '0.8rem', cursor: 'pointer', padding: 0,
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      appearance: 'none', width: '16px', height: '16px',
                      border: '1px solid rgba(255,255,255,0.3)', borderRadius: '2px',
                      background: rememberMe ? '#00c8ff' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
                    KEEP ME SIGNED IN
                  </span>
                </label>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ color: '#ff3366', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.02em', overflow: 'hidden' }}>
                      <div style={{ paddingTop: '8px' }}>{error}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                  <Turnstile 
                    ref={turnstileRef}
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY as string} 
                    onSuccess={(token) => setCaptchaToken(token)}
                    onError={() => setError('Security check failed. Please try again.')}
                    onExpire={() => setCaptchaToken(null)}
                    options={{ theme: 'dark' }}
                  />
                </div>

                {/* Action Buttons */}
                <button 
                  type="submit" 
                  disabled={isSubmitting || authLoading}
                  style={{
                    width: '100%', padding: '12px', marginTop: '8px',
                    background: '#00c8ff', color: '#030407',
                    border: 'none', borderRadius: '2px',
                    fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em',
                    cursor: (isSubmitting || authLoading) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: (isSubmitting || authLoading) ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {(isSubmitting || authLoading) ? 'AUTHENTICATING...' : 'ENTER'}
                  {!(isSubmitting || authLoading) && <ArrowRight size={16} />}
                </button>
              </>
            )}
          </form>
        )}

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', opacity: 0.5 }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ padding: '0 16px', fontSize: '0.7rem', letterSpacing: '0.1em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || authLoading}
          style={{
            width: '100%', padding: '12px',
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px',
            fontSize: '0.8rem', letterSpacing: '0.05em',
            cursor: (isSubmitting || authLoading) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          CONTINUE WITH GOOGLE
        </button>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              if (!isSignUp) {
                setSuccessIdentity(null)
              }
            }}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem', letterSpacing: '0.05em', cursor: 'pointer',
              textDecoration: 'underline', textUnderlineOffset: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            {isSignUp ? 'ALREADY HAVE AN IDENTITY? SIGN IN' : 'CREATE NEW IDENTITY'}
          </button>
        </div>
      </motion.div>
          <LegalModal 
        isOpen={showLegalModal.isOpen} 
        onClose={() => setShowLegalModal({isOpen: false, type: 'privacy'})} 
        title={showLegalModal.type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        content={showLegalModal.type === 'privacy' ? privacyPolicyText : termsOfServiceText}
      />
    </motion.div>
  )
}
