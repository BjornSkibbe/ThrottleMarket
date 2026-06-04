import { describe, it, expect } from 'vitest'
import { createRateLimit, RateLimitPresets } from './rate-limit'

describe('Rate Limiting', () => {
  it('should allow requests within the limit', async () => {
    const rateLimit = createRateLimit({
      windowMs: 60_000,
      maxRequests: 3,
    })

    const req = new Request('http://localhost/api/test')
    const result1 = await rateLimit(req)
    const result2 = await rateLimit(req)
    const result3 = await rateLimit(req)

    expect(result1).toMatchObject({ success: true, remaining: 2 })
    expect(result2).toMatchObject({ success: true, remaining: 1 })
    expect(result3).toMatchObject({ success: true, remaining: 0 })
  })

  it('should reject requests over the limit', async () => {
    const rateLimit = createRateLimit({
      windowMs: 60_000,
      maxRequests: 1,
    })

    const req = new Request('http://localhost/api/test')
    await rateLimit(req)
    const result = await rateLimit(req)

    expect(result).toBeInstanceOf(Response)
    const response = result as Response
    expect(response.status).toBe(429)

    const body = await response.json()
    expect(body.error).toBe('Too many requests')
    expect(response.headers.get('Retry-After')).toBeDefined()
  })

  it('should use AUTH preset for strict limiting', () => {
    expect(RateLimitPresets.AUTH.maxRequests).toBe(5)
    expect(RateLimitPresets.AUTH.windowMs).toBe(15 * 60 * 1000)
  })

  it('should use API preset for moderate limiting', () => {
    expect(RateLimitPresets.API.maxRequests).toBe(100)
    expect(RateLimitPresets.API.windowMs).toBe(15 * 60 * 1000)
  })
})
