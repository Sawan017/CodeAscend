import { Scroll } from '@react-three/drei'

export function HtmlOverlays({ handleAction }: { handleAction: () => void }) {
  // We have 10 pages in ScrollControls.
  return (
    <Scroll html style={{ width: '100%', height: '100%' }}>
      {/* Page 1-3: Hero (Longer scroll distance for cinematic pacing) */}
      <div style={{ height: '250vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '35vh', paddingLeft: '8vw', color: 'white', pointerEvents: 'none' }}>
        <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 1rem 0', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
          Build your<br />future.
        </h1>
        <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#06b6d4', margin: '0 0 1.5rem 0', fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          Learn skills. Build projects. Level up.
        </p>
        <p style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '500px', lineHeight: 1.6, margin: '0 0 3rem 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          FutureMe turns learning into a measurable journey — where every skill, project and achievement moves you closer to the future you want.
        </p>
        <div style={{ display: 'flex', gap: '1rem', pointerEvents: 'auto' }}>
          <button onClick={handleAction} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '12px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            Start Your Journey
          </button>
          <button onClick={handleAction} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}>
            Explore FutureMe
          </button>
        </div>
      </div>

      {/* Page 3: Learn Space (Z = -40) */}
      <div style={{ height: '200vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '40vh', paddingLeft: '10vw', color: 'white', pointerEvents: 'none' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>Learn with direction.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6 }}>
          Turn scattered tutorials into a structured spatial path that moves you from fundamentals to real skills.
        </p>
      </div>

      {/* Page 5: Build / Projects Space (Z = -80) */}
      <div style={{ height: '200vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '50vh', alignItems: 'flex-end', paddingRight: '10vw', color: 'white', textAlign: 'right', pointerEvents: 'none' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>Don't just learn. Build.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6 }}>
          Turn knowledge into projects that prove what you can actually do. Enter a workspace designed for deep creation.
        </p>
      </div>

      {/* Page 7: Progress / XP Space (Z = -120) */}
      <div style={{ height: '200vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '30vh', paddingLeft: '10vw', color: 'white', pointerEvents: 'none' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em', color: '#a855f7' }}>Every step counts.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6 }}>
          Earn XP, maintain your streak, and see your growth become a measurable progression.
        </p>
      </div>
      
      {/* Page 9: Achievements Space (Z = -160) */}
      <div style={{ height: '150vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '40vh', alignItems: 'flex-end', paddingRight: '10vw', color: 'white', textAlign: 'right', pointerEvents: 'none' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em', color: '#06b6d4' }}>Make progress visible.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: 1.6 }}>
          Unlock achievements as you learn and build. Your dedication leaves a permanent mark.
        </p>
      </div>

      {/* Page 10: Final CTA Space (Z = -200) */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', pointerEvents: 'auto' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, margin: '0 0 2rem 0', letterSpacing: '-0.03em' }}>Your journey starts here.</h2>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={handleAction} style={{ padding: '1.2rem 3.5rem', fontSize: '1.2rem', fontWeight: 600, borderRadius: '12px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}>
            Start Your Journey
          </button>
        </div>
        <button onClick={handleAction} style={{ marginTop: '2rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'underline' }}>
          Sign In
        </button>
      </div>
    </Scroll>
  )
}
