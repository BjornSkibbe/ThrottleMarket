/**
 * Logging Strategy
 * 
 * Guidelines and utilities for consistent logging across the application.
 */

import { logger, createChildLogger } from './logger'
import { logError, logApiError } from './middleware'
import { isBaseError } from '../errors'

/**
 * Logging context
 */
export interface LoggingContext {
  userId?: string
  requestId?: string
  resourceId?: string
  resourceType?: string
  action?: string
  [key: string]: unknown
}

/**
 * Create a logger with context
 */
export function createLoggerWithContext(context: LoggingContext) {
  return createChildLogger(logger, context)
}

/**
 * Log a business event
 */
export function logBusinessEvent(
  event: string,
  data: Record<string, unknown>,
  context?: LoggingContext
) {
  const eventLogger = context ? createLoggerWithContext(context) : logger
  eventLogger.info(data, event)
}

/**
 * Log a user action
 */
export function logUserAction(
  userId: string,
  action: string,
  data: Record<string, unknown> = {}
) {
  const actionLogger = createChildLogger(logger, { userId, action })
  actionLogger.info(data, `User action: ${action}`)
}

/**
 * Log a state change
 */
export function logStateChange(
  resourceType: string,
  resourceId: string,
  fromState: string,
  toState: string,
  context?: LoggingContext
) {
  const stateLogger = context ? createLoggerWithContext(context) : logger
  stateLogger.info(
    {
      resourceType,
      resourceId,
      fromState,
      toState,
    },
    'State change'
  )
}

/**
 * Log a performance metric
 */
export function logPerformance(
  operation: string,
  duration: number,
  context?: LoggingContext
) {
  const perfLogger = context ? createLoggerWithContext(context) : logger
  const level = duration > 1000 ? 'warn' : 'debug'
  
  perfLogger[level](
    {
      operation,
      duration,
      durationFormatted: `${duration}ms`,
    },
    `Performance: ${operation}`
  )
}

/**
 * Log a database query
 */
export function logDatabaseQuery(
  query: string,
  duration: number,
  context?: LoggingContext
) {
  const dbLogger = context ? createLoggerWithContext(context) : logger
  const level = duration > 500 ? 'warn' : 'debug'
  
  dbLogger[level](
    {
      query: query.substring(0, 200), // Truncate long queries
      duration,
    },
    'Database query'
  )
}

/**
 * Log an API call
 */
export function logApiCall(
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  context?: LoggingContext
) {
  const apiLogger = context ? createLoggerWithContext(context) : logger
  const level = statusCode >= 400 ? 'warn' : statusCode >= 500 ? 'error' : 'info'
  
  apiLogger[level](
    {
      method,
      url,
      statusCode,
      duration,
    },
    'API call'
  )
}

/**
 * Log an error with strategy
 */
export function logErrorWithStrategy(
  error: unknown,
  context?: LoggingContext
) {
  const errorLogger = context ? createLoggerWithContext(context) : logger
  
  if (isBaseError(error)) {
    // Use custom error class information
    errorLogger.error(
      {
        code: error.code,
        severity: error.severity,
        statusCode: error.statusCode,
        context: error.context,
        message: error.message,
        stack: error.stack,
      },
      `Error: ${error.code}`
    )
  } else if (error instanceof Error) {
    logError(error, context)
  } else {
    errorLogger.error(
      {
        error: String(error),
      },
      'Unknown error'
    )
  }
}

/**
 * Log an audit event (for sensitive operations)
 */
export function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  data: Record<string, unknown> = {}
) {
  const auditLogger = createChildLogger(logger, {
    userId,
    action,
    resourceType,
    resourceId,
    audit: true,
  })
  
  auditLogger.info(data, `Audit: ${action}`)
}

/**
 * Log a validation error
 */
export function logValidationError(
  errors: Record<string, string[]>,
  context?: LoggingContext
) {
  const validationLogger = context ? createLoggerWithContext(context) : logger
  validationLogger.warn(
    {
      errors,
      errorCount: Object.keys(errors).length,
    },
    'Validation failed'
  )
}

/**
 * Log a cache hit/miss
 */
export function logCacheEvent(
  key: string,
  hit: boolean,
  context?: LoggingContext
) {
  const cacheLogger = context ? createLoggerWithContext(context) : logger
  cacheLogger.debug(
    {
      key,
      hit,
    },
    `Cache ${hit ? 'hit' : 'miss'}`
  )
}

/**
 * Log a rate limit event
 */
export function logRateLimitEvent(
  userId: string,
  endpoint: string,
  limit: number,
  remaining: number,
  context?: LoggingContext
) {
  const rateLimitLogger = context ? createLoggerWithContext(context) : logger
  rateLimitLogger.warn(
    {
      userId,
      endpoint,
      limit,
      remaining,
    },
    'Rate limit'
  )
}
