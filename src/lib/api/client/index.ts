/**
 * API Client Exports
 * 
 * Centralized exports for the API client layer.
 */

export {
  FetchClient,
  fetchClient,
  type HttpMethod,
  type FetchConfig,
  type ApiResponse,
  type RequestInterceptor,
  type ResponseInterceptor,
  type ErrorInterceptor,
  type FetchClientConfig
} from './fetch-client'

export {
  handleApiError,
  createErrorResponse,
  withApiErrorHandler,
  type ErrorHandlerConfig
} from './error-handler'
