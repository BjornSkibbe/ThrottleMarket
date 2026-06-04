/**
 * Client-safe logging (no Pino / Node-only deps).
 * Use in 'use client' components and error boundaries.
 */

export interface LoggingContext {
  userId?: string
  requestId?: string
  resourceId?: string
  resourceType?: string
  action?: string
  [key: string]: unknown
}

export function logErrorWithStrategy(
  error: unknown,
  context?: LoggingContext
) {
  const payload = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[error]', payload, error)
  } else {
    console.error('[error]', payload)
  }
}

export function logBusinessEvent(
  event: string,
  data: Record<string, unknown> = {},
  context?: LoggingContext
) {
  if (process.env.NODE_ENV === 'development') {
    console.info('[event]', event, { ...data, ...context })
  }
}
