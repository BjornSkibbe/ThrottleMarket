import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerHandler } from './route'

// We test the inner handler directly since the exported POST is wrapped with rate limiting
// This validates the core business logic: validation, duplicate checking, and user creation

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed-password')),
  },
}))

vi.mock('@/lib/logger/server', () => ({
  logErrorWithStrategy: vi.fn(),
}))

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

describe('Auth Register API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createRequest(body: object): Request {
    return new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('should create a user with valid data', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    } as any)

    const req = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
    })

    const res = await registerHandler(req)
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.message).toBe('User created successfully')
    expect(json.userId).toBe('user-123')
    expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 12)
  })

  it('should reject duplicate email', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'existing-user',
      email: 'john@example.com',
    } as any)

    const req = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
    })

    const res = await registerHandler(req)
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.error.code).toBe('BUSINESS_RULE_VIOLATION')
  })

  it('should reject invalid email', async () => {
    const req = createRequest({
      name: 'John Doe',
      email: 'not-an-email',
      password: 'Password123',
    })

    const res = await registerHandler(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe('ZOD_VALIDATION_ERROR')
  })

  it('should reject weak password', async () => {
    const req = createRequest({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'weak',
    })

    const res = await registerHandler(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe('ZOD_VALIDATION_ERROR')
  })
})
