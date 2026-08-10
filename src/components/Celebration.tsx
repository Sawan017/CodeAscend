import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateProgressToNextLevel } from '../lib/progression'

export function Celebration({ xp }: { xp: number }) {
  const { level } = calculateProgressToNextLevel(xp)
  const [prevLevel, setPrevLevel] = useState(level)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (level > prevLevel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true)
      setPrevLevel(level)
      const timer = setTimeout(() => setShow(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [level, prevLevel])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(90, 200, 250, 0.15) 0%, transparent 70%)'
          }}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            style={{
              background: 'var(--bg-surface)', padding: '3rem 5rem',
              borderRadius: '32px', border: '2px solid var(--cyan)',
              boxShadow: '0 0 80px rgba(90,200,250,0.4)', textAlign: 'center'
            }}
          >
            <motion.h1 
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: '4.5rem', color: 'var(--cyan)', margin: 0, textShadow: '0 0 30px rgba(90,200,250,0.8)' }}
            >
              LEVEL UP!
            </motion.h1>
            <p style={{ fontSize: '1.75rem', color: 'white', marginTop: '1rem', fontWeight: 600 }}>
              You reached Level {level}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
