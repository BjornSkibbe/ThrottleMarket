/**
 * Request Validation Middleware
 * 
 * Middleware functions for validating Next.js API route requests using Zod schemas.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ValidationError, serializeError, ValidationErrorCode } from '../errors'
import { validate } from './validators'

/**
 * Validation middleware configuration
 */
export interface ValidationMiddlewareConfig {
  skipValidation?: boolean
  stripUnknown?: boolean
}

/**
 * Validated request data
 */
export interface ValidatedRequest<T> extends NextRequest {
  validatedData: T
}

/**
 * Create a body validation middleware
 * 
 * @param schema - Zod schema to validate request body against
 * @param config - Middleware configuration
 * @returns Middleware function
 */
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  config: ValidationMiddlewareConfig = {}
) {
  return async (req: NextRequest): Promise<NextResponse | T> => {
    if (config.skipValidation) {
      const body = await req.json()
      return body as T
    }

    try {
      const body = await req.json()
      const validated = validate(schema, body)
      return validated
    } catch (error) {
      if (error instanceof ValidationError) {
        const serialized = serializeError(error, false)
        return NextResponse.json(
          { error: serialized },
          { status: 400 }
        )
      }
      const serialized = serializeError(new ValidationError('Invalid request body', ValidationErrorCode.VALIDATION_ERROR), false)
      return NextResponse.json(
        { error: serialized },
        { status: 400 }
      )
    }
  }
}

/**
 * Create a query validation middleware
 * 
 * @param schema - Zod schema to validate query parameters against
 * @param config - Middleware configuration
 * @returns Middleware function
 */
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  config: ValidationMiddlewareConfig = {}
) {
  return (req: NextRequest): NextResponse | T => {
    if (config.skipValidation) {
      const params = new URL(req.url).searchParams
      return Object.fromEntries(params.entries()) as T
    }

    try {
      const params = new URL(req.url).searchParams
      const query = Object.fromEntries(params.entries())
      const validated = validate(schema, query)
      return validated
    } catch (error) {
      if (error instanceof ValidationError) {
        const serialized = serializeError(error, false)
        return NextResponse.json(
          { error: serialized },
          { status: 400 }
        )
      }
      const serialized = serializeError(new ValidationError('Invalid query parameters', ValidationErrorCode.VALIDATION_ERROR), false)
      return NextResponse.json(
        { error: serialized },
        { status: 400 }
      )
    }
  }
}

/**
 * Create a path parameter validation middleware
 * 
 * @param schema - Zod schema to validate path parameters against
 * @param config - Middleware configuration
 * @returns Middleware function
 */
export function validateParams<T>(
  schema: z.ZodSchema<T>,
  config: ValidationMiddlewareConfig = {}
) {
  return (params: Record<string, string>): NextResponse | T => {
    if (config.skipValidation) {
      return params as T
    }

    try {
      const validated = validate(schema, params)
      return validated
    } catch (error) {
      if (error instanceof ValidationError) {
        const serialized = serializeError(error, false)
        return NextResponse.json(
          { error: serialized },
          { status: 400 }
        )
      }
      const serialized = serializeError(new ValidationError('Invalid path parameters', ValidationErrorCode.VALIDATION_ERROR), false)
      return NextResponse.json(
        { error: serialized },
        { status: 400 }
      )
    }
  }
}

/**
 * Create a combined validation middleware
 * 
 * @param options - Validation options for body, query, and params
 * @returns Middleware function
 */
export function validateRequest<TBody = unknown, TQuery = unknown, TParams = unknown>(options: {
  body?: z.ZodSchema<TBody>
  query?: z.ZodSchema<TQuery>
  params?: z.ZodSchema<TParams>
  config?: ValidationMiddlewareConfig
}) {
  return async (
    req: NextRequest,
    context?: { params?: Record<string, string> }
  ): Promise<NextResponse | { body?: TBody; query?: TQuery; params?: TParams }> => {
    const result: { body?: TBody; query?: TQuery; params?: TParams } = {}
    const config = options.config ?? {}

    // Validate body
    if (options.body) {
      const bodyResult = await validateBody(options.body, config)(req)
      if (bodyResult instanceof NextResponse) {
        return bodyResult
      }
      result.body = bodyResult
    }

    // Validate query
    if (options.query) {
      const queryResult = validateQuery(options.query, config)(req)
      if (queryResult instanceof NextResponse) {
        return queryResult
      }
      result.query = queryResult
    }

    // Validate params
    if (options.params && context?.params) {
      const paramsResult = validateParams(options.params, config)(context.params)
      if (paramsResult instanceof NextResponse) {
        return paramsResult
      }
      result.params = paramsResult
    }

    return result
  }
}

/**
 * Wrapper for API route handlers with validation
 * 
 * @param schema - Zod schema to validate against
 * @param handler - Route handler function
 * @param extractor - Function to extract data from request
 * @returns Wrapped handler function
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, req: NextRequest, context?: unknown) => Promise<NextResponse>,
  extractor: (req: NextRequest, context?: unknown) => Promise<unknown> = (req) => req.json()
) {
  return async (req: NextRequest, context?: unknown): Promise<NextResponse> => {
    try {
      const data = await extractor(req, context)
      const validated = validate(schema, data)
      return handler(validated, req, context)
    } catch (error) {
      if (error instanceof ValidationError) {
        const serialized = serializeError(error, false)
        return NextResponse.json(
          { error: serialized },
          { status: 400 }
        )
      }
      const serialized = serializeError(new ValidationError('Request validation failed', ValidationErrorCode.VALIDATION_ERROR), false)
      return NextResponse.json(
        { error: serialized },
        { status: 400 }
      )
    }
  }
}

/**
 * Helper to extract and validate JSON body
 */
export async function getValidatedBody<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await req.json()
  return validate(schema, body)
}

/**
 * Helper to extract and validate query parameters
 */
export function getValidatedQuery<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): T {
  const params = new URL(req.url).searchParams
  const query = Object.fromEntries(params.entries())
  return validate(schema, query)
}

/**
 * Helper to extract and validate path parameters
 */
export function getValidatedParams<T>(
  params: Record<string, string>,
  schema: z.ZodSchema<T>
): T {
  return validate(schema, params)
}
