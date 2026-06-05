import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { Listing } from '@/types'
import { MARKETPLACE_CONSTANTS } from './constants'
import { buildWhereClause, buildOrderByClause, buildWhereClauseWithoutFilter, type MarketplaceFilters } from './query-builder'

export class MarketplaceError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'MarketplaceError'
  }
}

export interface PaginatedListings {
  data: Listing[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function fetchListings(
  filters: MarketplaceFilters,
  sortBy: string = 'newest',
  pagination: { page?: number; limit?: number } = {}
): Promise<PaginatedListings> {
  try {
    const where = buildWhereClause(filters)
    const orderBy = buildOrderByClause(sortBy)
    const page = pagination.page ?? 1
    const limit = pagination.limit ?? MARKETPLACE_CONSTANTS.LISTINGS_PER_PAGE
    const skip = (page - 1) * limit

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              location: true,
              createdAt: true,
            },
          },
          motorcycle: true,
        },
        orderBy,
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
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw new MarketplaceError('Failed to fetch listings', 'FETCH_LISTINGS_ERROR')
  }
}

async function fetchCategoryCounts(where: Prisma.ListingWhereInput) {
  try {
    const whereWithoutCategory = buildWhereClauseWithoutFilter(where, 'category')
    const categoryCounts = await prisma.listing.groupBy({
      by: ['category'],
      where: whereWithoutCategory,
      _count: {
        category: true,
      },
    })

    return categoryCounts.reduce((acc, item) => {
      acc[item.category] = item._count.category
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching category counts:', error)
    return {}
  }
}

async function fetchBrandCounts(where: Prisma.ListingWhereInput) {
  try {
    const whereWithoutBrand = buildWhereClauseWithoutFilter(where, 'brand')
    const brandCounts = await prisma.listing.groupBy({
      by: ['brand'],
      where: whereWithoutBrand,
      _count: {
        brand: true,
      },
    })

    return brandCounts.reduce((acc, item) => {
      acc[item.brand] = item._count.brand
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching brand counts:', error)
    return {}
  }
}

async function fetchLocationCounts(where: Prisma.ListingWhereInput) {
  try {
    const whereWithoutLocation = buildWhereClauseWithoutFilter(where, 'location')
    const locationCounts = await prisma.listing.groupBy({
      by: ['location'],
      where: whereWithoutLocation,
      _count: {
        location: true,
      },
    })

    return locationCounts.reduce((acc, item) => {
      acc[item.location] = item._count.location
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching location counts:', error)
    return {}
  }
}

async function fetchConditionCounts(where: Prisma.ListingWhereInput) {
  try {
    const whereWithoutCondition = buildWhereClauseWithoutFilter(where, 'condition')
    const conditionCounts = await prisma.listing.groupBy({
      by: ['condition'],
      where: whereWithoutCondition,
      _count: {
        condition: true,
      },
    })

    return conditionCounts.reduce((acc, item) => {
      acc[item.condition] = item._count.condition
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching condition counts:', error)
    return {}
  }
}

async function fetchTypeCounts(where: Prisma.ListingWhereInput) {
  try {
    const whereWithoutType = buildWhereClauseWithoutFilter(where, 'type')
    const typeCounts = await prisma.motorcycleDetails.groupBy({
      by: ['type'],
      where: {
        listing: whereWithoutType,
      },
      _count: {
        type: true,
      },
    })

    return typeCounts.reduce<Record<string, number>>((acc, item) => {
      if (item.type) {
        acc[item.type] = item._count.type
      }
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching type counts:', error)
    return {}
  }
}

async function fetchSizeCounts(where: Prisma.ListingWhereInput) {
  try {
    const whereWithoutSize = buildWhereClauseWithoutFilter(where, 'size')
    const sizeCounts = await prisma.listing.groupBy({
      by: ['size'],
      where: whereWithoutSize,
      _count: {
        size: true,
      },
    })

    return sizeCounts.reduce((acc, item) => {
      if (item.size) {
        acc[item.size] = item._count.size
      }
      return acc
    }, {} as Record<string, number>)
  } catch (error) {
    console.error('Error fetching size counts:', error)
    return {}
  }
}

export async function fetchFilterCounts(filters: MarketplaceFilters) {
  const where = buildWhereClause(filters)

  const [categoryCounts, brandCounts, locationCounts, conditionCounts, typeCounts, sizeCounts] = await Promise.all([
    fetchCategoryCounts(where),
    fetchBrandCounts(where),
    fetchLocationCounts(where),
    fetchConditionCounts(where),
    fetchTypeCounts(where),
    fetchSizeCounts(where),
  ])

  return {
    categoryCounts,
    brandCounts,
    locationCounts,
    conditionCounts,
    typeCounts,
    sizeCounts,
  }
}

export function filterOptionsByCounts<T extends Record<string, unknown>>(
  options: T,
  counts: Record<string, number>
): T {
  return Object.fromEntries(
    Object.entries(options).filter(([key]) => counts[key] > 0)
  ) as T
}
