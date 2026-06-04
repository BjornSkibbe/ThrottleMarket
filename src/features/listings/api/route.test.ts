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
    getListings: vi.fn(),
    createListing: vi.fn(),
  },
}))

import { GET, POST } from './route'
import { listingService } from '@/features/listings/lib/listing.service'
import { auth } from '@/features/auth/lib/auth'

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

describe('GET /api/listings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with listings and pagination', async () => {
    vi.mocked(listingService.getListings).mockResolvedValue({
      data: [{ id: 'listing-1', title: 'Test Bike' }],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
    } as any)

    const request = new Request('http://localhost/api/listings?page=1&limit=20')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.listings).toHaveLength(1)
    expect(body.pagination.page).toBe(1)
  })

  it('supports userId filter', async () => {
    vi.mocked(listingService.getListings).mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
    } as any)

    const request = new Request('http://localhost/api/listings?userId=user-1')
    await GET(request)

    expect(listingService.getListings).toHaveBeenCalledWith(
      { sellerId: 'user-1' },
      { page: 1, limit: 20 }
    )
  })

  it('returns 500 on service error', async () => {
    vi.mocked(listingService.getListings).mockRejectedValue(new Error('DB error'))

    const request = new Request('http://localhost/api/listings')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to fetch listings')
  })
})

describe('POST /api/listings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)

    const request = new Request('http://localhost/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 201 for valid motorcycle listing', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.createListing).mockResolvedValue({
      id: 'listing-1',
      title: 'Yamaha MT-07',
    } as any)

    const request = new Request('http://localhost/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Yamaha MT-07',
        description: 'Great bike',
        price: 120000,
        category: 'MOTORCYCLE',
        brand: 'YAMAHA',
        condition: 'USED',
        location: 'WESTERN_CAPE',
        size: null,
        images: [{ url: 'https://example.com/image.jpg', order: 0 }],
        motorcycle: {
          model: 'MT07',
          type: 'HYPER_NAKED',
          year: 2021,
          mileage: 5000,
          engineSize: 689,
        },
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.id).toBe('listing-1')
  })

  it('returns 400 for missing required fields', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)

    const request = new Request('http://localhost/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '',
        description: '',
        price: -100,
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it('returns 201 for valid gear listing', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.createListing).mockResolvedValue({
      id: 'listing-2',
      title: 'Alpinestars Gloves',
    } as any)

    const request = new Request('http://localhost/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Alpinestars Gloves',
        description: 'Great condition gloves, barely used on the road.',
        price: 2500,
        category: 'GLOVES',
        brand: 'ALPINESTARS',
        condition: 'USED',
        location: 'WESTERN_CAPE',
        size: 'L',
        images: [{ url: 'https://example.com/gloves.jpg', order: 0 }],
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.id).toBe('listing-2')
  })

  it('returns 500 on service error', async () => {
    vi.mocked(auth).mockResolvedValue(createMockSession('user-1') as any)
    vi.mocked(listingService.createListing).mockRejectedValue(new Error('DB crash'))

    const request = new Request('http://localhost/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Yamaha MT-07',
        description: 'Great bike',
        price: 120000,
        category: 'MOTORCYCLE',
        brand: 'YAMAHA',
        condition: 'USED',
        location: 'WESTERN_CAPE',
        size: null,
        images: [{ url: 'https://example.com/image.jpg', order: 0 }],
        motorcycle: {
          model: 'MT07',
          type: 'HYPER_NAKED',
          year: 2021,
          mileage: 5000,
          engineSize: 689,
        },
      }),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Failed to create listing')
  })
})
