import { useQuery } from '@tanstack/react-query'
import { Category, Brand, Condition, Location, Model, Type, Size, ListingStatus } from '@/types'
import { fetchListing } from '@/lib/api/listings'
import { queryKeys } from '@/lib/react-query/keys'

interface UseListingDataProps {
  listingId?: string
  enabled?: boolean
}

interface ListingFormData {
  title: string
  description: string
  price: string
  brand: Brand | ""
  size: Size | ""
  condition: Condition | ""
  location: Location | ""
  model: Model | ""
  type: Type | ""
  year: string
  mileage: string
  engineSize: string
  category: Category | ""
  status: ListingStatus | ""
  images: string[]
}

export function useListingData({ listingId, enabled = true }: UseListingDataProps) {
  return useQuery({
    queryKey: queryKeys.listings.detail(listingId || ''),
    queryFn: async () => {
      if (!listingId) {
        throw new Error('Listing ID is required')
      }

      const listing = await fetchListing(listingId)

      const formData: ListingFormData = {
        title: listing.title || "",
        description: listing.description,
        price: listing.price.toString(),
        brand: listing.brand,
        size: listing.size || "",
        condition: listing.condition,
        location: listing.location,
        model: (listing.motorcycle?.model || "") as Model | "",
        type: (listing.motorcycle?.type || "") as Type | "",
        year: listing.motorcycle?.year?.toString() || "",
        mileage: listing.motorcycle?.mileage?.toString() || "",
        engineSize: listing.motorcycle?.engineSize?.toString() || "",
        category: listing.category,
        status: listing.status,
        images: listing.images.map((img) => img.url),
      }

      return formData
    },
    enabled: enabled && !!listingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
