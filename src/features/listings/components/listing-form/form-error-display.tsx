/**
 * Form Error Display Component
 * 
 * Displays form errors and validation errors in a consistent format.
 */

'use client'

import { z } from 'zod'

interface FormErrorDisplayProps {
  error?: string
  validationErrors?: z.ZodError<unknown> | null
}

export function FormErrorDisplay({ error, validationErrors }: FormErrorDisplayProps) {
  if (!error && !validationErrors) {
    return null
  }

  return (
    <>
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}
      {validationErrors && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          <ul className="list-disc list-inside">
            {validationErrors.issues.map((err) => (
              <li key={err.path?.join('.') || err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
