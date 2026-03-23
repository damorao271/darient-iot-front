/** Minutes since midnight; 00:00 = 1440 (end of day) */
export function timeToMinutes(t: string): number {
  if (t === '00:00') return 24 * 60
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function isTimeAfter(a: string, b: string): boolean {
  return timeToMinutes(a) < timeToMinutes(b)
}

/** Generate HH:mm options with 30-min steps; 12h format for label */
function formatTimeLabel(value: string): string {
  const [h, m] = value.split(':').map(Number)
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`
}

/** Start time: 6am to 11pm (06:00 - 23:00) */
export function getStartTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  for (let h = 6; h <= 23; h++) {
    for (const m of [0, 30]) {
      if (h === 23 && m === 30) break
      const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      options.push({ value, label: formatTimeLabel(value) })
    }
  }
  return options
}

/** End time: 6:30am to 12am (06:30 - 00:00); 00:00 = midnight */
export function getEndTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  for (let h = 6; h <= 23; h++) {
    for (const m of [0, 30]) {
      if (h === 6 && m === 0) continue // skip 06:00, start at 06:30
      const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      options.push({ value, label: formatTimeLabel(value) })
    }
  }
  options.push({ value: '00:00', label: '12:00 AM' })
  return options
}

export const START_TIME_OPTIONS = getStartTimeOptions()
export const END_TIME_OPTIONS = getEndTimeOptions()
