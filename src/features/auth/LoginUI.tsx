import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { reserveUsername, confirmUsername } from '../../lib/api'

export function LoginUI() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [signUpStep, setSignUpStep] = useState<'name' | 'credentials'>('name')
  const [reservation, setReservation] = useState<{ id: string; full_username: string; expires_at: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Countdown timer for reservation
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!reservation) return
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(reservation.expires_at).getTime()
      const diff = expiry - now
      
      if (diff <= 0) {
        clearInterval(interval)
        setReservation(null)
        setSignUpStep('name')
        setError('Reservation expired. Please try again.')
        setTimeLeft('')
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [reservation])

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (displayName.length < 4 || displayName.length > 12 || !/^[a-zA-Z]+$/.test(displayName)) {
      setError('Name must be 4-12 letters only (A-Z).')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const data = await reserveUsername(displayName)
      setReservation(data)
      setSignUpStep('credentials')
    } catch (err: any) {
      setError(err.message || 'Failed to reserve username.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setError(null)
    setIsSubmitting(true)
    
    try {
      if (isSignUp) {
        if (!reservation) throw new Error('Missing username reservation.')
        if (!signUpWithEmail) throw new Error("Email sign up not configured")
        
        // 1. Sign up the user (this creates the auth.users row)
        await signUpWithEmail(email, password)
        
        // 2. Confirm the reservation, tying it to the newly created auth.users row
        try {
          await confirmUsername(reservation.id)
        } catch (confirmErr: any) {
          // If confirmation fails (e.g. they expired exactly at submission), 
          // the auth user is created but identity is lost. They can fix it later or we handle it gracefully.
          console.error('Failed to confirm username reservation:', confirmErr)
          throw new Error('Account created, but identity reservation expired or failed. Please contact support.')
        }
        
      } else {
        if (!signInWithEmail) throw new Error("Email sign in not configured")
        await signInWithEmail(email, password)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      // Note: Google sign up bypasses the custom NAME#1234 flow natively.
      // A post-login hook in App.tsx or similar would be needed to enforce identity creation for OAuth users.
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    }
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
          padding: '48px',
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
          letterSpacing: '0.05em', marginBottom: '40px' 
        }}>
          {isSignUp ? 'INITIATE YOUR SEQUENCE' : 'RESUME YOUR SEQUENCE'}
        </p>

        {isSignUp && signUpStep === 'name' ? (
          <form onSubmit={handleReserve} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <User size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="DISPLAY NAME (4-12 LETTERS)" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={12}
                style={{
                  width: '100%', padding: '16px 16px 16px 48px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff3366', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.02em', overflow: 'hidden' }}>
                  <div style={{ paddingTop: '8px' }}>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={isSubmitting || authLoading}
              style={{
                width: '100%', padding: '16px', marginTop: '8px',
                background: '#00c8ff', color: '#030407',
                border: 'none', borderRadius: '2px',
                fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em',
                cursor: (isSubmitting || authLoading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: (isSubmitting || authLoading) ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {(isSubmitting || authLoading) ? 'GENERATING IDENTITY...' : 'RESERVE IDENTITY'}
              {!(isSubmitting || authLoading) && <ArrowRight size={16} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {isSignUp && reservation && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '16px', background: 'rgba(0, 200, 255, 0.05)', 
                  border: '1px solid rgba(0, 200, 255, 0.2)', borderRadius: '2px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  IDENTITY SECURED
                </div>
                <div style={{ fontSize: '1.25rem', color: '#00c8ff', fontWeight: 600, letterSpacing: '0.1em' }}>
                  {reservation.full_username}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#ff3366', marginTop: '8px', letterSpacing: '0.05em' }}>
                  EXPIRES IN: {timeLeft}
                </div>
              </motion.div>
            )}

            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '16px 16px 16px 48px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', letterSpacing: '0.05em',
                  borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00c8ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="PASSWORD" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '16px 48px 16px 48px',
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

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff3366', fontSize: '0.75rem', textAlign: 'center', letterSpacing: '0.02em', overflow: 'hidden' }}>
                  <div style={{ paddingTop: '8px' }}>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <button 
              type="submit" 
              disabled={isSubmitting || authLoading}
              style={{
                width: '100%', padding: '16px', marginTop: '8px',
                background: '#00c8ff', color: '#030407',
                border: 'none', borderRadius: '2px',
                fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em',
                cursor: (isSubmitting || authLoading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: (isSubmitting || authLoading) ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {(isSubmitting || authLoading) ? 'AUTHENTICATING...' : (isSignUp ? 'FINALIZE PROTOCOL' : 'ENTER')}
              {!(isSubmitting || authLoading) && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', opacity: 0.5 }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ padding: '0 16px', fontSize: '0.7rem', letterSpacing: '0.1em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || authLoading}
          style={{
            width: '100%', padding: '16px',
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

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              if (!isSignUp) {
                setSignUpStep('name')
                setReservation(null)
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
    </motion.div>
  )
}
