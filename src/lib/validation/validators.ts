/**
 * Validation Functions
 * 
 * Centralized validation functions that use Zod schemas and integrate
 * with custom error classes.
 */

import { z } from 'zod'
import { ZodValidationError, ValidationError } from '../errors'
import { success, failure, type Result } from '../core/result'

/**
 * Validate data against a Zod schema
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated and typed data
 * @throws ValidationError if validation fails
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new ZodValidationError('Validation failed', result.error)
  }

  return result.data
}

/**
 * Validate data against a Zod schema asynchronously
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated and typed data
 * @throws ValidationError if validation fails
 */
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  const result = await schema.safeParseAsync(data)

  if (!result.success) {
    throw new ZodValidationError('Validation failed', result.error)
  }

  return result.data
}

/**
 * Validate data and return a Result type
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Result with validated data or ValidationError
 */
export function validateResult<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Result<T, ValidationError> {
  const result = schema.safeParse(data)

  if (!result.success) {
    return failure(new ZodValidationError('Validation failed', result.error))
  }

  return success(result.data)
}

/**
 * Validate data asynchronously and return a Result type
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Result with validated data or ValidationError
 */
export async function validateResultAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<Result<T, ValidationError>> {
  const result = await schema.safeParseAsync(data)

  if (!result.success) {
    return failure(new ZodValidationError('Validation failed', result.error))
  }

  return success(result.data)
}

/**
 * Validate partial data against a schema
 * 
 * @param schema - The Zod schema to validate against (must be an object schema)
 * @param data - The partial data to validate
 * @returns The validated and typed partial data
 * @throws ValidationError if validation fails
 */
export function validatePartial<T>(
  schema: z.ZodObject<z.ZodRawShape>,
  data: unknown
): Partial<T> {
  const partialSchema = schema.partial()
  return validate(partialSchema, data) as Partial<T>
}

/**
 * Validate request body for API routes
 * 
 * @param schema - The Zod schema to validate against
 * @param body - The request body
 * @returns The validated and typed body
 * @throws ValidationError if validation fails
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  return validate(schema, body)
}

/**
 * Validate query parameters for API routes
 * 
 * @param schema - The Zod schema to validate against
 * @param query - The query parameters
 * @returns The validated and typed query parameters
 * @throws ValidationError if validation fails
 */
export function validateQueryParams<T>(schema: z.ZodSchema<T>, query: unknown): T {
  return validate(schema, query)
}

/**
 * Validate path parameters for API routes
 * 
 * @param schema - The Zod schema to validate against
 * @param params - The path parameters
 * @returns The validated and typed path parameters
 * @throws ValidationError if validation fails
 */
export function validatePathParams<T>(schema: z.ZodSchema<T>, params: unknown): T {
  return validate(schema, params)
}

/**
 * Create a validation middleware for Next.js API routes
 * 
 * @param schema - The Zod schema to validate against
 * @param extractor - Function to extract data from the request
 * @returns Middleware function
 */
export function createValidationMiddleware<T>(
  schema: z.ZodSchema<T>,
  extractor: (req: Request) => unknown
) {
  return (req: Request): T => {
    const data = extractor(req)
    return validate(schema, data)
  }
}
