const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Returns true if the string is a valid email format.
 */
export function isValidEmail(value: string): boolean {
  if (!value.trim()) return true
  return EMAIL_REGEX.test(value.trim())
}

/**
 * Derives initials from an email address (e.g. "john.doe@example.com" → "JD").
 */
export function getInitials(email: string): string {
  const local = email.split('@')[0]
  if (!local) return '?'
  const parts = local.split(/[._-]/)
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
    ).slice(0, 2)
  }
  return local.slice(0, 2).toUpperCase()
}
