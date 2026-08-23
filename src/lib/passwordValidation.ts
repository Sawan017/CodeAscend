/**
 * ARINOVA Password Validation Library
 * 
 * Single centralized validator used by: Signup, Reset Password, Change Password.
 * All validation runs locally — passwords are NEVER sent to external services.
 * Backend (PostgreSQL) independently enforces the same 5 rules.
 */

export interface PasswordContext {
  username?: string
  email?: string
  displayName?: string
}

export interface PasswordValidationResult {
  isValid: boolean
  rules: { id: string; label: string; passed: boolean }[]
  strength: 'weak' | 'fair' | 'good' | 'strong'
}

const PASSWORD_RULES = [
  {
    id: 'minLength',
    label: 'At least 8 characters',
    test: (pw: string) => pw.length >= 8,
  },
  {
    id: 'lowercase',
    label: 'Lowercase letter',
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    id: 'uppercase',
    label: 'Uppercase letter',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    id: 'digit',
    label: 'Number',
    test: (pw: string) => /[0-9]/.test(pw),
  },
  {
    id: 'special',
    label: 'Special character',
    test: (pw: string) => /[^a-zA-Z0-9\s]/.test(pw),
  },
]

export function validatePassword(password: string, _context?: PasswordContext): PasswordValidationResult {
  const results = PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    passed: rule.test(password),
  }))

  const passedCount = results.filter((r) => r.passed).length
  const isValid = passedCount === PASSWORD_RULES.length && password.length > 0

  let strength: 'weak' | 'fair' | 'good' | 'strong'
  if (passedCount === PASSWORD_RULES.length) {
    strength = 'strong'
  } else if (passedCount >= 4) {
    strength = 'good'
  } else if (passedCount >= 2) {
    strength = 'fair'
  } else {
    strength = 'weak'
  }

  return { isValid, rules: results, strength }
}

/**
 * Generic error message safe for display after form submission.
 * Does NOT reveal which specific rule failed to prevent password-guessing.
 */
export function getPasswordError(): string {
  return 'Password does not meet the required security requirements. Please check the requirements below.'
}

export const STRENGTH_COLORS: Record<string, string> = {
  weak: '#ef4444',
  fair: '#f59e0b',
  good: '#eab308',
  strong: '#10b981',
}

export const STRENGTH_LABELS: Record<string, string> = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
}
