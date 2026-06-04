/**
 * Redis-backed rate limit store using Upstash Redis.
 * Works on serverless/edge platforms where in-memory stores are ephemeral.
 */

import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

export interface RateLimitEntry {
  count: number
  resetTime: number
}

const KEY_PREFIX = 'rate_limit:'

export function isRedisAvailable(): boolean {
  return redis !== null
}

export async function getRateLimitEntry(key: string): Promise<RateLimitEntry | null> {
  if (!redis) return null
  const data = await redis.get<string>(`${KEY_PREFIX}${key}`)
  if (!data) return null
  try {
    return JSON.parse(data) as RateLimitEntry
  } catch {
    return null
  }
}

export async function setRateLimitEntry(
  key: string,
  entry: RateLimitEntry,
  ttlMs: number
): Promise<void> {
  if (!redis) return
  await redis.set(`${KEY_PREFIX}${key}`, JSON.stringify(entry), { px: ttlMs })
}

export async function incrementRateLimitCount(key: string, ttlMs: number): Promise<number> {
  if (!redis) return 0
  const fullKey = `${KEY_PREFIX}${key}`
  const count = await redis.incr(fullKey)
  if (count === 1) {
    // First request in window — set expiry
    await redis.pexpire(fullKey, ttlMs)
  }
  return count
}
