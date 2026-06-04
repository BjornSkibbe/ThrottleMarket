import { z } from 'zod'
import { Category, Brand, Condition, Location, Type, Size } from '@/types'

export const searchParamsSchema = z.object({
  category: z.enum(Category).optional(),
  brand: z.enum(Brand).optional(),
  location: z.enum(Location).optional(),
  condition: z.enum(Condition).optional(),
  type: z.enum(Type).optional(),
  size: z.enum(Size).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().max(200, 'Search query too long').optional(),
  sortBy: z.enum(['newest', 'price-asc', 'price-desc']).optional(),
  page: z.coerce.number().min(1).optional().default(1),
})

export type ValidatedSearchParams = z.infer<typeof searchParamsSchema>

export function validateSearchParams(params: {
  category?: string
  brand?: string
  location?: string
  condition?: string
  type?: string
  size?: string
  minPrice?: string
  maxPrice?: string
  search?: string
  sortBy?: string
  page?: string
}): ValidatedSearchParams {
  return searchParamsSchema.parse(params)
}
