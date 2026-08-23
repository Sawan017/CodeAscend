import { validatePassword, STRENGTH_COLORS, STRENGTH_LABELS, type PasswordContext } from '../../lib/passwordValidation'

interface PasswordStrengthProps {
  password: string
  context?: PasswordContext
  showRules?: boolean
  confirmPassword?: string
}

const STRENGTH_DOTS: Record<string, string> = {
  weak: '🔴',
  fair: '🟠',
  good: '🟡',
  strong: '🟢',
}

export function PasswordStrengthIndicator({ password, context, showRules = true, confirmPassword }: PasswordStrengthProps) {
  const result = validatePassword(password, context)

  if (!password) return null

  const strengthColor = STRENGTH_COLORS[result.strength]
  const strengthLabel = STRENGTH_LABELS[result.strength]
  const strengthDot = STRENGTH_DOTS[result.strength]
  const passedCount = result.rules.filter(r => r.passed).length
  const barWidth = `${(passedCount / result.rules.length) * 100}%`

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Strength bar + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px', overflow: 'hidden'
        }}>
          <div style={{
            width: barWidth, height: '100%',
            background: strengthColor,
            borderRadius: '2px',
            transition: 'width 0.3s ease, background 0.3s ease'
          }} />
        </div>
        <span
          style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: strengthColor, letterSpacing: '0.05em',
            minWidth: '70px', textAlign: 'right'
          }}
          aria-label={`Password strength: ${strengthLabel}`}
        >
          {strengthDot} {strengthLabel.toUpperCase()}
        </span>
      </div>

      {/* Rules checklist */}
      {showRules && (
        <div
          role="list"
          aria-label="Password requirements"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.25rem 1rem',
            padding: '0.5rem 0'
          }}
        >
          {result.rules.map(rule => (
            <div
              key={rule.id}
              role="listitem"
              aria-label={`${rule.label}: ${rule.passed ? 'met' : 'not met'}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.7rem',
                color: rule.passed ? '#10b981' : 'rgba(255,255,255,0.4)',
                transition: 'color 0.2s ease'
              }}
            >
              <span aria-hidden="true" style={{ fontSize: '0.75rem' }}>
                {rule.passed ? '✓' : '✗'}
              </span>
              <span>{rule.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Password match indicator */}
      {confirmPassword !== undefined && confirmPassword.length > 0 && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.75rem',
            color: password === confirmPassword ? '#10b981' : '#ef4444',
            paddingTop: '0.25rem'
          }}
          aria-live="polite"
        >
          <span aria-hidden="true">{password === confirmPassword ? '✓' : '✗'}</span>
          <span>{password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}</span>
        </div>
      )}
    </div>
  )
}
