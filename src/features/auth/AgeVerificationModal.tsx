import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react'
import { verifyAge } from '../../lib/api'

export function AgeVerificationModal({ 
  isOpen, 
  onSuccess 
}: { 
  isOpen: boolean
  onSuccess: () => void 
}) {
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i)
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]
  
  const getDaysInMonth = (m: string, y: string) => {
    if (!m || !y) return 31;
    return new Date(parseInt(y), parseInt(m), 0).getDate();
  }
  const days = Array.from({ length: getDaysInMonth(month, year) }, (_, i) => String(i + 1).padStart(2, '0'))

  useEffect(() => {
    if (day && month && year) {
      const maxDays = getDaysInMonth(month, year);
      if (parseInt(day) > maxDays) setDay('');
    }
  }, [month, year]);

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!month || !day || !year) {
      setError('Please select your complete date of birth.')
      return
    }

    const dobString = `${year}-${month}-${day}`
    const dobDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    if (dobDate > new Date()) {
       setError('Future dates are not allowed.')
       return
    }

    const age = calculateAge(dobDate)
    if (age < 18) {
       setError('Verification failed. You must be at least 18 years old.')
       return
    }

    setLoading(true)
    setError(null)
    try {
      const success = await verifyAge(dobString)
      if (success) {
        onSuccess()
      } else {
        setError('Verification failed. You must be at least 18 years old.')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{
              background: 'var(--ca-surface)',
              border: '1px solid var(--ca-border-strong)',
              borderRadius: '16px',
              padding: '2.5rem',
              maxWidth: '440px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '50%' }}>
                <Calendar size={32} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--ca-text)' }}>Age Verification Required</h2>
              <p style={{ margin: 0, color: 'var(--ca-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                ARINOVA requires all users to be at least 18 years old. Please confirm your date of birth to unlock your account features.
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--ca-text)', fontWeight: 500 }}>Date of Birth</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    disabled={loading}
                    style={{ flex: 2, padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--ca-border-strong)', background: 'var(--ca-bg)', color: 'var(--ca-text)', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="">Month</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1, padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--ca-border-strong)', background: 'var(--ca-bg)', color: 'var(--ca-text)', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="">Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    disabled={loading}
                    style={{ flex: 1.5, padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--ca-border-strong)', background: 'var(--ca-bg)', color: 'var(--ca-text)', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !month || !day || !year}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  cursor: (loading || !month || !day || !year) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !month || !day || !year) ? 0.7 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Verifying...' : 'Verify Age'}
                {!loading && <CheckCircle size={18} />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
