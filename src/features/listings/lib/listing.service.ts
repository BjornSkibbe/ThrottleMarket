/**
 * Listing Service
 * 
 * Business logic layer for listing operations.
 * This layer contains business rules, validation, and orchestrates repository calls.
 */

import { listingRepository, PaginatedResult } from './listing.repository'
import { ListingData, ListingFilters, Category, Brand, Condition, Location, Size, Type, Model, ListingStatus } from '@/types'
import { Listing as PrismaListing } from '@prisma/client'
import { DatabaseError, DatabaseErrorCode, ValidationError, ValidationErrorCode } from '@/lib/errors'
import { logErrorWithStrategy } from '@/lib/logger/server'
import { sanitizeContent } from '@/lib/sanitize'

export interface CreateListingInput {
  title: string
  description: string
  price: number
  category: Category
  brand: Brand
  condition: Condition
  location: Location
  size?: Size | null
  images?: { url: string; order: number }[]
  motorcycle?: {
    model: Model
    type: Type
    year: number
    mileage?: number
    engineSize?: number
  }
}

export interface UpdateListingInput {
  title?: string
  description?: string
  price?: number
  category?: Category
  brand?: Brand
  condition?: Condition
  location?: Location
  size?: Size | null
  images?: { url: string; order: number }[]
  status?: ListingStatus
  motorcycle?: {
    model?: Model
    type?: Type
    year?: number
    mileage?: number
    engineSize?: number
  }
}

/**
 * Listing Service Class
 */
export class ListingService {
  /**
   * Get a listing by ID
   */
  async getListingById(id: string) {
    try {
      const listing = await listingRepository.findById(id)
      
      if (!listing) {
        throw new DatabaseError('Listing not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }
      
      return listing
    } catch (error) {
      logErrorWithStrategy(error, { action: 'get_listing', listingId: id })
      throw error
    }
  }

  /**
   * Get listings with filters and pagination
   */
  async getListings(
    filters: ListingFilters = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResult<PrismaListing>> {
    try {
      return await listingRepository.findMany(filters, pagination)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'get_listings', filters })
      throw error
    }
  }

  /**
   * Get listings by seller ID
   */
  async getListingsBySellerId(
    sellerId: string,
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResult<PrismaListing>> {
    try {
      return await listingRepository.findBySellerId(sellerId, pagination)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'get_seller_listings', sellerId })
      throw error
    }
  }

  /**
   * Create a new listing
   */
  async createListing(data: CreateListingInput, sellerId: string) {
    try {
      // Business validation
      if (data.price <= 0) {
        throw new ValidationError('Price must be greater than 0', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.price > 1000000) {
        throw new ValidationError('Price exceeds maximum allowed value', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.description.length < 10) {
        throw new ValidationError('Description must be at least 10 characters', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.description.length > 5000) {
        throw new ValidationError('Description exceeds maximum length', ValidationErrorCode.INVALID_RANGE)
      }

      // Create listing through repository
      return await listingRepository.create({
        title: sanitizeContent(data.title),
        description: sanitizeContent(data.description),
        price: data.price,
        category: data.category,
        brand: data.brand,
        condition: data.condition,
        location: data.location,
        sellerId,
        status: 'ACTIVE',
        size: data.size,
        images: data.images,
        motorcycle: data.motorcycle ? {
          model: data.motorcycle.model,
          type: data.motorcycle.type,
          year: data.motorcycle.year,
          mileage: data.motorcycle.mileage || 0,
          engineSize: data.motorcycle.engineSize || 0,
        } : undefined,
      })
    } catch (error) {
      logErrorWithStrategy(error, { action: 'create_listing', sellerId })
      throw error
    }
  }

  /**
   * Update a listing
   */
  async updateListing(id: string, data: UpdateListingInput, sellerId: string) {
    try {
      // Check if listing exists and belongs to seller
      const existingListing = await listingRepository.findById(id)
      
      if (!existingListing) {
        throw new DatabaseError('Listing not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }

      if (existingListing.sellerId !== sellerId) {
        throw new ValidationError('You do not have permission to update this listing', ValidationErrorCode.BUSINESS_RULE_VIOLATION)
      }

      // Business validation
      if (data.price !== undefined && data.price <= 0) {
        throw new ValidationError('Price must be greater than 0', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.price !== undefined && data.price > 1000000) {
        throw new ValidationError('Price exceeds maximum allowed value', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.description !== undefined && data.description.length < 10) {
        throw new ValidationError('Description must be at least 10 characters', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.description !== undefined && data.description.length > 5000) {
        throw new ValidationError('Description exceeds maximum length', ValidationErrorCode.INVALID_RANGE)
      }

      // Update listing through repository
      return await listingRepository.update(id, {
        title: data.title !== undefined ? sanitizeContent(data.title) : undefined,
        description: data.description !== undefined ? sanitizeContent(data.description) : undefined,
        price: data.price,
        category: data.category,
        brand: data.brand,
        condition: data.condition,
        location: data.location,
        size: data.size,
        images: data.images,
        status: data.status,
        motorcycle: data.motorcycle ? {
          model: data.motorcycle.model,
          type: data.motorcycle.type,
          year: data.motorcycle.year,
          mileage: data.motorcycle.mileage || 0,
          engineSize: data.motorcycle.engineSize || 0,
        } : undefined,
      })
    } catch (error) {
      logErrorWithStrategy(error, { action: 'update_listing', listingId: id, sellerId })
      throw error
    }
  }

  /**
   * Delete a listing
   */
  async deleteListing(id: string, sellerId: string) {
    try {
      // Check if listing exists and belongs to seller
      const existingListing = await listingRepository.findById(id)
      
      if (!existingListing) {
        throw new DatabaseError('Listing not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }

      if (existingListing.sellerId !== sellerId) {
        throw new ValidationError('You do not have permission to delete this listing', ValidationErrorCode.BUSINESS_RULE_VIOLATION)
      }

      // Delete listing through repository
      await listingRepository.delete(id)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'delete_listing', listingId: id, sellerId })
      throw error
    }
  }

  /**
   * Count listings with filters
   */
  async countListings(filters: ListingFilters = {}): Promise<number> {
    try {
      return await listingRepository.count(filters)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'count_listings', filters })
      throw error
    }
  }
}

// Export singleton instance
export const listingService = new ListingService()
