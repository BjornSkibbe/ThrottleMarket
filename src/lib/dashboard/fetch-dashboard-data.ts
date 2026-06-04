import { prisma } from '@/lib/prisma'
import { Listing, User, Image } from '@/types'

export class DashboardError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DashboardError'
  }
}

export async function fetchUserListings(userId: string) {
  try {
    const myListings = await prisma.listing.findMany({
      where: {
        sellerId: userId,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return myListings as (Listing & { images: Image[]; seller: User })[]
  } catch (error) {
    console.error('Error fetching user listings:', error)
    throw new DashboardError('Failed to fetch your listings', 'FETCH_LISTINGS_ERROR')
  }
}

export async function fetchUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      include: {
        listing: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                location: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return favorites
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    throw new DashboardError('Failed to fetch your favorites', 'FETCH_FAVORITES_ERROR')
  }
}

export async function fetchListingConversationCounts(listingIds: string[]) {
  if (listingIds.length === 0) return {}

  try {
    const counts = await prisma.conversation.groupBy({
      by: ['listingId'],
      where: { listingId: { in: listingIds } },
      _count: { listingId: true },
    })

    const result: Record<string, number> = {}
    for (const row of counts) {
      result[row.listingId] = row._count.listingId
    }
    return result
  } catch (error) {
    console.error('Error fetching listing conversation counts:', error)
    return {}
  }
}

export async function fetchListingViewCounts(listingIds: string[]) {
  if (listingIds.length === 0) return {}

  try {
    const counts = await prisma.recentlyViewed.groupBy({
      by: ['listingId'],
      where: { listingId: { in: listingIds } },
      _count: { listingId: true },
    })

    const result: Record<string, number> = {}
    for (const row of counts) {
      result[row.listingId] = row._count.listingId
    }
    return result
  } catch (error) {
    console.error('Error fetching listing view counts:', error)
    return {}
  }
}

export async function fetchUserRecentlyViewed(userId: string) {
  try {
    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: {
        userId: userId,
      },
      include: {
        listing: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                location: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
      take: 10,
    })

    return recentlyViewed
  } catch (error) {
    console.error('Error fetching recently viewed:', error)
    throw new DashboardError('Failed to fetch recently viewed', 'FETCH_RECENTLY_VIEWED_ERROR')
  }
}

export async function fetchAllDashboardData(userId: string) {
  const [myListings, favorites, recentlyViewed] = await Promise.all([
    fetchUserListings(userId),
    fetchUserFavorites(userId),
    fetchUserRecentlyViewed(userId),
  ])

  const listingIds = myListings.map((l) => l.id)
  const [viewCounts, conversationCounts] = await Promise.all([
    fetchListingViewCounts(listingIds),
    fetchListingConversationCounts(listingIds),
  ])

  return {
    myListings,
    favorites,
    recentlyViewed,
    viewCounts,
    conversationCounts,
  }
}
