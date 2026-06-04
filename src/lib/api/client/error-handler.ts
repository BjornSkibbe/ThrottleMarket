/**
 * API Error Handler
 * 
 * Centralized error handling for API responses, including error logging,
 * user-friendly error messages, and error reporting.
 */

import { BaseError, isBaseError, getStatusCode, serializeError, ErrorSeverity } from '../../errors'

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  logErrors?: boolean
  showStackInProduction?: boolean
  userFacingMessages?: Record<string, string>
}

/**
 * Default error handler configuration
 */
const DEFAULT_CONFIG: Required<ErrorHandlerConfig> = {
  logErrors: true,
  showStackInProduction: false,
  userFacingMessages: {
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'You need to log in to access this resource.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    CONFLICT: 'This resource conflicts with existing data.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait and try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    DATABASE_ERROR: 'A database error occurred. Please try again later.',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.'
  }
}

/**
 * Get user-friendly error message
 */
function getUserFacingMessage(error: Error, config: Required<ErrorHandlerConfig>): string {
  if (isBaseError(error)) {
    const customMessage = config.userFacingMessages[error.code]
    if (customMessage) {
      return customMessage
    }
  }

  // Default message
  return 'An error occurred. Please try again.'
}

/**
 * Handle API error
 */
export function handleApiError(
  error: unknown,
  config: ErrorHandlerConfig = {}
): {
  message: string
  statusCode: number
  code: string
  shouldLog: boolean
} {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  // Convert to BaseError if possible
  const baseError = isBaseError(error) ? error : new BaseError(
    error instanceof Error ? error.message : String(error),
    'UNKNOWN_ERROR'
  )

  // Log error if configured
  if (finalConfig.logErrors) {
    console.error('API Error:', {
      code: baseError.code,
      message: baseError.message,
      severity: baseError.severity,
      context: baseError.context,
      stack: baseError.stack
    })
  }

  return {
    message: getUserFacingMessage(baseError, finalConfig),
    statusCode: getStatusCode(baseError),
    code: baseError.code,
    shouldLog: baseError.isSeverityAtLeast(ErrorSeverity.MEDIUM)
  }
}

/**
 * Create error response for Next.js API routes
 */
export function createErrorResponse(
  error: unknown,
  config: ErrorHandlerConfig = {}
): Response {
  const { message, statusCode, code } = handleApiError(error, config)

  const body = {
    error: {
      code,
      message,
      timestamp: new Date().toISOString()
    }
  }

  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * Wrap an async function with error handling
 */
export function withApiErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config?: ErrorHandlerConfig
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      throw handleApiError(error, config)
    }
  }) as T
}
