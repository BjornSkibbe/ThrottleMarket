import { vi } from 'vitest'

vi.mock('@/lib/middleware/csrf', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withCSRFProtection: (handler: any) => handler,
  getCSRFToken: vi.fn().mockResolvedValue('mock-csrf-token'),
  validateCSRFToken: vi.fn().mockResolvedValue(true),
  createCSRFProtection: vi.fn().mockReturnValue(vi.fn().mockResolvedValue(true)),
}))

vi.mock('@/lib/middleware/rate-limit', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withRateLimit: (_config: any, handler: any) => handler,
  RateLimitPresets: {
    AUTH: { windowMs: 60000, maxRequests: 5 },
    API: { windowMs: 60000, maxRequests: 100 },
    PUBLIC: { windowMs: 60000, maxRequests: 1000 },
  },
}))
