'use client'

import { signIn, signOut } from 'next-auth/react'
import { success, failure, type Result } from '@/lib/core/result'
import { UnauthorizedError, ApiError, ApiErrorCode, ConflictError, ParseError, type BaseError } from '@/lib/errors'
import { logBusinessEvent, logErrorWithStrategy } from '@/lib/logger/client'
import { validateResult } from '@/lib/validation/validators'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/features/auth/lib/auth.schema'

export interface AuthUser {
  id: string
  email?: string
  name?: string
}

export interface RegisterResponse {
  message: string
  userId: string
}

export class AuthService {
  async signIn(credentials: LoginInput): Promise<Result<string, BaseError>> {
    const validation = validateResult(loginSchema, credentials)

    if (validation.isFailure()) {
      return failure(validation.error)
    }

    try {
      const callbackUrl = window.location.search
        ? new URLSearchParams(window.location.search).get('callbackUrl') || '/marketplace-dashboard'
        : '/marketplace-dashboard'

      const result = await signIn('credentials', {
        email: validation.value.email,
        password: validation.value.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        return failure(new UnauthorizedError('Invalid email or password', { action: 'sign_in' }))
      }

      logBusinessEvent('auth.sign_in.success', { email: validation.value.email }, { action: 'sign_in' })
      return success(result?.url ?? callbackUrl)
    } catch (error) {
      const authError = new ApiError('Unable to sign in. Please try again.', ApiErrorCode.INTERNAL_SERVER_ERROR, {
        context: { action: 'sign_in' },
        cause: error instanceof Error ? error : undefined,
      })
      logErrorWithStrategy(error, { action: 'sign_in' })
      return failure(authError)
    }
  }

  async signUp(data: RegisterInput): Promise<Result<RegisterResponse, BaseError>> {
    const validation = validateResult(registerSchema, data)

    if (validation.isFailure()) {
      return failure(validation.error)
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.value),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        const message = responseData?.error?.message ?? responseData?.error ?? 'Registration failed'
        const error = response.status === 409
          ? new ConflictError(message, { action: 'sign_up', email: validation.value.email })
          : new ApiError(message, ApiErrorCode.BAD_REQUEST, {
              statusCode: response.status,
              context: { action: 'sign_up', email: validation.value.email },
            })

        return failure(error)
      }

      if (!responseData) {
        return failure(new ParseError('Invalid registration response', { action: 'sign_up' }))
      }

      logBusinessEvent('auth.sign_up.success', { email: validation.value.email }, { action: 'sign_up' })
      return success(responseData as RegisterResponse)
    } catch (error) {
      const authError = new ApiError('Unable to create account. Please try again.', ApiErrorCode.INTERNAL_SERVER_ERROR, {
        context: { action: 'sign_up', email: validation.value.email },
        cause: error instanceof Error ? error : undefined,
      })
      logErrorWithStrategy(error, { action: 'sign_up' })
      return failure(authError)
    }
  }

  async signOut(): Promise<Result<void, BaseError>> {
    try {
      await signOut({ redirect: false })
      logBusinessEvent('auth.sign_out.success', {}, { action: 'sign_out' })
      return success(undefined)
    } catch (error) {
      const authError = new ApiError('Unable to sign out. Please try again.', ApiErrorCode.INTERNAL_SERVER_ERROR, {
        context: { action: 'sign_out' },
        cause: error instanceof Error ? error : undefined,
      })
      logErrorWithStrategy(error, { action: 'sign_out' })
      return failure(authError)
    }
  }
}

export const authService = new AuthService()
