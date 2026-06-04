import { Brand, Category, Condition, ListingStatus, Location, Model, Size, Type } from '@prisma/client'
export { Brand, Category, Condition, ListingStatus, Location, Model, Size, Type }

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  location: Location | null
  createdAt: Date
}

export interface Listing {
  id: string
  title: string | null
  description: string
  category: Category
  price: number
  brand: Brand
  size: Size | null
  condition: Condition
  location: Location
  status: ListingStatus
  createdAt: Date
  updatedAt: Date
  sellerId: string
  seller: User
  images: Image[]
  motorcycle?: MotorcycleDetails | null
}

// Type for Prisma queries that include relations
export type ListingWithRelations = Listing & {
  seller: User
  images: Image[]
  motorcycle?: MotorcycleDetails
}

export interface Image {
  id: string
  url: string
  order: number
  listingId: string
}

export interface MotorcycleDetails {
  id: string
  model: Model
  type: Type
  year: number
  mileage: number
  engineSize: number
  listingId: string
}

export interface MotorcycleFormData {
  model: Model
  type: Type
  year: number
  mileage: number
  engineSize: number
}

export interface ListingData {
  title: string
  description: string
  price: number
  category: Category | ""
  brand: Brand | ""
  size: Size | null
  condition: Condition | ""
  location: Location | ""
  status?: ListingStatus | ""
  images: { url: string; order: number }[]
  motorcycle?: MotorcycleFormData
}

export interface ApiListingResponse {
  title: string
  description: string
  price: number
  category: Category
  brand: Brand
  size: Size | null
  condition: Condition
  location: Location
  images: Image[]
  motorcycle?: {
    model: Model
    type: Type
    year: number
    mileage: number
    engineSize: number
  }
}

export interface FormState {
  title: string
  description: string
  price: string
  size: Size | ""
  category: Category | ""
  brand: Brand | ""
  condition: Condition | ""
  location: Location | ""
  model: Model | ""
  type: Type | ""
  year: string
  mileage: string
  engineSize: string
  status: ListingStatus | ""
}

export interface Favorite {
  id: string
  userId: string
  listingId: string
  createdAt: Date
}

export interface RecentlyViewed {
  id: string
  userId: string
  listingId: string
  viewedAt: Date
}

export interface ListingFilters {
  category?: Category
  brand?: Brand
  size?: Size
  type?: Type
  minPrice?: number
  maxPrice?: number
  location?: Location
  condition?: Condition
  search?: string
  sortBy?: 'newest' | 'price-asc' | 'price-desc'
}



