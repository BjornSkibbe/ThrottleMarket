/**
 * Socket.IO Error Handling Patterns
 * 
 * Error handling patterns for Socket.IO real-time connections.
 * 
 * NOTE: Requires socket.io-client to be installed:
 * npm install socket.io-client
 */

import { logErrorWithStrategy, logApiError } from '../logger/server'
import { isBaseError } from '../errors'

/**
 * Socket error types
 */
export enum SocketErrorType {
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  DISCONNECTION = 'DISCONNECTION',
  RECONNECTION_FAILED = 'RECONNECTION_FAILED',
  EVENT_ERROR = 'EVENT_ERROR',
  ACK_ERROR = 'ACK_ERROR',
}

/**
 * Socket error handler configuration
 */
export interface SocketErrorHandlerConfig {
  maxReconnectAttempts?: number
  reconnectDelay?: number
  enableLogging?: boolean
  onConnectionError?: (error: Error) => void
  onReconnectFailed?: () => void
  onEventError?: (event: string, error: Error) => void
}

/**
 * Handle socket connection error
 */
export function handleConnectionError(
  error: Error,
  config: SocketErrorHandlerConfig = {}
) {
  if (config.enableLogging !== false) {
    logErrorWithStrategy(error, {
      socket: true,
      errorType: SocketErrorType.CONNECTION_ERROR,
    })
  }

  if (config.onConnectionError) {
    config.onConnectionError(error)
  }
}

/**
 * Handle socket disconnection
 */
export function handleDisconnection(
  reason: string,
  config: SocketErrorHandlerConfig = {}
) {
  if (config.enableLogging !== false) {
    logApiError(
      {
        code: SocketErrorType.DISCONNECTION,
        message: `Socket disconnected: ${reason}`,
        statusCode: 0,
        severity: 'medium',
      },
      { socket: true }
    )
  }
}

/**
 * Handle reconnection failure
 */
export function handleReconnectionFailed(
  config: SocketErrorHandlerConfig = {}
) {
  if (config.enableLogging !== false) {
    logApiError(
      {
        code: SocketErrorType.RECONNECTION_FAILED,
        message: 'Socket reconnection failed after max attempts',
        statusCode: 0,
        severity: 'high',
      },
      { socket: true }
    )
  }

  if (config.onReconnectFailed) {
    config.onReconnectFailed()
  }
}

/**
 * Handle event error
 */
export function handleEventError(
  event: string,
  error: Error,
  config: SocketErrorHandlerConfig = {}
) {
  if (config.enableLogging !== false) {
    logErrorWithStrategy(error, {
      socket: true,
      event,
      errorType: SocketErrorType.EVENT_ERROR,
    })
  }

  if (config.onEventError) {
    config.onEventError(event, error)
  }
}

/**
 * Create a safe socket event handler
 */
export function createSafeEventHandler<T>(
  event: string,
  handler: (data: T) => void | Promise<void>,
  config: SocketErrorHandlerConfig = {}
): (data: T) => void {
  return (data: T) => {
    try {
      const result = handler(data)
      
      // Handle async handlers
      if (result instanceof Promise) {
        result.catch((error) => {
          handleEventError(event, error instanceof Error ? error : new Error(String(error)), config)
        })
      }
    } catch (error) {
      handleEventError(event, error instanceof Error ? error : new Error(String(error)), config)
    }
  }
}

/**
 * Calculate reconnection delay with exponential backoff
 */
export function calculateReconnectDelay(attempt: number, baseDelay: number = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000) // Max 30 seconds
}

/**
 * Determine if reconnection should be attempted
 */
export function shouldReconnect(attempt: number, maxAttempts: number): boolean {
  return attempt < maxAttempts
}

/**
 * Create socket error handler
 */
export function createSocketErrorHandler(config: SocketErrorHandlerConfig = {}) {
  const finalConfig: Required<SocketErrorHandlerConfig> = {
    maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
    reconnectDelay: config.reconnectDelay ?? 1000,
    enableLogging: config.enableLogging ?? true,
    onConnectionError: config.onConnectionError ?? (() => {}),
    onReconnectFailed: config.onReconnectFailed ?? (() => {}),
    onEventError: config.onEventError ?? (() => {}),
  }

  return {
    handleConnectionError: (error: Error) => handleConnectionError(error, finalConfig),
    handleDisconnection: (reason: string) => handleDisconnection(reason, finalConfig),
    handleReconnectionFailed: () => handleReconnectionFailed(finalConfig),
    handleEventError: (event: string, error: Error) => handleEventError(event, error, finalConfig),
    createSafeEventHandler: <T>(event: string, handler: (data: T) => void | Promise<void>) =>
      createSafeEventHandler(event, handler, finalConfig),
    calculateReconnectDelay: (attempt: number) => calculateReconnectDelay(attempt, finalConfig.reconnectDelay),
    shouldReconnect: (attempt: number) => shouldReconnect(attempt, finalConfig.maxReconnectAttempts),
  }
}
