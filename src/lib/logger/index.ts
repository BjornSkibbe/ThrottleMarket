/**
 * Client-safe logger exports.
 * For Pino/server logging, use `@/lib/logger/server` in API routes and server modules only.
 */

export {
  logErrorWithStrategy,
  logBusinessEvent,
  type LoggingContext,
} from './client'
