import { Prisma } from '@prisma/client'
import { Category, Brand, Condition, Location, Type, ListingStatus, Size } from '@/types'

export interface MarketplaceFilters {
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  location?: string
  condition?: string
  type?: string
  size?: string
  search?: string
}

export function buildWhereClause(filters: MarketplaceFilters): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: ListingStatus.ACTIVE,
  }

  if (filters.category) {
    where.category = filters.category as Category
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice)
    if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice)
  }

  if (filters.location) {
    where.location = filters.location as Location
  }

  if (filters.condition) {
    where.condition = filters.condition as Condition
  }

  if (filters.size) {
    where.size = filters.size as Size
  }

  if (filters.type) {
    where.motorcycle = { type: filters.type as Type }
  }

  if (filters.brand) {
    where.brand = filters.brand as Brand
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return where
}

export function buildOrderByClause(sortBy: string): Prisma.ListingOrderByWithRelationInput {
  switch (sortBy) {
    case 'price-asc':
      return { price: 'asc' }
    case 'price-desc':
      return { price: 'desc' }
    case 'newest':
    default:
      return { createdAt: 'desc' }
  }
}

export function buildWhereClauseWithoutFilter(
  where: Prisma.ListingWhereInput,
  filterToRemove: keyof MarketplaceFilters
): Prisma.ListingWhereInput {
  const whereWithoutFilter = { ...where }
  
  switch (filterToRemove) {
    case 'category':
      delete whereWithoutFilter.category
      break
    case 'brand':
      delete whereWithoutFilter.brand
      break
    case 'location':
      delete whereWithoutFilter.location
      break
    case 'condition':
      delete whereWithoutFilter.condition
      break
    case 'type':
      delete whereWithoutFilter.motorcycle
      break
    case 'size':
      delete whereWithoutFilter.size
      break
  }
  
  return whereWithoutFilter
}
