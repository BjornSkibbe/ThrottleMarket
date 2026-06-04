import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { withCSRFProtection } from "@/lib/middleware/csrf"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { getValidatedBody } from "@/lib/validation/middleware"
import { logErrorWithStrategy } from "@/lib/logger/server"
import { messagingService } from "@/features/messaging/lib/messaging.service"
import { ValidationError } from "@/lib/errors"
import { z } from "zod"

const createConversationSchema = z.object({
  listingId: z.string(),
})

async function createConversationHandler(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const body = await getValidatedBody(request as NextRequest, createConversationSchema)
    const { listingId } = body

    const conversation = await messagingService.createConversation(
      listingId,
      session.user?.id || ''
    )

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.fieldErrors },
        { status: 400 }
      )
    }
    logErrorWithStrategy(error, { action: 'create_conversation' })
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const result = await messagingService.getUserConversations(
      session.user?.id || '',
      { page, limit }
    )

    return NextResponse.json(result)
  } catch (error) {
    logErrorWithStrategy(error, { action: 'fetch_conversations' })
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.API, withCSRFProtection(createConversationHandler))

async function deleteConversationHandler(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      )
    }

    await messagingService.deleteConversation(conversationId, session.user?.id || '')

    return NextResponse.json({ success: true })
  } catch (error) {
    logErrorWithStrategy(error, { action: 'delete_conversation' })
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    )
  }
}

export const DELETE = withRateLimit(RateLimitPresets.API, withCSRFProtection(deleteConversationHandler))
