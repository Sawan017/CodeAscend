import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../lib/auth'

export function LoginUI() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect authenticated users is handled by App.tsx rendering logic

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
        if (!signUpWithEmail) throw new Error("Email sign up not configured")
        await signUpWithEmail(email, password)
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
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
            {(isSubmitting || authLoading) ? 'AUTHENTICATING...' : (isSignUp ? 'INITIALIZE' : 'ENTER')}
            {!(isSubmitting || authLoading) && <ArrowRight size={16} />}
          </button>
        </form>

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
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <button onClick={() => {}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}>
            Forgot Password?
          </button>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#00c8ff', cursor: 'pointer', padding: 0 }}>
            {isSignUp ? 'Sign In Instead' : 'Create Account'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
