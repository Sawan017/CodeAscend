import React from 'react'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: number | string
  isOnline?: boolean
  showStatus?: boolean
  style?: React.CSSProperties
}

export function Avatar({ src, alt, size = 48, isOnline, showStatus = false, style }: AvatarProps) {
  const sizePx = typeof size === 'number' ? `${size}px` : size

  // Discord-style default background
  const defaultBg = '#313338' // Discord dark gray background for default avatars
  const defaultColor = '#dbdee1' // Discord light icon color

  return (
    <div style={{ width: sizePx, height: sizePx, position: 'relative', flexShrink: 0, borderRadius: '50%', ...style }}>
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: src ? 'var(--surface)' : defaultBg
        }}
      >
        {src ? (
          <img src={src} alt={alt || 'Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <User size={typeof size === 'number' ? size * 0.55 : '55%'} color={defaultColor} fill={defaultColor} strokeWidth={1} />
        )}
      </div>
      
      {showStatus && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            right: 0, 
            transform: 'translate(15%, 15%)',
            width: typeof size === 'number' ? `${Math.max(12, size * 0.28)}px` : '14px', 
            height: typeof size === 'number' ? `${Math.max(12, size * 0.28)}px` : '14px', 
            background: isOnline ? '#23a559' : '#80848e', // Discord online green or offline gray
            borderRadius: '50%', 
            border: '2px solid var(--surface-sunken)', 
            zIndex: 10 
          }} 
          title={isOnline ? "Online" : "Offline"} 
        />
      )}
    </div>
  )
}
