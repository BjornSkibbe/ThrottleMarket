import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { withCSRFProtection } from "@/lib/middleware/csrf"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { messagingService } from "@/features/messaging/lib/messaging.service"
import { logErrorWithStrategy } from "@/lib/logger/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const { id } = await params

    // Verify user has access to this conversation
    await messagingService.verifyConversationAccess(id, session.user?.id || '')

    const result = await messagingService.getMessages(id, { page, limit })

    return NextResponse.json(result)
  } catch (error) {
    logErrorWithStrategy(error, { action: 'fetch_messages' })
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

async function markMessagesAsReadHandler(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) {
      return session
    }

    const { id } = await params

    await messagingService.markMessagesAsRead(id, session.user?.id || '')

    return NextResponse.json({ success: true })
  } catch (error) {
    logErrorWithStrategy(error, { action: 'mark_messages_as_read' })
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    )
  }
}

export const PATCH = withRateLimit(RateLimitPresets.API, withCSRFProtection(markMessagesAsReadHandler))
