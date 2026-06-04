import { redirect } from "next/navigation"
import { auth } from "@/features/auth/lib/auth"
import { fetchAllDashboardData, DashboardError } from "@/lib/dashboard/fetch-dashboard-data"
import { calculateDashboardStats } from "@/lib/dashboard/calculate-stats"
import { DashboardPageClient } from "@/features/dashboard/components/dashboard-page-client"

export const dynamic = 'force-dynamic'

const DASHBOARD_LISTINGS_PER_PAGE = 10

type DashboardData = Awaited<ReturnType<typeof fetchAllDashboardData>>

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth()
  const params = await searchParams

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const page = Math.max(1, parseInt(params.page || '1', 10))

  let myListings: DashboardData['myListings'] = []
  let favorites: DashboardData['favorites'] = []
  let recentlyViewed: DashboardData['recentlyViewed'] = []
  let viewCounts: DashboardData['viewCounts'] = {}
  let conversationCounts: DashboardData['conversationCounts'] = {}

  try {
    const data = await fetchAllDashboardData(session.user.id)
    myListings = data.myListings
    favorites = data.favorites
    recentlyViewed = data.recentlyViewed
    viewCounts = data.viewCounts
    conversationCounts = data.conversationCounts
  } catch (error) {
    if (error instanceof DashboardError) {
      console.error('Dashboard error:', error.message)
    } else {
      console.error('Unexpected error:', error)
    }
    // Return empty data on error
  }

  const stats = calculateDashboardStats(myListings)
  const { activeListings, soldListings } = stats

  // Paginate myListings for display
  const limit = DASHBOARD_LISTINGS_PER_PAGE
  const total = myListings.length
  const totalPages = Math.ceil(total / limit) || 1
  const safePage = Math.min(page, totalPages)
  const skip = (safePage - 1) * limit
  const paginatedMyListings = myListings.slice(skip, skip + limit)

  const pagination = {
    page: safePage,
    limit,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  }

  return (
    <DashboardPageClient
      myListings={paginatedMyListings}
      favorites={favorites}
      recentlyViewed={recentlyViewed}
      activeListingsCount={activeListings.length}
      soldListingsCount={soldListings.length}
      favoritesCount={favorites.length}
      recentlyViewedCount={recentlyViewed.length}
      viewCounts={viewCounts}
      conversationCounts={conversationCounts}
      myListingsPagination={pagination}
    />
  )
}
