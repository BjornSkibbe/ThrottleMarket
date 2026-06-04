// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { escapeHtml, stripHtml, sanitizeContent } from './sanitize'

describe('escapeHtml', () => {
  it('escapes HTML tags', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    )
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes single quotes and backticks', () => {
    expect(escapeHtml("'onclick=`alert(1)`'")).toBe(
      '&#x27;onclick=&#x60;alert(1)&#x60;&#x27;'
    )
  })

  it('does not alter plain text', () => {
    expect(escapeHtml('Hello world')).toBe('Hello world')
  })

  it('escapes forward slashes', () => {
    expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;')
  })
})

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<b>bold</b>')).toBe('bold')
  })

  it('returns plain text unchanged', () => {
    expect(stripHtml('plain text')).toBe('plain text')
  })
})

describe('sanitizeContent', () => {
  it('escapes and trims content', () => {
    expect(sanitizeContent('  <img src=x onerror=alert(1)>  ')).toBe(
      '&lt;img src=x onerror=alert(1)&gt;'
    )
  })

  it('handles normal messages', () => {
    expect(sanitizeContent('Hey, is this still available?')).toBe(
      'Hey, is this still available?'
    )
  })
})
