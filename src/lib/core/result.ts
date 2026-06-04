/**
 * Result Pattern Implementation
 * 
 * This provides a type-safe way to handle operations that can fail without
 * using exceptions. This makes error handling explicit and forces developers
 * to handle both success and failure cases.
 * 
 * Inspired by Rust's Result<T, E> and functional programming patterns.
 */

/**
 * Represents a successful operation with a value
 */
export class Success<T> {
  readonly _tag = 'success' as const
  constructor(public readonly value: T) {}

  /**
   * Transform the success value
   */
  map<U>(fn: (value: T) => U): Result<U> {
    return new Success(fn(this.value))
  }

  /**
   * Chain another operation that may fail
   */
  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    return fn(this.value)
  }

  /**
   * Get the value or a default if this is a failure (never happens for Success)
   */
  unwrapOr(_default: T): T {
    return this.value
  }

  /**
   * Execute a side effect on success
   */
  tap(fn: (value: T) => void): Result<T> {
    fn(this.value)
    return this
  }

  /**
   * Check if this is a success
   */
  isSuccess(): this is Success<T> {
    return true
  }

  /**
   * Check if this is a failure
   */
  isFailure(): this is Failure<never> {
    return false
  }
}

/**
 * Represents a failed operation with an error
 */
export class Failure<E extends Error = Error> {
  readonly _tag = 'failure' as const
  constructor(public readonly error: E) {}

  /**
   * Transform does nothing for failures
   */
  map<U>(_fn: (value: never) => U): Result<U> {
    return this as unknown as Result<U>
  }

  /**
   * Chain does nothing for failures
   */
  flatMap<U>(_fn: (value: never) => Result<U>): Result<U> {
    return this as unknown as Result<U>
  }

  /**
   * Get the value or a default
   */
  unwrapOr(defaultValue: never): never {
    return defaultValue
  }

  /**
   * Tap does nothing for failures
   */
  tap(_fn: (value: never) => void): Result<never> {
    return this
  }

  /**
   * Execute a side effect on failure
   */
  tapError(fn: (error: E) => void): Result<never> {
    fn(this.error)
    return this
  }

  /**
   * Check if this is a success
   */
  isSuccess(): this is Success<never> {
    return false
  }

  /**
   * Check if this is a failure
   */
  isFailure(): this is Failure<E> {
    return true
  }

  /**
   * Convert the error to a different error type
   */
  mapError<U extends Error>(fn: (error: E) => U): Failure<U> {
    return new Failure(fn(this.error))
  }
}

/**
 * A Result type that can be either Success or Failure
 */
export type Result<T, E extends Error = Error> = Success<T> | Failure<E>

/**
 * Create a successful result
 */
export function success<T>(value: T): Success<T> {
  return new Success(value)
}

/**
 * Create a failed result
 */
export function failure<E extends Error>(error: E): Failure<E> {
  return new Failure(error)
}

/**
 * Wrap a synchronous operation that might throw in a Result
 */
export function tryCatch<T, E extends Error = Error>(
  fn: () => T,
  errorMapper?: (error: unknown) => E
): Result<T, E> {
  try {
    return success(fn())
  } catch (error) {
    return failure(errorMapper ? errorMapper(error) : error as E)
  }
}

/**
 * Wrap an async operation that might throw in a Result
 */
export async function tryCatchAsync<T, E extends Error = Error>(
  fn: () => Promise<T>,
  errorMapper?: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    return success(await fn())
  } catch (error) {
    return failure(errorMapper ? errorMapper(error) : error as E)
  }
}

/**
 * Execute multiple operations and return the first failure or all successes
 */
export async function all<T, E extends Error = Error>(
  results: Array<Result<T, E>>
): Promise<Result<T[], E>> {
  const values: T[] = []
  
  for (const result of results) {
    if (result.isFailure()) {
      return result as unknown as Promise<Result<T[], E>>
    }
    values.push(result.value)
  }
  
  return success(values)
}

/**
 * Execute operations in parallel and return all results (failures included)
 */
export async function allSettled<T, E extends Error = Error>(
  results: Array<Result<T, E>>
): Promise<Array<Result<T, E>>> {
  return Promise.all(results)
}
