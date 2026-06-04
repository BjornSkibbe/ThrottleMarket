/**
 * Listing Repository
 * 
 * Data access layer for listing-related database operations.
 * This layer abstracts Prisma queries and provides a clean interface for the service layer.
 */

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Listing, ListingFilters, Category, Brand, Condition, Location, ListingStatus, Size, Type, Model } from '@/types'
import { Listing as PrismaListing } from '@prisma/client'

export interface ListingQueryOptions {
  include?: {
    images?: boolean
    seller?: boolean
    motorcycle?: boolean
  }
  orderBy?: {
    field: 'createdAt' | 'price' | 'updatedAt'
    direction: 'asc' | 'desc'
  }
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ExtendedListingFilters extends ListingFilters {
  sellerId?: string
  status?: ListingStatus
}

/**
 * Prisma-generated type for a Listing with images and motorcycle included.
 * Used as the canonical return type for create/update/fetch operations.
 */
export type ListingWithRelations = Prisma.ListingGetPayload<{
  include: {
    images: { orderBy: { order: 'asc' } }
    motorcycle: true
  }
}>

/**
 * Listing Repository Class
 */
export class ListingRepository {
  /**
   * Find a listing by ID
   */
  async findById(
    id: string,
    options: ListingQueryOptions = {}
  ): Promise<PrismaListing | null> {
    const { include = { images: true, seller: true, motorcycle: true } } = options

    return prisma.listing.findUnique({
      where: { id },
      include: {
        images: include.images ? { orderBy: { order: 'asc' } } : false,
        seller: include.seller
          ? {
              select: {
                id: true,
                name: true,
                image: true,
              },
            }
          : false,
        motorcycle: include.motorcycle,
      },
    })
  }

  /**
   * Find multiple listings with filters and pagination
   */
  async findMany(
    filters: ExtendedListingFilters = {},
    pagination: PaginationOptions = {},
    options: ListingQueryOptions = {}
  ): Promise<PaginatedResult<PrismaListing>> {
    const { page = 1, limit = 20 } = pagination
    const { include = { images: true, seller: true, motorcycle: true }, orderBy } = options

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      throw new Error('Invalid pagination parameters')
    }

    const skip = (page - 1) * limit

    // Build where clause from filters
    const where = this.buildWhereClause(filters)

    // Build order by clause
    const orderByClause: Prisma.ListingOrderByWithRelationInput = orderBy
      ? { [orderBy.field]: orderBy.direction }
      : { createdAt: 'desc' }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: include.images ? { orderBy: { order: 'asc' } } : false,
          seller: include.seller
            ? {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              }
            : false,
          motorcycle: include.motorcycle,
        },
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

    return {
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }
  }

  /**
   * Find listings by seller ID
   */
  async findBySellerId(
    sellerId: string,
    pagination: PaginationOptions = {},
    options: ListingQueryOptions = {}
  ): Promise<PaginatedResult<PrismaListing>> {
    return this.findMany({ sellerId }, pagination, options)
  }

  /**
   * Create a new listing
   */
  async create(data: {
    title: string
    description: string
    price: number
    category: Category
    brand: Brand
    condition: Condition
    location: Location
    sellerId: string
    status?: ListingStatus
    size?: Size | null
    images?: { url: string; order: number }[]
    motorcycle?: {
      model: Model
      type: Type
      year: number
      mileage: number
      engineSize: number
    }
  }): Promise<ListingWithRelations> {
    return prisma.$transaction(async (tx) => {
      const listing = await tx.listing.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          brand: data.brand,
          condition: data.condition,
          location: data.location,
          sellerId: data.sellerId,
          status: data.status || 'ACTIVE',
          size: data.size || null,
        },
      })

      // Create images
      if (data.images && data.images.length > 0) {
        await tx.image.createMany({
          data: data.images.map((img) => ({
            url: img.url,
            order: img.order,
            listingId: listing.id,
          })),
        })
      }

      // Create motorcycle details if provided
      if (data.motorcycle) {
        await tx.motorcycleDetails.create({
          data: {
            ...data.motorcycle,
            type: data.motorcycle.type || 'OTHER',
            listingId: listing.id,
          },
        })
      }

      // Fetch the complete listing with relations
      const result = await tx.listing.findUnique({
        where: { id: listing.id },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          motorcycle: true,
        },
      })

      if (!result) {
        throw new Error('Failed to retrieve created listing')
      }

      return result
    })
  }

  /**
   * Update a listing
   */
  async update(
    id: string,
    data: {
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
  ): Promise<ListingWithRelations> {
    return prisma.$transaction(async (tx) => {
      // Update main listing
      await tx.listing.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          brand: data.brand,
          condition: data.condition,
          location: data.location,
          size: data.size,
          status: data.status,
        },
      })

      // Update images if provided
      if (data.images !== undefined) {
        // Delete existing images
        await tx.image.deleteMany({
          where: { listingId: id },
        })

        // Create new images
        if (data.images.length > 0) {
          await tx.image.createMany({
            data: data.images.map((img) => ({
              url: img.url,
              order: img.order,
              listingId: id,
            })),
          })
        }
      }

      // Upsert motorcycle details if provided
      if (data.motorcycle !== undefined) {
        if (data.motorcycle) {
          await tx.motorcycleDetails.upsert({
            where: { listingId: id },
            create: {
              model: data.motorcycle.model || 'OTHER',
              type: data.motorcycle.type || 'OTHER',
              year: data.motorcycle.year || new Date().getFullYear(),
              mileage: data.motorcycle.mileage || 0,
              engineSize: data.motorcycle.engineSize || 0,
              listingId: id,
            },
            update: {
              model: data.motorcycle.model,
              type: data.motorcycle.type || 'OTHER',
              year: data.motorcycle.year,
              mileage: data.motorcycle.mileage || 0,
              engineSize: data.motorcycle.engineSize || 0,
            },
          })
        } else {
          // Remove motorcycle details if not provided
          await tx.motorcycleDetails.deleteMany({
            where: { listingId: id },
          })
        }
      }

      // Fetch the complete listing with relations
      const result = await tx.listing.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          motorcycle: true,
        },
      })

      if (!result) {
        throw new Error('Failed to retrieve updated listing')
      }

      return result
    })
  }

  /**
   * Delete a listing
   */
  async delete(id: string): Promise<void> {
    await prisma.listing.delete({
      where: { id },
    })
  }

  /**
   * Count listings with filters
   */
  async count(filters: ExtendedListingFilters = {}): Promise<number> {
    const where = this.buildWhereClause(filters)
    return prisma.listing.count({ where })
  }

  /**
   * Build where clause from filters
   */
  private buildWhereClause(filters: ExtendedListingFilters) {
    const where: Prisma.ListingWhereInput = {}

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.brand) {
      where.brand = filters.brand
    }

    if (filters.size) {
      where.size = filters.size
    }

    if (filters.type) {
      where.motorcycle = {
        type: filters.type,
      }
    }

    if (filters.condition) {
      where.condition = filters.condition
    }

    if (filters.location) {
      where.location = filters.location
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {}
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice
      }
    }

    if (filters.sellerId) {
      where.sellerId = filters.sellerId
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return where
  }
}

// Export singleton instance
export const listingRepository = new ListingRepository()
