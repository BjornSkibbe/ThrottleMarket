/**
 * Base Error Class
 * 
 * All custom errors should extend this class to ensure consistent
 * error handling, logging, and serialization across the application.
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error context metadata
 */
export interface ErrorContext {
  userId?: string
  requestId?: string
  resourceId?: string
  [key: string]: unknown
}

/**
 * Serialized error for API responses
 */
export interface SerializedError {
  code: string
  message: string
  severity: ErrorSeverity
  context?: ErrorContext
  stack?: string
}

/**
 * Base error class with common functionality
 */
export class BaseError extends Error {
  /**
   * Unique error code for programmatic handling
   */
  public readonly code: string

  /**
   * Error severity for logging and alerting
   */
  public readonly severity: ErrorSeverity

  /**
   * HTTP status code for API responses
   */
  public readonly statusCode: number

  /**
   * Additional context about the error
   */
  public readonly context: ErrorContext

  /**
   * Original error that caused this error (for error chaining)
   */
  public readonly cause?: Error

  constructor(
    message: string,
    code: string,
    options: {
      severity?: ErrorSeverity
      statusCode?: number
      context?: ErrorContext
      cause?: Error
    } = {}
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.severity = options.severity ?? ErrorSeverity.MEDIUM
    this.statusCode = options.statusCode ?? 500
    this.context = options.context ?? {}
    this.cause = options.cause

    // Maintain proper stack trace
    Error.captureStackTrace?.(this, this.constructor)
  }

  /**
   * Add context to the error
   */
  addContext(additionalContext: ErrorContext): this {
    Object.assign(this.context, additionalContext)
    return this
  }

  /**
   * Serialize error for API responses
   */
  serialize(includeStack = false): SerializedError {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      context: Object.keys(this.context).length > 0 ? this.context : undefined,
      stack: includeStack ? this.stack : undefined
    }
  }

  /**
   * Check if this error matches a specific code
   */
  isCode(code: string): boolean {
    return this.code === code
  }

  /**
   * Check if this error is of a specific severity or higher
   */
  isSeverityAtLeast(severity: ErrorSeverity): boolean {
    const severityOrder = [
      ErrorSeverity.LOW,
      ErrorSeverity.MEDIUM,
      ErrorSeverity.HIGH,
      ErrorSeverity.CRITICAL
    ]
    const currentIndex = severityOrder.indexOf(this.severity)
    const targetIndex = severityOrder.indexOf(severity)
    return currentIndex >= targetIndex
  }

  /**
   * Convert to a JSON string
   */
  toJSON(): string {
    return JSON.stringify(this.serialize())
  }
}
