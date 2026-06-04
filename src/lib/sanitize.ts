/**
 * Lightweight HTML sanitization utilities.
 * Escapes characters that could be interpreted as HTML/JS to prevent XSS.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
}

const ESCAPE_REGEX = /[&<>"'`/]/g

/**
 * Escape HTML characters in a string so it renders safely as plain text.
 */
export function escapeHtml(input: string): string {
  return input.replace(ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char] ?? char)
}

/**
 * Strip all HTML tags from a string, returning plain text.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize user-generated content for safe storage and display.
 * Escapes HTML entities to prevent script injection while preserving text.
 */
export function sanitizeContent(input: string): string {
  return escapeHtml(input.trim())
}
