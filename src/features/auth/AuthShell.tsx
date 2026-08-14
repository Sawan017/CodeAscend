import { motion, useScroll, useTransform } from 'framer-motion'
import { Code2 } from 'lucide-react'
import type { Progression } from '../../types'

import { CinematicWorld } from '../landing/CinematicWorld/CinematicWorld'
import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

type AuthShellProps = {
  onEnter: () => void
  progression: Progression
}

export function AuthShell({ onEnter }: AuthShellProps) {
  // useAuth variables removed since they are no longer used here
  
  // Set up Lenis for buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05, 
      wheelMultiplier: 1,
      smoothWheel: true,
    })
    
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  const { scrollYProgress } = useScroll()
  
  // 7 Eras Interpolation Setup
  
  // Era 1 (Foundation)
  const era1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.10, 0.14], [1, 1, 1, 0])
  const era1Y = useTransform(scrollYProgress, [0, 0.14], [0, -150])

  // Era 2 (Build)
  const era2Opacity = useTransform(scrollYProgress, [0.11, 0.18, 0.25, 0.28], [0, 1, 1, 0])
  const era2Y = useTransform(scrollYProgress, [0.11, 0.28], [20, -20])

  // Era 3 (Systems)
  const era3Opacity = useTransform(scrollYProgress, [0.25, 0.32, 0.39, 0.42], [0, 1, 1, 0])
  const era3Y = useTransform(scrollYProgress, [0.25, 0.42], [20, -20])

  // Era 4 (Execution)
  const era4Opacity = useTransform(scrollYProgress, [0.39, 0.46, 0.53, 0.57], [0, 1, 1, 0])
  const era4Y = useTransform(scrollYProgress, [0.39, 0.57], [20, -20])

  // Era 5 (Mastery)
  const era5Opacity = useTransform(scrollYProgress, [0.54, 0.61, 0.68, 0.71], [0, 1, 1, 0])
  const era5Y = useTransform(scrollYProgress, [0.54, 0.71], [20, -20])

  // Era 6 (Signature)
  const era6Opacity = useTransform(scrollYProgress, [0.68, 0.75, 0.82, 0.86], [0, 1, 1, 0])
  const era6Y = useTransform(scrollYProgress, [0.68, 0.86], [20, -20])

  // ── Era 7 (Next) ──
  const era7Opacity = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1])
  const era7Y = useTransform(scrollYProgress, [0.85, 1], [20, 0])

  // ── Nav Branding ──
  // The entire top nav fades out and disappears as we enter Era 7
  const navOpacity = useTransform(scrollYProgress, [0.80, 0.85], [1, 0])
  const navDisplay = useTransform(scrollYProgress, v => v >= 0.85 ? 'none' : 'flex')
  
  // ── Era 7 Finale Animations ──
  // ARINOVA spawns from "deep inside" (scale 0.2 to 1, opacity 0 to 1)
  const finalArinovaScale = useTransform(scrollYProgress, [0.82, 0.92, 1], [0.2, 1, 1])
  const finalArinovaOpacity = useTransform(scrollYProgress, [0.82, 0.90, 1], [0, 1, 1])
  const finalArinovaY = useTransform(scrollYProgress, [0.82, 0.92, 1], [40, 0, 0])

  return (
    <div style={{ position: 'relative', width: '100%', background: '#030407', color: '#F5F5F0', overflowX: 'hidden' }}>
      
      {/* ── Procedural Canvas Background ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <CinematicWorld />
      </div>

      {/* ── Fixed Nav / Branding Layer ── */}
      <motion.nav style={{
        opacity: navOpacity,
        display: navDisplay,
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        justifyContent: 'space-between', alignItems: 'center',
        padding: '32px 56px',
        background: 'linear-gradient(to bottom, rgba(3,4,7,0.9) 0%, rgba(3,4,7,0) 100%)',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '4px',
            background: '#F5F5F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={14} color="#030407" />
          </div>
          <span style={{ fontWeight: 500, letterSpacing: '0.04em', fontSize: '1.05rem', fontFamily: 'Inter, sans-serif' }}>ARINOVA</span>
        </div>
      </motion.nav>

      {/* ── UI Layer (Scrolling Sections) ── */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        
        {/* ── ERA I: FOUNDATION ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div style={{ opacity: era1Opacity, y: era1Y, position: 'relative', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.3em', opacity: 0.5, fontFamily: 'Inter, sans-serif', marginBottom: '24px', textTransform: 'uppercase' }}>[ ERA I ] — LEARNING → PRACTICE → CONSISTENCY</span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.1, margin: 0 }}
            >
              A RECORD OF<br />WHAT I'VE BUILT.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              style={{ marginTop: '24px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.8, maxWidth: '600px', margin: '24px auto 0' }}
            >
              Every skill learned. Every project shipped. Every level earned.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
              style={{ position: 'absolute', top: '150%', left: '50%', transform: 'translateX(-50%)', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase', width: 'max-content' }}
            >
              SCROLL TO SEE HOW FAR I'VE COME.
            </motion.p>
          </motion.div>
        </section>

        {/* ── ERA II: BUILD ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{ opacity: era2Opacity, y: era2Y, position: 'absolute', top: '40%', left: '10%', maxWidth: '550px', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#f2c94c', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '16px', fontWeight: 500 }}>[ ERA II ] — IDEAS → SKILLS → PROJECTS</span>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.1, margin: 0 }}>
              KNOWLEDGE BECAME<br />OUTPUT.
            </h2>
            <p style={{ marginTop: '24px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.9, lineHeight: 1.6 }}>
              Less consuming. More creating. Projects started replacing tutorials, and ideas started becoming things I could actually build.
            </p>
          </motion.div>
        </section>

        {/* ── ERA III: SYSTEMS ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{ opacity: era3Opacity, y: era3Y, position: 'absolute', top: '45%', right: '10%', maxWidth: '550px', textAlign: 'right', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#ff8c42', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '16px', fontWeight: 500 }}>[ ERA III ] — CONNECT → BUILD → OPTIMIZE</span>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.1, margin: 0 }}>
              I STOPPED LEARNING<br />RANDOMLY.
            </h2>
            <p style={{ marginTop: '24px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.9, lineHeight: 1.6 }}>
              Everything started connecting. Concepts became systems. Skills began reinforcing each other instead of living in separate boxes.
            </p>
          </motion.div>
        </section>

        {/* ── ERA IV: EXECUTION ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{ opacity: era4Opacity, y: era4Y, position: 'absolute', top: '35%', left: '10%', maxWidth: '600px', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#ff3366', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '16px', fontWeight: 500 }}>[ ERA IV ] — CHALLENGE → EXECUTION → PROOF</span>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.1, margin: 0 }}>
              THE WORK STARTED<br />SPEAKING FOR ITSELF.
            </h2>
            <p style={{ marginTop: '24px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.9, lineHeight: 1.6 }}>
              More ambitious projects. Harder problems. Better decisions. Less talking about what I could do—and more proof that I could.
            </p>
          </motion.div>
        </section>

        {/* ── ERA V: MASTERY ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{ opacity: era5Opacity, y: era5Y, position: 'absolute', top: '40%', right: '10%', maxWidth: '550px', textAlign: 'right', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#b266ff', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '16px', fontWeight: 500 }}>[ ERA V ] — DEPTH → PRECISION → MASTERY</span>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.1, margin: 0 }}>
              SKILL BECAME<br />INSTINCT.
            </h2>
            <p style={{ marginTop: '24px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.9, lineHeight: 1.6 }}>
              The goal shifted from simply knowing how to do things to understanding why they work—and knowing how to push them further.
            </p>
          </motion.div>
        </section>

        {/* ── ERA VI: SIGNATURE ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{ opacity: era6Opacity, y: era6Y, position: 'absolute', top: '35%', left: '50%', x: '-50%', textAlign: 'center', maxWidth: '700px', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#4d79ff', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '16px', fontWeight: 500 }}>[ ERA VI ] — EXPERIENCE → STYLE → SIGNATURE</span>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.1, margin: 0 }}>
              THIS IS WHERE IT<br />STARTS LOOKING LIKE ME.
            </h2>
            <p style={{ marginTop: '24px', fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.9, lineHeight: 1.6 }}>
              A collection of everything learned, built, broken, rebuilt, and refined. Not just progress anymore—an identity taking shape through the work.
            </p>
          </motion.div>
        </section>

        {/* ── ERA VII: THE EMOTIONAL FINALE ── */}
        <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div style={{ opacity: era7Opacity, y: era7Y, position: 'relative', textAlign: 'center', textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)', marginTop: '10vh' }}>
            
            {/* The Final Spawning ARINOVA */}
            <motion.h1 style={{ 
              opacity: finalArinovaOpacity,
              scale: finalArinovaScale,
              y: finalArinovaY,
              fontFamily: '"Cinzel", serif', 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              fontWeight: 400, 
              letterSpacing: '0.15em', 
              textAlign: 'center', 
              margin: '0 auto 24px', 
              color: '#F5F5F0',
              textShadow: '0 4px 40px rgba(0,0,0,0.9)'
            }}>
              ARINOVA
            </motion.h1>

            {/* The Emotional Punchline */}
            <p style={{ marginTop: '0', fontFamily: 'Georgia, serif', fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)', letterSpacing: '0.04em', opacity: 0.9, maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.6, fontStyle: 'italic' }}>
              "The world can count milestones.<br />
              I remember the person that made me chase them."
            </p>

            {/* Original Era 7 Texts (Smaller) */}
            <div style={{ opacity: 1, transform: 'scale(1)' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', letterSpacing: '0.3em', color: '#00c8ff', fontFamily: 'Inter, sans-serif', marginBottom: '16px', fontWeight: 500 }}>[ ERA VII ] — PROGRESS → AMBITION → NEXT</span>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.4rem', fontWeight: 400, letterSpacing: '0.2em', textAlign: 'center', lineHeight: 1.2, margin: 0 }}>
                STILL BUILDING. STILL HUNGRY.
              </h2>
              <p style={{ marginTop: '16px', fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', letterSpacing: '0.04em', maxWidth: '550px', margin: '16px auto 0', lineHeight: 1.6, opacity: 0.9 }}>
                There is no final version. Every achievement becomes the foundation for something harder.
              </p>
            </div>
            
            <div style={{ marginTop: '50px', pointerEvents: 'auto' }}>
              <button onClick={onEnter} style={{
                background: '#00c8ff', color: '#030407', border: 'none',
                padding: '16px 40px', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
                transition: 'all 0.4s ease',
                boxShadow: '0 0 40px rgba(0, 200, 255, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 200, 255, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 200, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                START YOUR JOURNEY
              </button>
            </div>
          </motion.div>
        </section>
        
      </div>
    </div>
  )
}
