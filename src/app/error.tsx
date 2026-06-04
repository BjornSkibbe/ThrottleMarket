/**
 * Error Page
 * 
 * Custom error page for server-side errors.
 */

'use client'

import { useEffect } from 'react'
import { logErrorWithStrategy } from '@/lib/logger/client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    logErrorWithStrategy(error, {
      digest: error.digest,
      server: true,
    })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-lg border border-border bg-background px-4 py-2 hover:bg-accent"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
