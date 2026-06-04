import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { getValidatedBody } from "@/lib/validation/middleware"
import { logErrorWithStrategy } from "@/lib/logger/server"
import { createListingSchema } from "@/features/listings/lib/listing.schema"
import { listingService } from "@/features/listings/lib/listing.service"
import { ValidationError } from "@/lib/errors"
import { Model, Type } from "@/types"

async function createListingHandler(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    // Validate request body using schema
    const body = await getValidatedBody(request as NextRequest, createListingSchema)

    const {
      title,
      description,
      price,
      category,
      brand,
      condition,
      location,
      images,
      motorcycle,
      size,
    } = body

    // Create listing through service layer
    const listing = await listingService.createListing(
      {
        title,
        description,
        price,
        category,
        brand,
        condition,
        location,
        size,
        images,
        motorcycle: motorcycle ? {
          model: motorcycle.model as Model,
          type: motorcycle.type as Type,
          year: motorcycle.year,
          mileage: motorcycle.mileage,
          engineSize: motorcycle.engineSize,
        } : undefined,
      },
      session.user?.id || ''
    )

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.fieldErrors },
        { status: 400 }
      )
    }
    logErrorWithStrategy(error, { action: 'create_listing' })
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.API, createListingHandler)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const userId = searchParams.get("userId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    // Build filters
    const filters: Record<string, string> = {}
    if (userId) {
      filters.sellerId = userId
    }

    // Get listings through service layer
    const result = await listingService.getListings(filters, { page, limit })

    return NextResponse.json({
      listings: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    logErrorWithStrategy(error, { action: 'fetch_listings' })
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    )
  }
}
