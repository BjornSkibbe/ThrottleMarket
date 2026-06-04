/**
 * Validation Error Classes
 * 
 * Errors related to input validation, schema validation, and data integrity.
 */

import { z, type ZodError } from 'zod'
import { BaseError, ErrorSeverity, ErrorContext } from './base-error'

/**
 * Validation Error Codes
 */
export enum ValidationErrorCode {
  // General validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_RANGE = 'INVALID_RANGE',
  
  // String validation
  STRING_TOO_SHORT = 'STRING_TOO_SHORT',
  STRING_TOO_LONG = 'STRING_TOO_LONG',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_URL = 'INVALID_URL',
  INVALID_PHONE = 'INVALID_PHONE',
  
  // Number validation
  NUMBER_TOO_SMALL = 'NUMBER_TOO_SMALL',
  NUMBER_TOO_LARGE = 'NUMBER_TOO_LARGE',
  NOT_A_NUMBER = 'NOT_A_NUMBER',
  
  // Date validation
  INVALID_DATE = 'INVALID_DATE',
  DATE_IN_PAST = 'DATE_IN_PAST',
  DATE_IN_FUTURE = 'DATE_IN_FUTURE',
  
  // Enum validation
  INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',
  
  // Schema validation
  SCHEMA_VALIDATION_ERROR = 'SCHEMA_VALIDATION_ERROR',
  ZOD_VALIDATION_ERROR = 'ZOD_VALIDATION_ERROR',
  
  // Business logic validation
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  STATE_TRANSITION_INVALID = 'STATE_TRANSITION_INVALID',
}

/**
 * Validation field error
 */
export interface FieldError {
  field: string
  code: string
  message: string
  value?: unknown
}

/**
 * Base validation error class
 */
export class ValidationError extends BaseError {
  /**
   * Array of field-specific validation errors
   */
  public fieldErrors?: FieldError[]

  constructor(
    message: string,
    code: ValidationErrorCode,
    options: {
      severity?: ErrorSeverity
      statusCode?: number
      context?: ErrorContext
      cause?: Error
      fieldErrors?: FieldError[]
    } = {}
  ) {
    super(message, code, {
      severity: options.severity ?? ErrorSeverity.LOW,
      statusCode: options.statusCode ?? 400,
      context: options.context,
      cause: options.cause
    })
    this.fieldErrors = options.fieldErrors
  }

  /**
   * Add a field error
   */
  addFieldError(fieldError: FieldError): this {
    if (!this.fieldErrors) {
      this.fieldErrors = []
    }
    this.fieldErrors.push(fieldError)
    return this
  }

  /**
   * Check if a specific field has errors
   */
  hasFieldError(field: string): boolean {
    return this.fieldErrors?.some(fe => fe.field === field) ?? false
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(field: string): FieldError[] {
    return this.fieldErrors?.filter(fe => fe.field === field) ?? []
  }

  /**
   * Serialize with field errors
   */
  serialize(includeStack = false) {
    const base = super.serialize(includeStack)
    return {
      ...base,
      fieldErrors: this.fieldErrors
    }
  }
}

/**
 * Invalid input error
 */
export class InvalidInputError extends ValidationError {
  constructor(
    message: string = 'Invalid input provided',
    field?: string,
    value?: unknown,
    context?: ErrorContext
  ) {
    super(message, ValidationErrorCode.INVALID_INPUT, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: field ? { ...context, field, value } : context
    })
  }
}

/**
 * Missing required field error
 */
export class MissingRequiredFieldError extends ValidationError {
  constructor(
    field: string,
    context?: ErrorContext
  ) {
    const message = `Required field '${field}' is missing`
    super(message, ValidationErrorCode.MISSING_REQUIRED_FIELD, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, field }
    })
  }
}

/**
 * Invalid format error
 */
export class InvalidFormatError extends ValidationError {
  constructor(
    message: string,
    field?: string,
    expectedFormat?: string,
    context?: ErrorContext
  ) {
    super(message, ValidationErrorCode.INVALID_FORMAT, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, field, expectedFormat }
    })
  }
}

/**
 * Invalid type error
 */
export class InvalidTypeError extends ValidationError {
  constructor(
    field: string,
    expectedType: string,
    actualType: string,
    context?: ErrorContext
  ) {
    const message = `Field '${field}' must be of type ${expectedType}, got ${actualType}`
    super(message, ValidationErrorCode.INVALID_TYPE, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, field, expectedType, actualType }
    })
  }
}

/**
 * Invalid range error
 */
export class InvalidRangeError extends ValidationError {
  constructor(
    field: string,
    min?: number,
    max?: number,
    actualValue?: number,
    context?: ErrorContext
  ) {
    const message = `Field '${field}' is out of valid range`
    super(message, ValidationErrorCode.INVALID_RANGE, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, field, min, max, actualValue }
    })
  }
}

/**
 * Invalid email error
 */
export class InvalidEmailError extends ValidationError {
  constructor(
    email: string,
    context?: ErrorContext
  ) {
    const message = `Invalid email address: ${email}`
    super(message, ValidationErrorCode.INVALID_EMAIL, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, email }
    })
  }
}

/**
 * Invalid URL error
 */
export class InvalidUrlError extends ValidationError {
  constructor(
    url: string,
    context?: ErrorContext
  ) {
    const message = `Invalid URL: ${url}`
    super(message, ValidationErrorCode.INVALID_URL, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, url }
    })
  }
}

/**
 * Invalid enum value error
 */
export class InvalidEnumValueError extends ValidationError {
  constructor(
    field: string,
    value: unknown,
    validValues: string[],
    context?: ErrorContext
  ) {
    const message = `Field '${field}' has invalid value '${value}'. Valid values: ${validValues.join(', ')}`
    super(message, ValidationErrorCode.INVALID_ENUM_VALUE, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, field, value, validValues }
    })
  }
}

/**
 * Zod validation error
 */
export class ZodValidationError extends ValidationError {
  constructor(
    message: string = 'Schema validation failed',
    zodError?: ZodError<unknown>,
    context?: ErrorContext
  ) {
    super(message, ValidationErrorCode.ZOD_VALIDATION_ERROR, {
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      context: { ...context, zodError }
    })

    // Parse Zod error to extract field errors
    if (zodError?.issues) {
      this.fieldErrors = zodError.issues.map((err: z.ZodIssue) => ({
        field: err.path?.join('.') || 'unknown',
        code: err.code,
        message: err.message,
      }))
    }
  }
}

/**
 * Business rule violation error
 */
export class BusinessRuleViolationError extends ValidationError {
  constructor(
    message: string,
    rule: string,
    context?: ErrorContext
  ) {
    super(message, ValidationErrorCode.BUSINESS_RULE_VIOLATION, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 400,
      context: { ...context, rule }
    })
  }
}
