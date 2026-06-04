// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/features/auth/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/middleware/csrf', () => ({
  withCSRFProtection: (handler: any) => handler,
}))

vi.mock('@/lib/middleware/rate-limit', () => ({
  withRateLimit: (_config: any, handler: any) => handler,
  RateLimitPresets: {
    AUTH: { windowMs: 60000, maxRequests: 5 },
    API: { windowMs: 60000, maxRequests: 100 },
    PUBLIC: { windowMs: 60000, maxRequests: 1000 },
  },
}))

vi.mock('@/lib/logger/server', () => ({
  logErrorWithStrategy: vi.fn(),
}))

vi.mock('@/features/listings/lib/listing.service', () => ({
  listingService: {
    getListingById: vi.fn(),
    updateListing: vi.fn(),
    deleteListing: vi.fn(),
  },
}))

import { GET, PATCH, DELETE } from './route'
import { listingService } from '@/features/listings/lib/listing.service'
import { auth } from '@/features/auth/lib/auth'
import { DatabaseError, DatabaseErrorCode } from '@/lib/errors'
import { ValidationError, ValidationErrorCode } from '@/lib/errors'

function createMockSession(userId: string) {
  return {
    user: {
      id: userId,
      email: 'user@example.com',
      name: 'Test User',
      image: null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

function createParams(id: string) {
  return Promise.resolve({ id })
}

describe('GET /api/listings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 for existing listing', async () => {
    vi.mocked(listingService.getListingById).mockResolvedValue({
      id: 'listing-1',
      title: 'Test Bike',
    } as any)

    const request = new Request('http://localhost/api/listings/listing-1')
    const response = await GET(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe('listing-1')
  })

  it('returns 500 on service error', async () => {
    vi.mocked(listingService.getListingById).mockRejectedValue(new Error('DB error'))

    const request = new Request('http://localhost/api/listings/listing-1')
    const response = await GET(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to fetch listing')
  })

  it('returns 500 when listing not found', async () => {
    vi.mocked(listingService.getListingById).mockRejectedValue(
      new DatabaseError('Listing not found', DatabaseErrorCode.RECORD_NOT_FOUND)
    )

    const request = new Request('http://localhost/api/listings/nonexistent')
    const response = await GET(request, { params: createParams('nonexistent') })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to fetch listing')
  })
})

describe('PATCH /api/listings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    })

    const response = await PATCH(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 200 for valid update', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.updateListing).mockResolvedValue({
      id: 'listing-1',
      title: 'Updated Bike',
    } as any)

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Updated Bike',
        description: 'Updated description',
        price: 130000,
        category: 'MOTORCYCLE',
        brand: 'YAMAHA',
        condition: 'USED',
        location: 'WESTERN_CAPE',
        size: null,
        images: [{ url: 'https://example.com/image.jpg', order: 0 }],
      }),
    })

    const response = await PATCH(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.title).toBe('Updated Bike')
  })

  it('returns 400 for invalid update data', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: -100,
      }),
    })

    const response = await PATCH(request, { params: createParams('listing-1') })

    expect(response.status).toBe(400)
  })

  it('returns 500 when listing not found', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.updateListing).mockRejectedValue(
      new DatabaseError('Listing not found', DatabaseErrorCode.RECORD_NOT_FOUND)
    )

    const request = new Request('http://localhost/api/listings/nonexistent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    })

    const response = await PATCH(request, { params: createParams('nonexistent') })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to update listing')
  })

  it('returns 400 when user does not own the listing', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-2') as any)
    vi.mocked(listingService.updateListing).mockRejectedValue(
      new ValidationError(
        'You do not have permission to update this listing',
        ValidationErrorCode.BUSINESS_RULE_VIOLATION
      )
    )

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    })

    const response = await PATCH(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('You do not have permission to update this listing')
  })

  it('returns 500 on unexpected service error', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.updateListing).mockRejectedValue(new Error('DB crash'))

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    })

    const response = await PATCH(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to update listing')
  })
})

describe('DELETE /api/listings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await DELETE(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 200 for successful deletion', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.deleteListing).mockResolvedValue(undefined)

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await DELETE(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
  })

  it('returns 500 when listing not found', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.deleteListing).mockRejectedValue(
      new DatabaseError('Listing not found', DatabaseErrorCode.RECORD_NOT_FOUND)
    )

    const request = new Request('http://localhost/api/listings/nonexistent', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await DELETE(request, { params: createParams('nonexistent') })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to delete listing')
  })

  it('returns 400 when user does not own the listing', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-2') as any)
    vi.mocked(listingService.deleteListing).mockRejectedValue(
      new ValidationError(
        'You do not have permission to delete this listing',
        ValidationErrorCode.BUSINESS_RULE_VIOLATION
      )
    )

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await DELETE(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('You do not have permission to delete this listing')
  })

  it('returns 500 on unexpected service error', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.deleteListing).mockRejectedValue(new Error('DB crash'))

    const request = new Request('http://localhost/api/listings/listing-1', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await DELETE(request, { params: createParams('listing-1') })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to delete listing')
  })
})
