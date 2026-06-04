/**
 * Socket.IO Error Handling Exports
 * 
 * Centralized exports for the Socket.IO error handling module.
 */

export {
  SocketErrorType,
  type SocketErrorHandlerConfig,
  handleConnectionError,
  handleDisconnection,
  handleReconnectionFailed,
  handleEventError,
  createSafeEventHandler,
  calculateReconnectDelay,
  shouldReconnect,
  createSocketErrorHandler,
} from './error-handling'
