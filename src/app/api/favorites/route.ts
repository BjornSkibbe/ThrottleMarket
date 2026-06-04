import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { withCSRFProtection } from "@/lib/middleware/csrf"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { logErrorWithStrategy } from "@/lib/logger/server"
import { prisma } from "@/lib/prisma"

async function toggleFavoriteHandler(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const body = await request.json()
    const { listingId } = body

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    const userId = session.user?.id || ''

    // Check if favorite already exists
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    })

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          userId_listingId: {
            userId,
            listingId,
          },
        },
      })

      return NextResponse.json({ isFavorited: false })
    }

    // Add favorite
    await prisma.favorite.create({
      data: {
        userId,
        listingId,
      },
    })

    return NextResponse.json({ isFavorited: true })
  } catch (error) {
    logErrorWithStrategy(error, { action: 'toggle_favorite' })
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    )
  }
}

async function getFavoritesHandler(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const userId = session.user?.id || ''

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { listingId: true },
    })

    const listingIds = favorites.map((f) => f.listingId)

    return NextResponse.json({ listingIds })
  } catch (error) {
    logErrorWithStrategy(error, { action: 'fetch_favorites' })
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.API, withCSRFProtection(toggleFavoriteHandler))
export const GET = withRateLimit(RateLimitPresets.API, getFavoritesHandler)
