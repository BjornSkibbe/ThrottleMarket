/**
 * Error Exports
 * 
 * Centralized export point for all error classes and types.
 */

// Base error
export {
  BaseError,
  ErrorSeverity,
} from './base-error'

export type {
  ErrorContext,
  SerializedError
} from './base-error'

// API errors
export {
  ApiError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InvalidResponseError,
  ParseError,
  ApiErrorCode
} from './api-error'

// Database errors
export {
  DatabaseError,
  ConnectionError,
  ConnectionTimeoutError,
  ConnectionPoolExhaustedError,
  QueryError,
  QueryTimeoutError,
  UniqueConstraintViolationError,
  ForeignKeyConstraintViolationError,
  RecordNotFoundError,
  RecordAlreadyExistsError,
  TransactionDeadlockError,
  TransactionRollbackError,
  DatabaseErrorCode
} from './database-error'

// Validation errors
export {
  ValidationError,
  InvalidInputError,
  MissingRequiredFieldError,
  InvalidFormatError,
  InvalidTypeError,
  InvalidRangeError,
  InvalidEmailError,
  InvalidUrlError,
  InvalidEnumValueError,
  ZodValidationError,
  BusinessRuleViolationError,
  ValidationErrorCode
} from './validation-error'

export type {
  FieldError
} from './validation-error'

import {
  BaseError,
  SerializedError
} from './base-error'
import { ApiError as ApiErrorClass } from './api-error'
import { DatabaseError as DatabaseErrorClass } from './database-error'
import { ValidationError as ValidationErrorClass } from './validation-error'

/**
 * Type guard to check if an error is a BaseError
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiErrorClass {
  return error instanceof ApiErrorClass
}

/**
 * Type guard to check if an error is a DatabaseError
 */
export function isDatabaseError(error: unknown): error is DatabaseErrorClass {
  return error instanceof DatabaseErrorClass
}

/**
 * Type guard to check if an error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationErrorClass {
  return error instanceof ValidationErrorClass
}

/**
 * Convert unknown error to BaseError if possible, otherwise wrap in generic error
 */
export function toBaseError(error: unknown): BaseError {
  if (isBaseError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new BaseError(error.message, 'UNKNOWN_ERROR', {
      cause: error
    })
  }

  return new BaseError(String(error), 'UNKNOWN_ERROR')
}

/**
 * Get HTTP status code from error
 */
export function getStatusCode(error: unknown): number {
  if (isBaseError(error)) {
    return error.statusCode
  }

  return 500
}

/**
 * Serialize error for API response
 */
export function serializeError(error: unknown, includeStack = false): SerializedError {
  const baseError = toBaseError(error)
  return baseError.serialize(includeStack)
}
