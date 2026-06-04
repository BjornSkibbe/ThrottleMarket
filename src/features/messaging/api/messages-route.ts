import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { withCSRFProtection } from "@/lib/middleware/csrf"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { getValidatedBody } from "@/lib/validation/middleware"
import { logErrorWithStrategy } from "@/lib/logger/server"
import { messagingService } from "@/features/messaging/lib/messaging.service"
import { ValidationError } from "@/lib/errors"
import { z } from "zod"

const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string(),
})

async function sendMessageHandler(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const body = await getValidatedBody(request as NextRequest, sendMessageSchema)
    const { conversationId, content } = body

    const message = await messagingService.sendMessage(
      conversationId,
      content,
      session.user?.id || ''
    )

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.fieldErrors },
        { status: 400 }
      )
    }
    logErrorWithStrategy(error, { action: 'send_message' })
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.API, withCSRFProtection(sendMessageHandler))
