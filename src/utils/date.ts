/**
 * Parses an ISO datetime string as UTC.
 * If the string has no timezone (e.g. "2025-03-22T18:30:00"), appends "Z" so it's interpreted as UTC.
 */
function parseAsUTC(isoString: string): Date {
  const hasTimezone = /Z$|[-+]\d{2}:?\d{2}$/.test(isoString.trim())
  return new Date(hasTimezone ? isoString : isoString + 'Z')
}

/**
 * Formats a datetime range for display (e.g. reservations, appointments).
 * Parses UTC datetimes from the API and converts to the given timezone using Intl.
 *
 * @param startAt - ISO 8601 datetime string (UTC)
 * @param endAt - ISO 8601 datetime string (UTC)
 * @param timezone - IANA timezone (e.g. "Europe/Madrid"). Uses browser local if omitted.
 * @example formatDateTimeRange("2025-03-22T18:30:00Z", "2025-03-22T20:00:00Z", "Europe/Madrid") → "Mar 22, 07:30 PM – 09:00 PM"
 */
export function formatDateTimeRange(
  startAt: string,
  endAt: string,
  timezone?: string,
): string {
  const start = parseAsUTC(startAt)
  const end = parseAsUTC(endAt)
  const opts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(timezone && { timeZone: timezone }),
  }
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(timezone && { timeZone: timezone }),
  }
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleTimeString(undefined, timeOpts)}`
}

/**
 * Returns the duration in hours between two ISO datetime strings, rounded to one decimal.
 */
export function getDurationHours(startAt: string, endAt: string): number {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()
  return Math.round((end - start) / (1000 * 60 * 60) * 10) / 10
}
