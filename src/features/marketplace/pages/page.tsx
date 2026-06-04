import { Suspense } from "react"
import { MarketplacePageClient } from "@/features/marketplace/components/marketplace-page-client"
import { Listing } from "@/types"
import { fetchListings, fetchFilterCounts, type PaginatedListings } from "@/features/marketplace/lib/marketplace/fetch-listings"
import { validateSearchParams } from "@/features/marketplace/lib/marketplace/validation"
import { ListingCard } from "@/features/listings/components/listing-card"
import { CategoryFilter } from "@/components/category-filter"
import { EmptyState } from "@/components/empty-state"
import { PackageX } from "lucide-react"
import { QueryPreservingPagination } from "@/components/query-preserving-pagination"
import { MARKETPLACE_CONSTANTS } from "@/features/marketplace/lib/marketplace/constants"
import { buildMarketplaceFilters, buildFilteredOptions, buildSidebarProps, createEmptyCounts,
  type FilterCounts
} from "@/features/marketplace/lib/marketplace/page-helpers"
import { logErrorWithStrategy } from "@/lib/logger/strategy"

interface MarketplacePageProps {
  searchParams: Promise<{
    category: string
    brand: string
    minPrice?: string
    maxPrice?: string
    location?: string
    condition?: string
    type: string
    size?: string
    search?: string
    sortBy?: string
    page?: string
  }>
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams
  const validatedParams = validateSearchParams(params)
  const filters = buildMarketplaceFilters(validatedParams)
  const sortBy = validatedParams.sortBy || 'newest'

  let listings: Listing[] = []
  let pagination: PaginatedListings['pagination'] | null = null
  let counts: FilterCounts = createEmptyCounts()

  try {
    const [fetchedListings, fetchedCounts] = await Promise.all([
      fetchListings(filters, sortBy, { page: validatedParams.page, limit: MARKETPLACE_CONSTANTS.LISTINGS_PER_PAGE }),
      fetchFilterCounts(filters),
    ])
    listings = fetchedListings.data
    pagination = fetchedListings.pagination
    counts = fetchedCounts as FilterCounts
  } catch (error) {
    logErrorWithStrategy(error, { 
      resourceType: 'marketplace',
      action: 'fetch_listings',
      params,
      filters 
    })
  }

  const filteredOptions = buildFilteredOptions(counts)
  const sidebarProps = buildSidebarProps(params, counts, filteredOptions)

  return (
    <MarketplacePageClient sidebarProps={sidebarProps}>

      <Suspense>
        <CategoryFilter />
      </Suspense>
      {listings.length > 0 ? (
        <div className="
          gap-3 px-3 sm:gap-6 md:px-6
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5   
          ">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageX}
          title="No listings found"
          description="Try adjusting your filters or search terms"
        />
      )}
      <Suspense>
        <QueryPreservingPagination pagination={pagination} />
      </Suspense>

    </MarketplacePageClient>
  )
}
