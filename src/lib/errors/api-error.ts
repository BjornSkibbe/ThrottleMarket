/**
 * API Error Classes
 * 
 * Errors related to HTTP API requests, responses, and network operations.
 */

import { BaseError, ErrorSeverity, ErrorContext } from './base-error'

/**
 * API Error Codes
 */
export enum ApiErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  
  // HTTP errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_GATEWAY = 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // API-specific errors
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  PARSE_ERROR = 'PARSE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  API_DOWN = 'API_DOWN',
}

/**
 * Base API error class
 */
export class ApiError extends BaseError {
  constructor(
    message: string,
    code: ApiErrorCode,
    options: {
      severity?: ErrorSeverity
      statusCode?: number
      context?: ErrorContext
      cause?: Error
    } = {}
  ) {
    super(message, code, {
      severity: options.severity ?? ErrorSeverity.MEDIUM,
      statusCode: options.statusCode ?? 500,
      context: options.context,
      cause: options.cause
    })
  }
}

/**
 * Network error (connection issues, DNS problems, etc.)
 */
export class NetworkError extends ApiError {
  constructor(
    message: string = 'Network error occurred',
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, ApiErrorCode.NETWORK_ERROR, {
      severity: ErrorSeverity.HIGH,
      statusCode: 503,
      context,
      cause
    })
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends ApiError {
  constructor(
    message: string = 'Request timed out',
    timeoutMs?: number,
    context?: ErrorContext
  ) {
    super(message, ApiErrorCode.TIMEOUT_ERROR, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 504,
      context: timeoutMs ? { ...context, timeoutMs } : context
    })
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(
    message: string = 'Unauthorized access',
    context?: ErrorContext
  ) {
    super(message, ApiErrorCode.UNAUTHORIZED, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 401,
      context
    })
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(
    message: string = 'Access forbidden',
    context?: ErrorContext
  ) {
    super(message, ApiErrorCode.FORBIDDEN, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 403,
      context
    })
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(
    message: string = 'Resource not found',
    resourceType?: string,
    resourceId?: string,
    context?: ErrorContext
  ) {
    super(message, ApiErrorCode.NOT_FOUND, {
      severity: ErrorSeverity.LOW,
      statusCode: 404,
      context: { ...context, resourceType, resourceId }
    })
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends ApiError {
  constructor(
    message: string = 'Resource conflict',
    context?: ErrorContext
  ) {
    super(message, ApiErrorCode.CONFLICT, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 409,
      context
    })
  }
}

/**
 * Rate limit exceeded error (429)
 */
export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    context?: ErrorContext
  ) {
    super(message, ApiErrorCode.RATE_LIMIT_EXCEEDED, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 429,
      context: retryAfter ? { ...context, retryAfter } : context
    })
  }
}

/**
 * Invalid response error
 */
export class InvalidResponseError extends ApiError {
  constructor(
    message: string = 'Invalid API response',
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, ApiErrorCode.INVALID_RESPONSE, {
      severity: ErrorSeverity.HIGH,
      statusCode: 502,
      context,
      cause
    })
  }
}

/**
 * Parse error (JSON parsing, etc.)
 */
export class ParseError extends ApiError {
  constructor(
    message: string = 'Failed to parse response',
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, ApiErrorCode.PARSE_ERROR, {
      severity: ErrorSeverity.HIGH,
      statusCode: 500,
      context,
      cause
    })
  }
}
