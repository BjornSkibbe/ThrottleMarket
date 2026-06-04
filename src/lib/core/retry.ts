/**
 * Retry Logic
 * 
 * Provides utilities for retrying operations that may fail transiently.
 * Uses exponential backoff to avoid overwhelming systems during outages.
 */

/**
 * Configuration for retry behavior
 */
export interface RetryConfig {
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  retryableErrors?: Array<string | RegExp | ((error: Error) => boolean)>
  onRetry?: (attempt: number, error: Error) => void
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryableErrors: [],
  onRetry: () => {},
}

/**
 * Calculate delay for a given attempt using exponential backoff
 */
function calculateDelay(attempt: number, config: Required<RetryConfig>): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1)
  return Math.min(delay, config.maxDelay)
}

/**
 * Check if an error is retryable based on configuration
 */
function isRetryable(error: Error, config: Required<RetryConfig>): boolean {
  if (config.retryableErrors.length === 0) {
    // If no specific errors are configured, retry all errors
    return true
  }

  return config.retryableErrors.some(check => {
    if (typeof check === 'string') {
      return error.message.includes(check)
    }
    if (check instanceof RegExp) {
      return check.test(error.message)
    }
    if (typeof check === 'function') {
      return check(error)
    }
    return false
  })
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // If this is the last attempt, throw the error
      if (attempt === finalConfig.maxAttempts) {
        throw lastError
      }

      // Check if error is retryable
      if (!isRetryable(lastError, finalConfig)) {
        throw lastError
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, finalConfig)
      finalConfig.onRetry(attempt, lastError)

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Retry failed')
}

/**
 * Retry with a specific condition
 */
export async function retryIf<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: Error) => boolean,
  config: Omit<RetryConfig, 'retryableErrors'> = {}
): Promise<T> {
  return retry(fn, {
    ...config,
    retryableErrors: [shouldRetry]
  })
}

/**
 * Retry only on specific error messages
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  errorMessages: string[],
  config: Omit<RetryConfig, 'retryableErrors'> = {}
): Promise<T> {
  return retry(fn, {
    ...config,
    retryableErrors: errorMessages
  })
}

/**
 * Retry only on network errors
 */
export async function retryNetwork<T>(
  fn: () => Promise<T>,
  config: Omit<RetryConfig, 'retryableErrors'> = {}
): Promise<T> {
  const networkErrorPatterns = [
    'ECONNREFUSED',
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN',
    'fetch failed',
    'network',
    'timeout'
  ]

  return retry(fn, {
    ...config,
    retryableErrors: networkErrorPatterns
  })
}

/**
 * Create a retryable version of a function
 */
export function makeRetryable<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config: RetryConfig = {}
): T {
  return (async (...args: Parameters<T>) => {
    return retry(() => fn(...args), config)
  }) as T
}

/**
 * Retry with jitter to avoid thundering herd problem
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === finalConfig.maxAttempts) {
        throw lastError
      }

      if (!isRetryable(lastError, finalConfig)) {
        throw lastError
      }

      const baseDelay = calculateDelay(attempt, finalConfig)
      // Add random jitter (±25%)
      const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1)
      const delay = baseDelay + jitter

      finalConfig.onRetry(attempt, lastError)
      await new Promise(resolve => setTimeout(resolve, Math.max(0, delay)))
    }
  }

  throw lastError || new Error('Retry failed')
}
