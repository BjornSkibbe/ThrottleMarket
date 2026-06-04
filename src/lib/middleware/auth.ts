/**
 * Authorization Middleware
 * 
 * Middleware functions for protecting API routes with authentication and authorization checks.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/features/auth/lib/auth'

/**
 * Require authentication middleware
 * Ensures the user is authenticated before proceeding
 */
export async function requireAuth(request: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return session
}

/**
 * Require resource ownership middleware
 * Ensures the authenticated user owns the specified resource
 */
export async function requireOwnership(
  request: Request,
  resourceOwnerId: string
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  if (session.user.id !== resourceOwnerId) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
  
  return session
}

/**
 * Higher-order function to wrap route handlers with authentication
 */
export function withAuth<T extends unknown[]>(
  handler: (request: Request, ...args: T) => Promise<NextResponse>
) {
  return async (request: Request, ...args: T): Promise<NextResponse> => {
    const authResult = await requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    return handler(request, ...args)
  }
}

/**
 * Higher-order function to wrap route handlers with ownership check
 */
export function withOwnership<T extends unknown[]>(
  getOwnerId: (...args: T) => Promise<string> | string,
  handler: (request: Request, ...args: T) => Promise<NextResponse>
) {
  return async (request: Request, ...args: T): Promise<NextResponse> => {
    const ownerId = await getOwnerId(...args)
    const authResult = await requireOwnership(request, ownerId)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    return handler(request, ...args)
  }
}
