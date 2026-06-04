import { describe, it, expect } from 'vitest'
import {
  createListingSchema,
  updateListingSchema,
  listingIdSchema,
  listingFilterSchema,
} from './listing.schema'
import { Category, Brand, Condition, Location, Model, Type, Size } from '@/types'

describe('Listing Schemas', () => {
  const validListing = {
    title: 'Test Listing',
    description: 'This is a test description with enough length',
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

  describe('createListingSchema', () => {
    it('should validate a correct motorcycle listing', () => {
      const result = createListingSchema.safeParse(validListing)
      expect(result.success).toBe(true)
    })

    it('should reject a motorcycle listing without motorcycle details', () => {
      const invalid = { ...validListing, motorcycle: null }
      const result = createListingSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a listing with missing title', () => {
      const invalid = { ...validListing, title: '' }
      const result = createListingSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a listing with negative price', () => {
      const invalid = { ...validListing, price: -1 }
      const result = createListingSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a listing with too many images', () => {
      const invalid = {
        ...validListing,
        images: Array(11).fill({ url: '/test.jpg', order: 0 }),
      }
      const result = createListingSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('updateListingSchema', () => {
    it('should validate a partial update', () => {
      const result = updateListingSchema.safeParse({ price: 6000 })
      expect(result.success).toBe(true)
    })

    it('should validate an empty update', () => {
      const result = updateListingSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })

  describe('listingIdSchema', () => {
    it('should validate a non-empty ID string', () => {
      const result = listingIdSchema.safeParse({ id: 'cm123abc' })
      expect(result.success).toBe(true)
    })

    it('should reject an empty ID', () => {
      const result = listingIdSchema.safeParse({ id: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('listingFilterSchema', () => {
    it('should validate empty filters', () => {
      const result = listingFilterSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should validate filters with valid enums', () => {
      const result = listingFilterSchema.safeParse({
        category: Category.MOTORCYCLE,
        brand: Brand.YAMAHA,
        page: 1,
        limit: 20,
      })
      expect(result.success).toBe(true)
    })
  })
})
