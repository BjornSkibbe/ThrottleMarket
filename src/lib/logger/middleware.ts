/**
 * Logging Middleware
 * 
 * Middleware for logging HTTP requests and responses.
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger, createChildLogger } from './logger'

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Extract relevant information from a request
 */
function extractRequestInfo(req: NextRequest) {
  return {
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
  }
}

/**
 * Extract relevant information from a response
 */
function extractResponseInfo(res: NextResponse) {
  return {
    status: res.status,
    statusText: res.statusText,
  }
}

/**
 * Logging middleware for Next.js API routes
 */
export function loggingMiddleware(req: NextRequest) {
  const requestId = generateRequestId()
  const requestLogger = createChildLogger(logger, { requestId })

  const startTime = Date.now()
  const requestInfo = extractRequestInfo(req)

  requestLogger.info({
    ...requestInfo,
    requestId,
  }, 'Incoming request')

  return {
    requestId,
    requestLogger,
    logResponse: (res: NextResponse) => {
      const duration = Date.now() - startTime
      const responseInfo = extractResponseInfo(res)

      requestLogger.info({
        ...requestInfo,
        ...responseInfo,
        requestId,
        duration,
      }, 'Request completed')
    },
    logError: (error: Error) => {
      const duration = Date.now() - startTime

      requestLogger.error({
        ...requestInfo,
        requestId,
        duration,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      }, 'Request failed')
    },
  }
}

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(req: NextRequest) {
  const requestId = generateRequestId()
  return createChildLogger(logger, {
    requestId,
    method: req.method,
    url: req.url,
  })
}

/**
 * Log an error with context
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  }, error.message)
}

/**
 * Log an API error with context
 */
export function logApiError(error: unknown, context?: Record<string, unknown>) {
  const apiError = error as { code?: string; message?: string; statusCode?: number; severity?: string; context?: Record<string, unknown> }
  logger.error({
    error: {
      code: apiError.code,
      message: apiError.message,
      statusCode: apiError.statusCode,
      severity: apiError.severity,
    },
    context: apiError.context,
    ...context,
  }, 'API error')
}
