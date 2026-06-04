/**
 * Listing Validation Schemas
 * 
 * Zod schemas for listing-related data validation.
 */

import { z } from 'zod'
import { Category, Brand, Condition, Location, Model, Type, Size, ListingStatus } from '@/types'

/**
 * Base listing schema with common fields
 */
const baseListingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  price: z.number().positive('Price must be positive').max(1000000, 'Price must be less than 1,000,000'),
  category: z.enum(Category),
  brand: z.enum(Brand),
  condition: z.enum(Condition),
  location: z.enum(Location),
})

/**
 * Motorcycle details schema
 */
const motorcycleDetailsSchema = z.object({
  model: z.enum(Model),
  type: z.enum(Type),
  year: z.number().int('Year must be an integer').min(1990, 'Year must be at least 1990').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  mileage: z.number().int('Mileage must be an integer').min(0, 'Mileage cannot be negative').max(500000, 'Mileage must be less than 500,000'),
  engineSize: z.number().int('Engine size must be an integer').min(50, 'Engine size must be at least 50cc').max(3000, 'Engine size must be less than 3000cc'),
})

/**
 * Image schema
 */
const imageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  order: z.number().int('Order must be an integer').min(0, 'Order cannot be negative'),
})

/**
 * Size schema (only for gear categories)
 */
const sizeSchema = z.enum(Size).nullable()

const gearCategories = ['HELMET', 'JACKET', 'PANTS', 'GLOVES', 'BOOTS'] as const

/**
 * Listing fields without cross-field refinements (safe to .partial() in Zod 4)
 */
const listingFieldsSchema = baseListingSchema.extend({
  size: sizeSchema,
  images: z.array(imageSchema).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  motorcycle: motorcycleDetailsSchema.nullable().optional(),
  status: z.enum(ListingStatus).optional(),
})

type ListingRefinementData = {
  category?: Category
  size?: z.infer<typeof sizeSchema>
  motorcycle?: z.infer<typeof motorcycleDetailsSchema> | null
}

function withListingRefinements<T extends z.ZodType<ListingRefinementData>>(schema: T) {
  return schema
    .refine(
      (data) => {
        if (!data.category) return true
        if (gearCategories.includes(data.category as (typeof gearCategories)[number])) {
          return data.size != null
        }
        return true
      },
      {
        message: 'Size is required for gear categories',
        path: ['size'],
      }
    )
    .refine(
      (data) => {
        if (data.category !== Category.MOTORCYCLE) return true
        return data.motorcycle != null
      },
      {
        message: 'Motorcycle details are required for motorcycle listings',
        path: ['motorcycle'],
      }
    )
}

/**
 * Full listing schema for creation
 */
export const createListingSchema = withListingRefinements(listingFieldsSchema)

/**
 * Update listing schema (all fields optional, no cross-field refinements)
 */
export const updateListingSchema = listingFieldsSchema.partial()

/**
 * Listing ID schema
 */
export const listingIdSchema = z.object({
  id: z.string().min(1, 'Listing ID is required'),
})

/**
 * Listing filter schema
 */
export const listingFilterSchema = z.object({
  category: z.enum(Category).optional(),
  brand: z.enum(Brand).optional(),
  condition: z.enum(Condition).optional(),
  location: z.enum(Location).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

/**
 * Form schema (string-based for UI form state)
 * Use this for client-side form validation before transforming to API schema.
 */
export const listingFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required'),
  category: z.enum(Category),
  brand: z.enum(Brand),
  condition: z.enum(Condition),
  location: z.enum(Location),
  images: z.array(
    z.string().refine(
      (val) => val.startsWith('/') || z.string().url().safeParse(val).success,
      'Image must be a valid URL or relative path'
    )
  ).min(1, 'At least one image is required'),
  model: z.string().optional(),
  type: z.string().optional(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  engineSize: z.string().optional(),
  status: z.enum(ListingStatus).optional(),
}).refine(
  (data) => {
    if (data.category === 'MOTORCYCLE') {
      return !!data.model && !!data.type && !!data.year && !!data.mileage && !!data.engineSize
    }
    return true
  },
  {
    message: 'Model, type, year, mileage, and engine size are required for motorcycles',
    path: ['model'],
  }
)

/**
 * Type inference from schemas
 */
export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
export type ListingIdInput = z.infer<typeof listingIdSchema>
export type ListingFilterInput = z.infer<typeof listingFilterSchema>
export type ListingFormData = z.infer<typeof listingFormSchema>
