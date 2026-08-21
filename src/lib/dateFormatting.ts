import type { Settings } from '../types'

let currentSettings: Partial<Settings> = {}

export function setDateFormattingSettings(settings: Partial<Settings>) {
  currentSettings = settings
}

function getLocaleForDateFormat(format?: string): string {
  switch (format) {
    case 'DD/MM/YYYY': return 'en-GB'
    case 'YYYY-MM-DD': return 'sv-SE'
    case 'MM/DD/YYYY':
    default:
      return 'en-US'
  }
}

export function formatAppDate(dateInput: string | Date | number): string {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const locale = getLocaleForDateFormat(currentSettings.dateFormat)
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }

  if (currentSettings.timezone && currentSettings.timezone !== 'auto') {
    options.timeZone = currentSettings.timezone
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (e) {
    // Fallback if timezone is invalid
    delete options.timeZone
    return new Intl.DateTimeFormat(locale, options).format(date)
  }
}

export function formatAppTime(dateInput: string | Date | number): string {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: currentSettings.timeFormat === '24h' ? false : true
  }

  if (currentSettings.timezone && currentSettings.timezone !== 'auto') {
    options.timeZone = currentSettings.timezone
  }

  try {
    return new Intl.DateTimeFormat('en-US', options).format(date)
  } catch (e) {
    delete options.timeZone
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }
}

export function formatAppDateTime(dateInput: string | Date | number): string {
  return `${formatAppDate(dateInput)} • ${formatAppTime(dateInput)}`
}
