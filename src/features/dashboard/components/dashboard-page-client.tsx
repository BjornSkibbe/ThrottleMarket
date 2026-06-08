"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSidebarContext } from "@/contexts/sidebar-props-context"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MyListingsTable } from "@/features/dashboard/components/my-listings-table"
import { FavoritesTable } from "@/features/dashboard/components/favorites-table"
import { EmptyState } from "@/components/empty-state"
import { QueryPreservingPagination } from "@/components/query-preserving-pagination"
import { Package, Heart, Eye } from "lucide-react"
import { Listing } from "@/types"

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface FavoriteWithListing {
  listing: Listing
}

interface RecentlyViewedWithListing {
  listing: Listing
}

interface DashboardPageClientProps {
  myListings: Listing[]
  favorites: FavoriteWithListing[]
  recentlyViewed: RecentlyViewedWithListing[]
  activeListingsCount?: number
  soldListingsCount?: number
  favoritesCount?: number
  recentlyViewedCount?: number
  viewCounts?: Record<string, number>
  conversationCounts?: Record<string, number>
  myListingsPagination?: PaginationMeta | null
}

export function DashboardPageClient({
  myListings,
  favorites,
  recentlyViewed,
  activeListingsCount = 0,
  soldListingsCount = 0,
  favoritesCount = 0,
  recentlyViewedCount = 0,
  viewCounts = {},
  conversationCounts = {},
  myListingsPagination = null,
}: DashboardPageClientProps) {
  const searchParams = useSearchParams()
  const { setSidebarProps } = useSidebarContext()
  
  const activeTab = searchParams.get("tab") || "my-listings"
  
  // Extract actual listings from favorites and recentlyViewed
  const favoriteListings = favorites.map((fav) => fav.listing)
  const recentlyViewedListings = recentlyViewed.map((viewed) => viewed.listing)

  useEffect(() => {
    setSidebarProps({
      activeTab,
      activeListingsCount,
      soldListingsCount,
      favoritesCount,
      recentlyViewedCount,
    })
  }, [activeTab, activeListingsCount, soldListingsCount, favoritesCount, recentlyViewedCount, setSidebarProps])

  return (
  
    <div className="px-3 sm:px-6">
      <Tabs value={activeTab} className="">
        {/* 
          My Listings TAB 
        */}
        <TabsContent value="my-listings" className="space-y-6 bg-muted/30 rounded-4xl p-3 sm:p-6">
          {myListings.length > 0 ? (
            <MyListingsTable listings={myListings} viewCounts={viewCounts} conversationCounts={conversationCounts} />
          ) : (
            <EmptyState
              icon={Package}
              title="No listings yet"
              description="Create your first listing to start selling on ThrottleMarket"
            />
          )}
          <Suspense>
            <QueryPreservingPagination
              pagination={myListingsPagination}
              basePath="/marketplace-dashboard"
            />
          </Suspense>
        </TabsContent>
        {/* 
          Favorites TAB 
        */}
        <TabsContent value="favorites" className="space-y-6 bg-muted/30 rounded-4xl p-6">
          {favoriteListings.length > 0 ? (
            <FavoritesTable listings={favoriteListings} />
          ) : (
            <EmptyState 
              icon={Heart}
              title="No favorites yet"
              description="Save items you love to your favorites"
            />
          )}
        </TabsContent>
        {/* 
          Recently Viewed TAB 
        */}
        <TabsContent value="recently-viewed" className="space-y-6 bg-muted/30 rounded-4xl p-6">
          {recentlyViewedListings.length > 0 ? (
            <MyListingsTable listings={recentlyViewedListings} />
          ) : (
            <EmptyState 
              icon={Eye}
              title="No recently viewed items"
              description="Items you view will appear here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
