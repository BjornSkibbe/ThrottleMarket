/**
 * Rate Limiting Middleware
 *
 * Uses Upstash Redis in production for shared state across serverless invocations.
 * Falls back to an in-memory store for local development only.
 */

import { NextResponse } from 'next/server'
import {
  isRedisAvailable,
  getRateLimitEntry,
  setRateLimitEntry,
  incrementRateLimitCount,
} from '@/lib/rate-limit/redis-store'

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory store — used ONLY when Redis is unavailable (local dev)
const devRateLimitStore = new Map<string, RateLimitStore>()

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number    // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean // Don't count successful requests
}

/**
 * Default rate limit configurations
 */
export const RateLimitPresets = {
  AUTH: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  } as RateLimitConfig,

  API: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  } as RateLimitConfig,

  PUBLIC: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 1000,
  } as RateLimitConfig,
}

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'anonymous'
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, value] of devRateLimitStore.entries()) {
    if (value.resetTime < now) {
      devRateLimitStore.delete(key)
    }
  }
}

async function checkRedisRateLimit(
  clientId: string,
  config: RateLimitConfig,
  now: number
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | NextResponse> {
  const { windowMs, maxRequests } = config
  const key = `${clientId}:${Math.floor(now / windowMs)}`

  const count = await incrementRateLimitCount(key, windowMs)

  if (count > maxRequests) {
    const resetTime = (Math.floor(now / windowMs) + 1) * windowMs
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((resetTime - now) / 1000)} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          'Retry-After': Math.ceil((resetTime - now) / 1000).toString(),
        },
      }
    )
  }

  const resetTime = (Math.floor(now / windowMs) + 1) * windowMs
  return {
    success: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - count),
    reset: resetTime,
  }
}

function checkMemoryRateLimit(
  clientId: string,
  config: RateLimitConfig,
  now: number
): { success: boolean; limit: number; remaining: number; reset: number } | NextResponse {
  const { windowMs, maxRequests } = config

  if (devRateLimitStore.size > 1000) {
    cleanupExpiredEntries()
  }

  let entry = devRateLimitStore.get(clientId)

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    devRateLimitStore.set(clientId, entry)
  }

  if (entry.count >= maxRequests) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetTime - now) / 1000)} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
          'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
        },
      }
    )
  }

  entry.count++

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimit(config: RateLimitConfig) {
  return async (request: Request): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | NextResponse> => {
    const clientId = getClientIdentifier(request)
    const now = Date.now()

    if (isRedisAvailable()) {
      return checkRedisRateLimit(clientId, config, now)
    }

    return checkMemoryRateLimit(clientId, config, now)
  }
}

/**
 * Higher-order function to wrap route handlers with rate limiting
 */
export function withRateLimit<T extends unknown[]>(
  config: RateLimitConfig,
  handler: (request: Request, ...args: T) => Promise<NextResponse>
) {
  const rateLimit = createRateLimit(config)

  return async (request: Request, ...args: T): Promise<NextResponse> => {
    const result = await rateLimit(request)

    if (result instanceof NextResponse) {
      return result
    }

    const response = await handler(request, ...args)

    if (response.headers) {
      response.headers.set('X-RateLimit-Limit', result.limit.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())
    }

    return response
  }
}
