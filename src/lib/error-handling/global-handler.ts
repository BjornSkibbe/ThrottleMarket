/**
 * Global Error Handler
 * 
 * Global error event listeners and unhandled error handling.
 */

import { logErrorWithStrategy } from '../logger/client'
import { isBaseError, ErrorSeverity } from '../errors'

/**
 * Initialize global error handlers
 */
export function initializeGlobalErrorHandler() {
  // Handle uncaught errors
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      logErrorWithStrategy(event.error, {
        source: 'global-error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logErrorWithStrategy(event.reason, {
        source: 'unhandled-rejection',
        promise: true,
      })

      // Prevent default browser behavior
      event.preventDefault()
    })
  }

  // Handle uncaught exceptions in Node.js
  if (typeof process !== 'undefined') {
    process.on('uncaughtException', (error) => {
      logErrorWithStrategy(error, {
        source: 'uncaught-exception',
      })
      
      // NOTE: Do NOT call process.exit(1) here. In serverless environments
      // (e.g., Vercel), this terminates the entire runtime instance, causing
      // cascading failures for concurrent requests. Let the platform handle
      // process lifecycle while we ensure the error is logged.
    })

    process.on('unhandledRejection', (reason, promise) => {
      logErrorWithStrategy(reason, {
        source: 'unhandled-rejection-node',
      })
    })
  }
}

/**
 * Handle API errors with strategy
 */
export function handleApiError(error: unknown): {
  message: string
  shouldRetry: boolean
  shouldReport: boolean
} {
  if (isBaseError(error)) {
    return {
      message: error.message,
      shouldRetry: error.code === 'TIMEOUT_ERROR' || error.code === 'NETWORK_ERROR',
      shouldReport: error.isSeverityAtLeast(ErrorSeverity.HIGH),
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      shouldRetry: false,
      shouldReport: true,
    }
  }

  return {
    message: 'An unexpected error occurred',
    shouldRetry: false,
    shouldReport: true,
  }
}

/**
 * Create a safe async wrapper that catches errors
 */
export function safeAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> {
  return fn().catch((error: Error) => {
    logErrorWithStrategy(error, { safeAsync: true })
    if (onError) {
      onError(error)
    }
    return null
  })
}

/**
 * Create a safe wrapper that catches errors
 */
export function safe<T>(
  fn: () => T,
  onError?: (error: Error) => void
): T | null {
  try {
    return fn()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logErrorWithStrategy(err, { safe: true })
    if (onError) {
      onError(err)
    }
    return null
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delay?: number
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, onRetry } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxAttempts) {
        if (onRetry) {
          onRetry(attempt, lastError)
        }
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }

  throw lastError || new Error('Retry failed')
}
