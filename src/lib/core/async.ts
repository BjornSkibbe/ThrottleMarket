/**
 * Async Utilities
 * 
 * Provides utilities for handling async operations with proper timeout,
 * cancellation, and error handling.
 */

/**
 * Configuration for async operations
 */
export interface AsyncConfig {
  timeout?: number
  signal?: AbortSignal
}

/**
 * Create a timeout promise that rejects after the specified duration
 */
export function createTimeout(ms: number, signal?: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`))
    }, ms)

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId)
        reject(new Error('Operation was aborted'))
      })
    }
  })
}

/**
 * Execute a promise with a timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<T> {
  return Promise.race([
    promise,
    createTimeout(timeoutMs, signal)
  ])
}

/**
 * Execute a promise with a timeout and return a Result
 */
export async function withTimeoutResult<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<T> {
  return withTimeout(promise, timeoutMs, signal)
}

/**
 * Execute multiple promises in parallel with a timeout for each
 */
export async function parallel<T>(
  tasks: Array<() => Promise<T>>,
  config?: AsyncConfig
): Promise<T[]> {
  const promises = tasks.map(task => {
    const promise = task()
    if (config?.timeout) {
      return withTimeout(promise, config.timeout, config.signal)
    }
    return promise
  })

  return Promise.all(promises)
}

/**
 * Execute promises in sequence (one after another)
 */
export async function sequence<T>(
  tasks: Array<() => Promise<T>>,
  config?: AsyncConfig
): Promise<T[]> {
  const results: T[] = []

  for (const task of tasks) {
    const promise = task()
    if (config?.timeout) {
      results.push(await withTimeout(promise, config.timeout, config.signal))
    } else {
      results.push(await promise)
    }
  }

  return results
}

/**
 * Execute promises in sequence with results passed to the next task
 */
export async function sequenceWith<T>(
  initial: T,
  tasks: Array<(value: T) => Promise<T>>,
  config?: AsyncConfig
): Promise<T> {
  let result = initial

  for (const task of tasks) {
    const promise = task(result)
    if (config?.timeout) {
      result = await withTimeout(promise, config.timeout, config.signal)
    } else {
      result = await promise
    }
  }

  return result
}

/**
 * Debounce an async function
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null

  return (function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn.apply(this, args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }) as T
}

/**
 * Throttle an async function
 */
export function throttleAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<unknown> {
  let lastCall = 0
  let lastPromise: Promise<unknown> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= delay) {
      lastCall = now
      return fn.apply(this, args)
    }

    if (lastPromise) {
      return lastPromise
    }

    lastPromise = (async () => {
      await new Promise(resolve => setTimeout(resolve, delay - timeSinceLastCall))
      lastCall = Date.now()
      const result = await fn.apply(this, args)
      lastPromise = null
      return result
    })()

    return lastPromise
  }
}

/**
 * Create a cancellable async operation
 */
export function cancellable<T>(
  fn: (signal: AbortSignal) => Promise<T>
): { promise: Promise<T>; cancel: () => void } {
  const controller = new AbortController()

  const promise = fn(controller.signal).catch(error => {
    if (error instanceof Error && error.message === 'Operation was aborted') {
      throw new Error('Operation was cancelled')
    }
    throw error
  })

  return {
    promise,
    cancel: () => controller.abort()
  }
}
