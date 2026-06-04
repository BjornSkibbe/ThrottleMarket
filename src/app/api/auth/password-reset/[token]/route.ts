import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'
import { PasswordResetService } from '@/features/auth/lib/password-reset.service'

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
})

async function validateTokenHandler(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    // Validate token format
    const validation = validateTokenSchema.safeParse({ token })
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    const result = await PasswordResetService.validateToken(token)

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(RateLimitPresets.API, validateTokenHandler)
