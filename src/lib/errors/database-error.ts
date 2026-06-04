/**
 * Database Error Classes
 * 
 * Errors related to database operations, queries, and connections.
 */

import { BaseError, ErrorSeverity, ErrorContext } from './base-error'

/**
 * Database Error Codes
 */
export enum DatabaseErrorCode {
  // Connection errors
  CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  CONNECTION_TIMEOUT = 'DATABASE_CONNECTION_TIMEOUT',
  CONNECTION_POOL_EXHAUSTED = 'DATABASE_CONNECTION_POOL_EXHAUSTED',
  
  // Query errors
  QUERY_ERROR = 'DATABASE_QUERY_ERROR',
  QUERY_TIMEOUT = 'DATABASE_QUERY_TIMEOUT',
  
  // Constraint errors
  UNIQUE_CONSTRAINT_VIOLATION = 'UNIQUE_CONSTRAINT_VIOLATION',
  FOREIGN_KEY_CONSTRAINT_VIOLATION = 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
  NOT_NULL_CONSTRAINT_VIOLATION = 'NOT_NULL_CONSTRAINT_VIOLATION',
  CHECK_CONSTRAINT_VIOLATION = 'CHECK_CONSTRAINT_VIOLATION',
  
  // Transaction errors
  TRANSACTION_ERROR = 'DATABASE_TRANSACTION_ERROR',
  TRANSACTION_DEADLOCK = 'DATABASE_TRANSACTION_DEADLOCK',
  TRANSACTION_ROLLBACK = 'DATABASE_TRANSACTION_ROLLBACK',
  
  // Migration errors
  MIGRATION_ERROR = 'DATABASE_MIGRATION_ERROR',
  MIGRATION_CONFLICT = 'DATABASE_MIGRATION_CONFLICT',
  
  // Record errors
  RECORD_NOT_FOUND = 'DATABASE_RECORD_NOT_FOUND',
  RECORD_ALREADY_EXISTS = 'DATABASE_RECORD_ALREADY_EXISTS',
  RECORD_LOCKED = 'DATABASE_RECORD_LOCKED',
  
  // General errors
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Base database error class
 */
export class DatabaseError extends BaseError {
  constructor(
    message: string,
    code: DatabaseErrorCode,
    options: {
      severity?: ErrorSeverity
      statusCode?: number
      context?: ErrorContext
      cause?: Error
    } = {}
  ) {
    super(message, code, {
      severity: options.severity ?? ErrorSeverity.HIGH,
      statusCode: options.statusCode ?? 500,
      context: options.context,
      cause: options.cause
    })
  }
}

/**
 * Connection error
 */
export class ConnectionError extends DatabaseError {
  constructor(
    message: string = 'Database connection failed',
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, DatabaseErrorCode.CONNECTION_ERROR, {
      severity: ErrorSeverity.CRITICAL,
      statusCode: 503,
      context,
      cause
    })
  }
}

/**
 * Connection timeout error
 */
export class ConnectionTimeoutError extends DatabaseError {
  constructor(
    message: string = 'Database connection timed out',
    timeoutMs?: number,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.CONNECTION_TIMEOUT, {
      severity: ErrorSeverity.HIGH,
      statusCode: 504,
      context: timeoutMs ? { ...context, timeoutMs } : context
    })
  }
}

/**
 * Connection pool exhausted error
 */
export class ConnectionPoolExhaustedError extends DatabaseError {
  constructor(
    message: string = 'Database connection pool exhausted',
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.CONNECTION_POOL_EXHAUSTED, {
      severity: ErrorSeverity.HIGH,
      statusCode: 503,
      context
    })
  }
}

/**
 * Query error
 */
export class QueryError extends DatabaseError {
  constructor(
    message: string = 'Database query failed',
    query?: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, DatabaseErrorCode.QUERY_ERROR, {
      severity: ErrorSeverity.HIGH,
      statusCode: 500,
      context: query ? { ...context, query } : context,
      cause
    })
  }
}

/**
 * Query timeout error
 */
export class QueryTimeoutError extends DatabaseError {
  constructor(
    message: string = 'Database query timed out',
    query?: string,
    timeoutMs?: number,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.QUERY_TIMEOUT, {
      severity: ErrorSeverity.HIGH,
      statusCode: 504,
      context: { ...context, query, timeoutMs }
    })
  }
}

/**
 * Unique constraint violation error
 */
export class UniqueConstraintViolationError extends DatabaseError {
  constructor(
    message: string = 'Unique constraint violation',
    constraintName?: string,
    fieldName?: string,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.UNIQUE_CONSTRAINT_VIOLATION, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 409,
      context: { ...context, constraintName, fieldName }
    })
  }
}

/**
 * Foreign key constraint violation error
 */
export class ForeignKeyConstraintViolationError extends DatabaseError {
  constructor(
    message: string = 'Foreign key constraint violation',
    constraintName?: string,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.FOREIGN_KEY_CONSTRAINT_VIOLATION, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 409,
      context: { ...context, constraintName }
    })
  }
}

/**
 * Record not found error
 */
export class RecordNotFoundError extends DatabaseError {
  constructor(
    message: string = 'Record not found',
    table?: string,
    id?: string,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.RECORD_NOT_FOUND, {
      severity: ErrorSeverity.LOW,
      statusCode: 404,
      context: { ...context, table, id }
    })
  }
}

/**
 * Record already exists error
 */
export class RecordAlreadyExistsError extends DatabaseError {
  constructor(
    message: string = 'Record already exists',
    table?: string,
    id?: string,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.RECORD_ALREADY_EXISTS, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 409,
      context: { ...context, table, id }
    })
  }
}

/**
 * Transaction deadlock error
 */
export class TransactionDeadlockError extends DatabaseError {
  constructor(
    message: string = 'Transaction deadlock detected',
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, DatabaseErrorCode.TRANSACTION_DEADLOCK, {
      severity: ErrorSeverity.HIGH,
      statusCode: 409,
      context,
      cause
    })
  }
}

/**
 * Transaction rollback error
 */
export class TransactionRollbackError extends DatabaseError {
  constructor(
    message: string = 'Transaction rolled back',
    reason?: string,
    context?: ErrorContext
  ) {
    super(message, DatabaseErrorCode.TRANSACTION_ROLLBACK, {
      severity: ErrorSeverity.MEDIUM,
      statusCode: 500,
      context: reason ? { ...context, reason } : context
    })
  }
}
