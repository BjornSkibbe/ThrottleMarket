/**
 * Enhanced Fetch Client
 * 
 * A wrapper around fetch with timeout, retry, interceptors, and automatic
 * error transformation to custom error classes.
 */

import { withTimeout } from '../../core/async'
import { retryNetwork } from '../../core/retry'
import {
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InvalidResponseError,
  ParseError,
  ApiError,
  ApiErrorCode
} from '../../errors'

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Request configuration
 */
export interface FetchConfig extends RequestInit {
  timeout?: number
  retries?: number
  skipRetry?: boolean
}

/**
 * Response type
 */
export interface ApiResponse<T = unknown> {
  data: T
  status: number
  headers: Headers
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (config: FetchConfig) => FetchConfig | Promise<FetchConfig>

/**
 * Response interceptor function
 */
export type ResponseInterceptor = (
  response: Response,
  config: FetchConfig
) => Response | Promise<Response>

/**
 * Error interceptor function
 */
export type ErrorInterceptor = (
  error: Error,
  config: FetchConfig
) => Error | Promise<Error>

/**
 * Fetch client configuration
 */
export interface FetchClientConfig {
  baseUrl?: string
  defaultTimeout?: number
  defaultRetries?: number
  defaultHeaders?: Record<string, string>
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
  errorInterceptors?: ErrorInterceptor[]
}

/**
 * CSRF token cache and fetcher
 */
let cachedCSRFToken: string | null = null

async function fetchCSRFToken(): Promise<string | null> {
  if (cachedCSRFToken) return cachedCSRFToken
  try {
    const response = await fetch('/api/csrf')
    if (!response.ok) return null
    const data = await response.json()
    cachedCSRFToken = data.csrfToken ?? null
    return cachedCSRFToken
  } catch {
    return null
  }
}

/**
 * Enhanced fetch client
 */
export class FetchClient {
  private config: Required<FetchClientConfig>

  constructor(config: FetchClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? '',
      defaultTimeout: config.defaultTimeout ?? 10000,
      defaultRetries: config.defaultRetries ?? 3,
      defaultHeaders: config.defaultHeaders ?? {},
      requestInterceptors: config.requestInterceptors ?? [],
      responseInterceptors: config.responseInterceptors ?? [],
      errorInterceptors: config.errorInterceptors ?? []
    }
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: FetchConfig): Promise<FetchConfig> {
    let result = config
    for (const interceptor of this.config.requestInterceptors) {
      result = await interceptor(result)
    }
    return result
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(
    response: Response,
    config: FetchConfig
  ): Promise<Response> {
    let result = response
    for (const interceptor of this.config.responseInterceptors) {
      result = await interceptor(result, config)
    }
    return result
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(
    error: Error,
    config: FetchConfig
  ): Promise<Error> {
    let result = error
    for (const interceptor of this.config.errorInterceptors) {
      result = await interceptor(result, config)
    }
    return result
  }

  /**
   * Build full URL from base URL and path
   */
  private buildUrl(path: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '')
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${normalizedPath}`
  }

  /**
   * Transform HTTP error to custom error class
   */
  private transformError(error: Error, response?: Response): ApiError {
    // If it's already an ApiError, return it
    if (error instanceof ApiError) {
      return error
    }

    // Handle timeout errors
    if (error.message.includes('timed out')) {
      return new TimeoutError(error.message)
    }

    // Handle network errors
    if (error.message.includes('fetch failed') || 
        error.message.includes('network') ||
        error.name === 'TypeError') {
      return new NetworkError(error.message, undefined, error)
    }

    // Handle HTTP status errors
    if (response) {
      const status = response.status

      switch (status) {
        case 401:
          return new UnauthorizedError()
        case 403:
          return new ForbiddenError()
        case 404:
          return new NotFoundError()
        case 409:
          return new ConflictError()
        case 429:
          const retryAfter = response.headers.get('Retry-After')
          return new RateLimitError(
            undefined,
            retryAfter ? parseInt(retryAfter) : undefined
          )
        case 500:
          return new ApiError('Internal server error', ApiErrorCode.INTERNAL_SERVER_ERROR, {
            statusCode: 500
          })
        case 502:
          return new InvalidResponseError('Bad gateway')
        case 503:
          return new NetworkError('Service unavailable')
        case 504:
          return new TimeoutError('Gateway timeout')
        default:
          return new ApiError(
            error.message || 'API request failed',
            ApiErrorCode.BAD_REQUEST,
            { statusCode: status }
          )
      }
    }

    // Default to generic API error
    return new ApiError(error.message, ApiErrorCode.INTERNAL_SERVER_ERROR, { cause: error })
  }

  /**
   * Parse response body
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      try {
        return await response.json()
      } catch (error) {
        throw new ParseError('Failed to parse JSON response', undefined, error as Error)
      }
    }

    if (contentType?.includes('text/')) {
      return (await response.text()) as T
    }

    return undefined as T
  }

  /**
   * Make an HTTP request
   */
  async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    config: FetchConfig = {}
  ): Promise<ApiResponse<T>> {
    const fullConfig: FetchConfig = {
      timeout: this.config.defaultTimeout,
      retries: this.config.defaultRetries,
      ...config,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.defaultHeaders,
        ...config.headers
      }
    }

    // Add body if present
    if (body) {
      fullConfig.body = JSON.stringify(body)
    }

    // Inject CSRF token for state-changing methods
    const stateChangingMethods: HttpMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']
    if (stateChangingMethods.includes(method)) {
      const csrfToken = await fetchCSRFToken()
      if (csrfToken) {
        fullConfig.headers = {
          ...fullConfig.headers,
          'x-csrf-token': csrfToken,
        }
      }
    }

    // Apply request interceptors
    const interceptedConfig = await this.applyRequestInterceptors(fullConfig)

    const url = this.buildUrl(path)

    // Execute request with retry logic
    const executeRequest = async (): Promise<Response> => {
      try {
        const response = await withTimeout(
          fetch(url, interceptedConfig),
          interceptedConfig.timeout!
        )

        // Apply response interceptors
        return await this.applyResponseInterceptors(response, interceptedConfig)
      } catch (error) {
        // Transform error
        const apiError = this.transformError(error as Error)
        
        // Apply error interceptors
        const interceptedError = await this.applyErrorInterceptors(apiError, interceptedConfig)
        
        throw interceptedError
      }
    }

    let response: Response

    // Use retry logic unless skipped
    if (interceptedConfig.skipRetry || interceptedConfig.retries === 0) {
      response = await executeRequest()
    } else {
      response = await retryNetwork(executeRequest, {
        maxAttempts: interceptedConfig.retries,
        onRetry: (attempt, error) => {
          console.warn(`Retrying request (attempt ${attempt}):`, error.message)
        }
      })
    }

    // Check for HTTP errors
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
      throw this.transformError(error, response)
    }

    // Parse response
    const data = await this.parseResponse<T>(response)

    return {
      data,
      status: response.status,
      headers: response.headers
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, config?: FetchConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, config)
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body, config)
  }

  /**
   * PUT request
   */
  async put<T>(path: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body, config)
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body, config)
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, config?: FetchConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, config)
  }
}

/**
 * Create a singleton fetch client instance
 */
export const fetchClient = new FetchClient({
  defaultTimeout: 10000,
  defaultRetries: 3,
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
})
