import { useAuth } from '../../lib/auth'
import { LandingExperience } from '../landing/LandingExperience'
import type { Progression } from '../../types'

type AuthShellProps = {
  onEnter: () => void
  progression: Progression
}

export function AuthShell({ onEnter }: AuthShellProps) {
  const { isConfigured, signInWithGoogle, loading } = useAuth()

  const handleAction = () => {
    if (isConfigured) {
      if (!loading) signInWithGoogle()
    } else {
      onEnter()
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#030407' }}>
      {/* Minimal Floating Navigation */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', pointerEvents: 'none',
        background: 'rgba(3, 4, 7, 0.4)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--cyan)', borderRadius: '6px' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>FutureMe</span>
          </div>
          
          <div style={{ display: 'none', gap: '24px', pointerEvents: 'auto' }} className="desktop-nav">
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Experience</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>How It Works</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Skills</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>Projects</a>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', pointerEvents: 'auto', alignItems: 'center' }}>
          <button onClick={handleAction} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            Sign In
          </button>
          <button onClick={handleAction} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 16px', color: '#fff', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            {loading ? 'Starting...' : 'Start Journey'}
          </button>
        </div>
      </nav>

      {/* 3D Cinematic Experience */}
      <LandingExperience handleAction={handleAction} />

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
