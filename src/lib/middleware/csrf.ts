/**
 * CSRF Protection Middleware
 * 
 * Implements CSRF protection using double-submit cookie pattern.
 * For production, consider using a more robust CSRF library like csrf-csrf.
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Constant-time string comparison to prevent timing attacks.
 * Works in all JavaScript runtimes (Node.js, Edge, etc.).
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * Generate a random CSRF token
 */
function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Get or create CSRF token
 */
export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies()
  const existingToken = cookieStore.get('csrf_token')
  
  if (existingToken) {
    return existingToken.value
  }
  
  // Generate new token
  const token = generateCSRFToken()
  cookieStore.set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return token
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('csrf_token')
  
  if (!cookieToken) {
    return false
  }
  
  // Get token from request header
  const requestToken = request.headers.get('x-csrf-token')
  
  if (!requestToken) {
    return false
  }
  
  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(cookieToken.value, requestToken)
}

/**
 * CSRF protection middleware factory
 */
export function createCSRFProtection() {
  return async (request: Request): Promise<boolean | NextResponse> => {
    // Skip CSRF for GET requests (read-only)
    if (request.method === 'GET') {
      return true
    }
    
    // Validate CSRF token for state-changing operations
    const isValid = await validateCSRFToken(request)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
    
    return true
  }
}

/**
 * Higher-order function to wrap route handlers with CSRF protection
 */
export function withCSRFProtection<T extends unknown[]>(
  handler: (request: Request, ...args: T) => Promise<NextResponse>
) {
  const csrfProtection = createCSRFProtection()
  
  return async (request: Request, ...args: T): Promise<NextResponse> => {
    const result = await csrfProtection(request)
    
    if (result instanceof NextResponse) {
      return result
    }
    
    return handler(request, ...args)
  }
}

/**
 * Get CSRF token endpoint
 * This should be called by the client to obtain the CSRF token
 */
export async function getCSRFTokenEndpoint() {
  const token = await getCSRFToken()
  
  return NextResponse.json({ csrfToken: token })
}
