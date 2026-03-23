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
 * Formats a date-only string (YYYY-MM-DD) for display.
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @param timezone - IANA timezone. Uses browser local if omitted.
 * @example formatDateOnly("2026-03-31", "Europe/Madrid") → "Mar 31, 2026"
 */
export function formatDateOnly(dateStr: string, timezone?: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(timezone && { timeZone: timezone }),
  })
}

/**
 * Formats a time range for display.
 * @param startAt - ISO 8601 datetime string (UTC)
 * @param endAt - ISO 8601 datetime string (UTC)
 * @param timezone - IANA timezone. Uses browser local if omitted.
 * @example formatTimeRange("2026-03-31T09:00:00Z", "2026-03-31T11:30:00Z", "Europe/Madrid") → "09:00 AM – 11:30 AM"
 */
export function formatTimeRange(
  startAt: string,
  endAt: string,
  timezone?: string,
): string {
  const start = new Date(startAt)
  const end = new Date(endAt)
  const opts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...(timezone && { timeZone: timezone }),
  }
  return `${start.toLocaleTimeString(undefined, opts)} – ${end.toLocaleTimeString(undefined, opts)}`
}

/**
 * Returns the first and last day of the current month as YYYY-MM-DD strings.
 */
export function getCurrentMonthDateRange(): { fromDate: string; toDate: string } {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10),
  }
}

/**
 * Returns the duration in hours between two ISO datetime strings, rounded to one decimal.
 */
export function getDurationHours(startAt: string, endAt: string): number {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()
  return Math.round((end - start) / (1000 * 60 * 60) * 10) / 10
}
