import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit'
import { PasswordResetService } from '@/features/auth/lib/password-reset.service'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

async function resetPasswordHandler(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    const result = await PasswordResetService.resetPassword(token, password)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.AUTH, resetPasswordHandler)
