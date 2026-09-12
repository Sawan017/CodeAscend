import React, { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export interface Option {
  value: string
  label: string
}

export interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  style?: React.CSSProperties
  className?: string
  menuMaxHeight?: string
  disabled?: boolean
}

export function CustomSelect({ options, value, onChange, placeholder = 'Select an option', label, style, className, menuMaxHeight = '250px', disabled = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({})
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  const selectedOption = options.find((opt) => opt.value === value)
  const selectedIndex = options.findIndex((opt) => opt.value === value)

  const updatePosition = () => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const topSpace = rect.top
      const bottomSpace = window.innerHeight - rect.bottom
      
      const isBottom = bottomSpace < 250 && topSpace > bottomSpace
      
      setMenuStyles({
        position: 'fixed',
        top: isBottom ? 'auto' : rect.bottom + 8,
        bottom: isBottom ? window.innerHeight - rect.top + 8 : 'auto',
        left: rect.left,
        width: rect.width,
        background: 'var(--bg-panel, #10121b)',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        padding: '0.5rem 0',
        zIndex: 9999999, // Extremely high z-index to beat any modal
        boxShadow: 'var(--shadow-lg, 0 10px 40px rgba(0,0,0,0.5))',
        maxHeight: menuMaxHeight,
        overflowY: 'auto'
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      
      // Initialize focused index to selected item
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedInsideButton = containerRef.current?.contains(target)
      const clickedInsideMenu = menuRef.current?.contains(target)
      
      if (!clickedInsideButton && !clickedInsideMenu) {
        setIsOpen(false)
      }
    }
    
    // Use true for capture phase to ensure it runs before other events stop propagation
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return
    
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      containerRef.current?.querySelector('button')?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (focusedIndex >= 0 && focusedIndex < options.length) {
        onChange(options[focusedIndex].value)
        setIsOpen(false)
        containerRef.current?.querySelector('button')?.focus()
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  const handleSelect = (val: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(val)
    setIsOpen(false)
  }

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: menuStyles.bottom !== 'auto' ? 5 : -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: menuStyles.bottom !== 'auto' ? 5 : -5 }}
          transition={{ duration: 0.15 }}
          style={menuStyles}
          onMouseDown={(e) => {
            // Prevent taking focus away from button, so we can still type/navigate
            e.preventDefault() 
            e.stopPropagation()
          }}
        >
          {options.map((opt, idx) => (
            <div
              key={opt.value}
              onMouseDown={(e) => handleSelect(opt.value, e)}
              onClick={(e) => handleSelect(opt.value, e)}
              style={{
                padding: '0.65rem 1rem',
                cursor: 'pointer',
                color: opt.value === value ? 'var(--cyan)' : 'var(--text-main)',
                background: idx === focusedIndex ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.1s',
                fontSize: '0.95rem',
                fontWeight: opt.value === value ? 600 : 400
              }}
              onMouseEnter={() => setFocusedIndex(idx)}
            >
              {opt.label}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )

  let portalTarget = null
  if (typeof document !== 'undefined') {
    portalTarget = document.getElementById('app-shell-root') || document.body
  }

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', minWidth: '120px', ...style }}>
      {label && <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</label>}
      
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!disabled) setIsOpen(!isOpen)
        }}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 1rem',
          background: disabled ? 'var(--bg-surface-sunken)' : 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: disabled ? 'var(--text-muted)' : (selectedOption ? 'var(--text-main)' : 'var(--text-muted)'),
          fontSize: '0.95rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(0, 240, 255, 0.2)' : 'none',
          borderColor: isOpen ? 'var(--cyan)' : 'var(--border)',
          transition: 'all 0.2s',
          opacity: disabled ? 0.7 : 1
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} color="var(--text-muted)" />
        </motion.div>
      </button>

      {portalTarget ? createPortal(menuContent, portalTarget) : menuContent}
    </div>
  )
}
