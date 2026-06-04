import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'
import { PasswordResetService } from '@/features/auth/lib/password-reset.service'

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

async function requestPasswordResetHandler(request: Request) {
  try {
    const body = await request.json()
    const { email } = requestResetSchema.parse(body)

    const result = await PasswordResetService.createResetToken(email)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.AUTH, requestPasswordResetHandler)
