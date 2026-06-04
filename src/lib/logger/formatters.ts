/**
 * Log Formatters
 * 
 * Custom formatters for log output formatting.
 */

/**
 * Format error for logging
 */
export function formatError(error: Error): Record<string, unknown> {
  const result: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  }
  
  if (error.cause) {
    result.cause = formatError(error.cause as Error)
  }
  
  return result
}

/**
 * Format request for logging
 */
export function formatRequest(req: {
  method?: string
  url?: string
  headers?: Record<string, string | null>
}): Record<string, unknown> {
  return {
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers?.['user-agent'],
      'content-type': req.headers?.['content-type'],
      'authorization': req.headers?.['authorization'] ? '[REDACTED]' : undefined,
    },
  }
}

/**
 * Format response for logging
 */
export function formatResponse(res: {
  status?: number
  statusText?: string
}): Record<string, unknown> {
  return {
    status: res.status,
    statusText: res.statusText,
  }
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`
  }
  return `${(ms / 60000).toFixed(2)}m`
}

/**
 * Format bytes for logging
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Sanitize sensitive data from object
 */
export function sanitizeData(data: unknown, sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey']): unknown {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, sensitiveKeys))
  }

  const obj = data as Record<string, unknown>
  const sanitized: Record<string, unknown> = {}
  for (const key in obj) {
    if (sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey.toLowerCase()))) {
      sanitized[key] = '[REDACTED]'
    } else {
      sanitized[key] = sanitizeData(obj[key], sensitiveKeys)
    }
  }

  return sanitized
}
