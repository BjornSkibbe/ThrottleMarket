/**
 * Pino Logger Configuration
 * 
 * Centralized logger setup using Pino for structured logging.
 * 
 * NOTE: Requires pino to be installed:
 * npm install pino pino-pretty
 * npm install -D @types/pino
 */

import pino from 'pino'

/**
 * Log levels
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  SILENT = 'silent',
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level?: LogLevel
  prettyPrint?: boolean
  redact?: string[]
}

/**
 * Default redacted fields (sensitive data)
 */
const DEFAULT_REDACT = [
  'password',
  'token',
  'apiKey',
  'secret',
  'authorization',
  'cookie',
  'set-cookie',
]

/**
 * Get logger configuration based on environment
 */
function getLoggerConfig(config: LoggerConfig = {}): pino.LoggerOptions {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isTest = process.env.NODE_ENV === 'test'

  const baseConfig: pino.LoggerOptions = {
    level: config.level ?? (isDevelopment ? LogLevel.DEBUG : LogLevel.INFO),
    redact: {
      paths: config.redact ?? DEFAULT_REDACT,
      remove: true,
    },
    formatters: {
      level: (label: string) => {
        return { level: label }
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }

  // Silent in tests
  if (isTest) {
    return {
      ...baseConfig,
      level: LogLevel.SILENT,
    }
  }

  return baseConfig
}

function createPrettyStream() {
  // Sync stream avoids Pino's worker transport, which breaks under Next.js bundling.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pinoPretty = require('pino-pretty') as typeof import('pino-pretty')
  return pinoPretty({
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  })
}

/**
 * Create a logger instance (server-side only)
 */
export function createLogger(config: LoggerConfig = {}): pino.Logger {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const usePretty = config.prettyPrint ?? isDevelopment
  const loggerConfig = getLoggerConfig(config)

  if (usePretty) {
    return pino(loggerConfig, createPrettyStream())
  }

  return pino(loggerConfig)
}

/**
 * Default logger instance
 */
export const logger = createLogger()

/**
 * Create a child logger with additional context
 */
export function createChildLogger(
  parent: pino.Logger,
  context: Record<string, unknown>
): pino.Logger {
  return parent.child(context)
}

/**
 * Log levels helper
 */
export const logLevels = {
  trace: LogLevel.TRACE,
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  fatal: LogLevel.FATAL,
  silent: LogLevel.SILENT,
}
