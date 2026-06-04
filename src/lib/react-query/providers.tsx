/**
 * React Query Providers
 * 
 * QueryClient configuration and provider components.
 * 
 * NOTE: Requires @tanstack/react-query to be installed:
 * npm install @tanstack/react-query
 */

'use client'

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

/**
 * QueryClient configuration
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        staleTime: 1000 * 60 * 5, // 5 minutes
        
        // Time in milliseconds that unused data remains in cache
        gcTime: 1000 * 60 * 10, // 10 minutes
        
        // Retry failed requests
        retry: (failureCount: number, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error && 'statusCode' in error) {
            const statusCode = (error as { statusCode: number }).statusCode
            if (statusCode >= 400 && statusCode < 500) {
              return false
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3
        },
        
        // Delay between retries (exponential backoff)
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch on window focus
        refetchOnWindowFocus: false,
        
        // Refetch on reconnect
        refetchOnReconnect: true,
        
        // Refetch on mount
        refetchOnMount: true,
      },
      mutations: {
        // Retry failed mutations
        retry: false,
      },
    },
  })
}

/**
 * QueryClientProvider component
 */
export function QueryClientProvider({ children }: { children: ReactNode }) {
  // Note: QueryClient should be created per browser window and not shared across windows
  const [queryClient] = useState(() => createQueryClient())

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {!isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </TanStackQueryClientProvider>
  )
}

/**
 * Get the QueryClient instance (for server-side usage)
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server-side: create a new client for each request
    return createQueryClient()
  }
  // Client-side: should use the provider
  throw new Error('getQueryClient should only be used on the server side. Use the QueryClientProvider on the client side.')
}
