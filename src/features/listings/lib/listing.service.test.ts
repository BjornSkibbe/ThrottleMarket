import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListingService } from './listing.service'
import { listingRepository } from './listing.repository'
import { ValidationError, DatabaseError } from '@/lib/errors'
import { Category, Brand, Condition, Location, Model, Type } from '@/types'

// Mock the repository to isolate service logic
vi.mock('./listing.repository', () => ({
  listingRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findBySellerId: vi.fn(),
    count: vi.fn(),
  },
}))

vi.mock('@/lib/logger/server', () => ({
  logErrorWithStrategy: vi.fn(),
}))

describe('ListingService', () => {
  const service = new ListingService()
  const sellerId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createListing', () => {
    const validInput = {
      title: 'Test Motorcycle',
      description: 'This is a detailed description of the motorcycle',
      price: 5000,
      category: Category.MOTORCYCLE,
      brand: Brand.YAMAHA,
      condition: Condition.NEW,
      location: Location.GAUTENG,
      size: null,
      images: [{ url: '/test.jpg', order: 0 }],
      motorcycle: {
        model: Model.YZF_R3,
        type: Type.SUPERSPORT,
        year: 2023,
        mileage: 1000,
        engineSize: 450,
      },
    }

    it('should create a listing with valid input', async () => {
      vi.mocked(listingRepository.create).mockResolvedValue({ id: 'listing-1' } as any)

      const result = await service.createListing(validInput, sellerId)

      expect(listingRepository.create).toHaveBeenCalled()
      expect(result).toEqual({ id: 'listing-1' })
    })

    it('should reject a listing with zero price', async () => {
      await expect(
        service.createListing({ ...validInput, price: 0 }, sellerId)
      ).rejects.toThrow(ValidationError)
    })

    it('should reject a listing with negative price', async () => {
      await expect(
        service.createListing({ ...validInput, price: -100 }, sellerId)
      ).rejects.toThrow(ValidationError)
    })

    it('should reject a listing with price over 1,000,000', async () => {
      await expect(
        service.createListing({ ...validInput, price: 1_000_001 }, sellerId)
      ).rejects.toThrow(ValidationError)
    })

    it('should reject a listing with description under 10 characters', async () => {
      await expect(
        service.createListing({ ...validInput, description: 'Short' }, sellerId)
      ).rejects.toThrow(ValidationError)
    })

    it('should reject a listing with description over 5000 characters', async () => {
      await expect(
        service.createListing({ ...validInput, description: 'a'.repeat(5001) }, sellerId)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('updateListing', () => {
    const existingListing = {
      id: 'listing-1',
      sellerId,
      title: 'Old Title',
      description: 'Old description here',
      price: 3000,
    }

    beforeEach(() => {
      vi.mocked(listingRepository.findById).mockResolvedValue(existingListing as any)
      vi.mocked(listingRepository.update).mockResolvedValue({ id: 'listing-1' } as any)
    })

    it('should update a listing the seller owns', async () => {
      const result = await service.updateListing('listing-1', { price: 4000 }, sellerId)
      expect(listingRepository.update).toHaveBeenCalled()
      expect(result).toEqual({ id: 'listing-1' })
    })

    it('should reject update from a non-owner', async () => {
      await expect(
        service.updateListing('listing-1', { price: 4000 }, 'different-user')
      ).rejects.toThrow('You do not have permission to update this listing')
    })

    it('should reject update for non-existent listing', async () => {
      vi.mocked(listingRepository.findById).mockResolvedValue(null)

      await expect(
        service.updateListing('missing-id', { price: 4000 }, sellerId)
      ).rejects.toThrow(DatabaseError)
    })

    it('should validate updated price is positive', async () => {
      await expect(
        service.updateListing('listing-1', { price: -1 }, sellerId)
      ).rejects.toThrow(ValidationError)
    })

    it('should validate updated description length', async () => {
      await expect(
        service.updateListing('listing-1', { description: 'Hi' }, sellerId)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('getListingById', () => {
    it('should return a found listing', async () => {
      const mockListing = { id: 'listing-1', title: 'Found' }
      vi.mocked(listingRepository.findById).mockResolvedValue(mockListing as any)

      const result = await service.getListingById('listing-1')
      expect(result).toEqual(mockListing)
    })

    it('should throw DatabaseError when listing not found', async () => {
      vi.mocked(listingRepository.findById).mockResolvedValue(null)

      await expect(service.getListingById('missing')).rejects.toThrow(DatabaseError)
    })
  })
})
