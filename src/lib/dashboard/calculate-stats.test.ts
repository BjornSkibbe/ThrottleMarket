import { describe, it, expect } from 'vitest'
import { calculateDashboardStats } from './calculate-stats'
import { ListingStatus } from '@prisma/client'

function createMockListing(status: ListingStatus) {
  return {
    id: 'test-id',
    title: 'Test',
    description: 'Test description',
    category: 'MOTORCYCLE' as const,
    price: 1000,
    brand: 'YAMAHA' as const,
    size: null,
    condition: 'NEW' as const,
    location: 'GAUTENG' as const,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerId: 'user-1',
    seller: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@test.com',
      image: null,
      location: 'GAUTENG' as const,
      createdAt: new Date(),
    },
    images: [],
  }
}

describe('calculateDashboardStats', () => {
  it('should categorize active listings correctly', () => {
    const listings = [
      createMockListing(ListingStatus.ACTIVE),
      createMockListing(ListingStatus.ACTIVE),
      createMockListing(ListingStatus.SOLD),
    ]

    const stats = calculateDashboardStats(listings)

    expect(stats.activeListings).toHaveLength(2)
    expect(stats.soldListings).toHaveLength(1)
    expect(stats.draftListings).toHaveLength(0)
  })

  it('should handle empty listings array', () => {
    const stats = calculateDashboardStats([])

    expect(stats.activeListings).toHaveLength(0)
    expect(stats.soldListings).toHaveLength(0)
    expect(stats.draftListings).toHaveLength(0)
  })

  it('should categorize all possible statuses', () => {
    const listings = [
      createMockListing(ListingStatus.ACTIVE),
      createMockListing(ListingStatus.SOLD),
      createMockListing(ListingStatus.PENDING),
      createMockListing(ListingStatus.DRAFT),
    ]

    const stats = calculateDashboardStats(listings)

    expect(stats.activeListings).toHaveLength(1)
    expect(stats.soldListings).toHaveLength(1)
    expect(stats.draftListings).toHaveLength(1)
    // PENDING is not explicitly handled, verify it doesn't crash
    expect(stats.activeListings[0].status).toBe(ListingStatus.ACTIVE)
  })
})
