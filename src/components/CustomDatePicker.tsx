import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface CustomDatePickerProps {
  value: string // YYYY-MM-DD
  onChange: (date: string) => void
  placeholder?: string
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function CustomDatePicker({ value, onChange, placeholder = 'Select date' }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  
  // Track the currently viewed month/year in the calendar
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const d = new Date(value)
      if (!isNaN(d.getTime())) return d
    }
    return new Date()
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const calendarHeight = 350 // approximate height of the calendar
      
      if (spaceBelow < calendarHeight && rect.top > calendarHeight) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }

      if (value) {
        const d = new Date(value)
        if (!isNaN(d.getTime())) setViewDate(d)
      } else {
        setViewDate(new Date())
      }
    }
  }, [isOpen, value])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    onChange(`${yyyy}-${mm}-${dd}`)
    setIsOpen(false)
  }

  const setToday = () => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    onChange(`${yyyy}-${mm}-${dd}`)
    setIsOpen(false)
  }

  const clearDate = () => {
    onChange('')
    setIsOpen(false)
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Generate grid cells
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: value ? 'var(--text-main)' : 'var(--text-muted)',
          fontSize: '0.95rem',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(0, 240, 255, 0.2)' : 'none',
          borderColor: isOpen ? 'var(--cyan)' : 'var(--border)',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={16} color="var(--text-muted)" />
          <span>{value || placeholder}</span>
        </div>
        {value && (
          <div 
            onClick={(e) => { e.stopPropagation(); onChange('') }}
            style={{ padding: '2px', cursor: 'pointer', opacity: 0.6 }}
          >
            <X size={14} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: dropdownPosition === 'bottom' ? 'calc(100% + 0.5rem)' : 'auto',
              bottom: dropdownPosition === 'top' ? 'calc(100% + 0.5rem)' : 'auto',
              left: 0,
              background: '#0b0f19', // Solid dark background matching --bg-surface-sunken
              border: '1px solid var(--border-strong)',
              borderRadius: '12px',
              padding: '1rem',
              zIndex: 9999, // Very high z-index to ensure it is above everything
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              width: '280px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button 
                type="button"
                onClick={handlePrevMonth}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '0.25rem' }}
              >
                <ChevronLeft size={20} />
              </button>
              <strong style={{ fontSize: '0.95rem' }}>{MONTHS[month]} {year}</strong>
              <button 
                type="button"
                onClick={handleNextMonth}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '0.25rem' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '0.5rem' }}>
              {DAYS_OF_WEEK.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {d}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {blanks.map(b => (
                <div key={`blank-${b}`} />
              ))}
              {days.map(d => {
                const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                const isSelected = value === currentDateStr
                
                const today = new Date()
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

                return (
                  <button
                    key={`day-${d}`}
                    type="button"
                    onClick={() => handleSelectDate(d)}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--cyan)' : isToday ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                      color: isSelected ? '#000' : isToday ? 'var(--cyan)' : 'var(--text-main)',
                      border: 'none',
                      fontWeight: isSelected || isToday ? 700 : 400
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(0, 240, 255, 0.1)' : 'transparent'
                    }}
                  >
                    {d}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <button 
                type="button"
                onClick={clearDate}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
              >
                Clear
              </button>
              <button 
                type="button"
                onClick={setToday}
                style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, padding: '0.25rem 0.5rem' }}
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
