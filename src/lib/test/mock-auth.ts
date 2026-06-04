import { vi } from 'vitest'

export const mockAuthSession = vi.fn()

vi.mock('@/features/auth/lib/auth', () => ({
  auth: () => mockAuthSession(),
}))

export function createMockSession(userId: string, email?: string, name?: string) {
  return {
    user: {
      id: userId,
      email: email || `user-${userId}@example.com`,
      name: name || 'Test User',
      image: null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

export function mockAuthenticated(userId: string, email?: string, name?: string) {
  mockAuthSession.mockResolvedValue(createMockSession(userId, email, name))
}

export function mockUnauthenticated() {
  mockAuthSession.mockResolvedValue(null)
}
