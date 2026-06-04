import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { getValidatedBody } from "@/lib/validation/middleware"
import { updateListingSchema } from "@/features/listings/lib/listing.schema"
import { listingService } from "@/features/listings/lib/listing.service"
import { logErrorWithStrategy } from "@/lib/logger/server"
import { ValidationError } from "@/lib/errors"
import { Model, Type } from "@/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const listing = await listingService.getListingById(id)
    return NextResponse.json(listing)
  } catch (error) {
    logErrorWithStrategy(error, { action: 'fetch_listing', listingId: id })
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    )
  }
}

async function updateListingHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    // Validate request body using schema
    const body = await getValidatedBody(request as NextRequest, updateListingSchema)

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
      status,
    } = body

    // Update listing through service layer
    const listing = await listingService.updateListing(
      id,
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
        status,
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

    return NextResponse.json(listing)
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.fieldErrors },
        { status: 400 }
      )
    }
    logErrorWithStrategy(error, { action: 'update_listing', listingId: id })
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    )
  }
}

export const PATCH = withRateLimit(RateLimitPresets.API, updateListingHandler)

async function deleteListingHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    // Delete listing through service layer
    await listingService.deleteListing(id, session.user?.id || '')

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.fieldErrors },
        { status: 400 }
      )
    }
    logErrorWithStrategy(error, { action: 'delete_listing', listingId: id })
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    )
  }
}

export const DELETE = withRateLimit(RateLimitPresets.API, deleteListingHandler)
