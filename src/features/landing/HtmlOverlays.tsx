import { Scroll } from '@react-three/drei'

export function HtmlOverlays({ handleAction }: { handleAction: () => void }) {
  return (
    <Scroll html style={{ width: '100%', height: '100%' }}>
      {/* Section 1: Hero */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0 0 1rem 0' }}>
          Build your future.
        </h1>
        <p style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: '#06b6d4', margin: '0 0 1.5rem 0', fontWeight: 500 }}>
          Learn skills. Build projects. Level up.
        </p>
        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6, margin: '0 0 3rem 0' }}>
          FutureMe turns learning into a measurable journey — where every skill, project and achievement moves you closer to the future you want.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleAction} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '12px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            Start Your Journey
          </button>
          <button onClick={handleAction} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}>
            Explore FutureMe
          </button>
        </div>
      </div>

      {/* Section 2: Learn */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw', color: 'white' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>Every skill connects.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>
          Visualize your knowledge as a dynamic, interconnected network. Discover the pathways between what you know and what you need to learn.
        </p>
      </div>

      {/* Section 3: Build */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingRight: '10vw', color: 'white', textAlign: 'right' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>Don't just learn. Build.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>
          Turn knowledge into projects that prove what you can do. Our spatial workspace provides the perfect environment for deep, focused creation.
        </p>
      </div>

      {/* Section 4: Level Up */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw', color: 'white' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em', color: '#a855f7' }}>Every step counts.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>
          Experience a verified progression system. Earn XP, unlock badges, and track your achievements as you elevate your capabilities.
        </p>
      </div>

      {/* Section 5: Your Future (Scroll buffer / cinematic gap) */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>Become the person<br />you're learning to be.</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6 }}>
          Your skills are more than numbers. They're the foundation of what you build next.
        </p>
      </div>

      {/* Section 6: Final CTA */}
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 600, margin: '0 0 2rem 0', letterSpacing: '-0.03em' }}>Your journey starts here.</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleAction} style={{ padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 600, borderRadius: '12px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
            Start Your Journey
          </button>
        </div>
        <button onClick={handleAction} style={{ marginTop: '1.5rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', fontSize: '1rem', cursor: 'pointer', textDecoration: 'underline' }}>
          Sign in
        </button>
      </div>
    </Scroll>
  )
}
