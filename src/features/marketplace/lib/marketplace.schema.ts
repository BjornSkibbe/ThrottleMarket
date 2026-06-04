/**
 * Marketplace Validation Schemas
 * 
 * Zod schemas for marketplace-related data validation (search params, filters, etc.).
 */

import { z } from 'zod'
import { Category, Brand, Condition, Location } from '@/types'

/**
 * Search params schema for marketplace page
 */
export const searchParamsSchema = z.object({
  category: z.enum(Category).optional(),
  brand: z.enum(Brand).optional(),
  condition: z.enum(Condition).optional(),
  location: z.enum(Location).optional(),
  minPrice: z.string().optional().transform((val) => val ? parseInt(val) : undefined).pipe(z.number().positive().optional()),
  maxPrice: z.string().optional().transform((val) => val ? parseInt(val) : undefined).pipe(z.number().positive().optional()),
  search: z.string().optional(),
  page: z.string().default('1').transform((val) => parseInt(val)).pipe(z.number().int().positive()),
  limit: z.string().default('20').transform((val) => parseInt(val)).pipe(z.number().int().positive().max(100)),
})

/**
 * Marketplace filter schema
 */
export const marketplaceFilterSchema = z.object({
  category: z.enum(Category).optional(),
  brand: z.enum(Brand).optional(),
  condition: z.enum(Condition).optional(),
  location: z.enum(Location).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
})

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

/**
 * Sort schema
 */
export const sortSchema = z.object({
  field: z.enum(['price', 'createdAt', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Type inference from schemas
 */
export type SearchParamsInput = z.infer<typeof searchParamsSchema>
export type MarketplaceFilterInput = z.infer<typeof marketplaceFilterSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SortInput = z.infer<typeof sortSchema>
