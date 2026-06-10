import { Location, Category, Condition, Brand, Type, Model } from "@/types"

export interface DashboardListing {
  id: string
  title: string | null
  description: string
  category: Category
  price: number
  brand: Brand
  condition: Condition
  location: Location
  status: string
  createdAt: Date
  seller: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  images: {
    id: string
    url: string
    order: number
    listingId: string
  }[]
  motorcycle?: {
    mileage: number | null
    year: number | null
    model: Model
    type: Type
    engineSize: number | null
  } | null
}

export interface MyListingsTableProps {
  listings: DashboardListing[]
  viewCounts?: Record<string, number>
  conversationCounts?: Record<string, number>
}
