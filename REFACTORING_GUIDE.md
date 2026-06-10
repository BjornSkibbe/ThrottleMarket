# Production-Level Architecture Refactoring Guide

This document provides installation instructions, usage examples, and integration steps for the new production-level architecture.

## Installation Instructions

Install the required dependencies:

```bash
# Pino logger
npm install pino pino-pretty
npm install -D @types/pino

# React Query (TanStack Query)
npm install @tanstack/react-query @tanstack/react-query-devtools

# Socket.IO (when adding real-time features)
npm install socket.io-client
```

## Architecture Overview

### New Folder Structure

```
src/
├── lib/
│   ├── core/                    # Shared utilities
│   │   ├── result.ts           # Result/Option pattern
│   │   ├── async.ts            # Async utilities
│   │   └── retry.ts            # Retry logic
│   ├── errors/                  # Custom error classes
│   │   ├── base-error.ts       # Base error class
│   │   ├── api-error.ts        # API errors
│   │   ├── database-error.ts   # Database errors
│   │   ├── validation-error.ts # Validation errors
│   │   └── index.ts            # Error exports
│   ├── logger/                  # Pino logging
│   │   ├── logger.ts           # Logger configuration
│   │   ├── middleware.ts       # Logging middleware
│   │   ├── formatters.ts       # Log formatters
│   │   ├── strategy.ts         # Logging strategy
│   │   └── index.ts            # Logger exports
│   ├── validation/              # Zod validation
│   │   ├── schemas/            # Validation schemas
│   │   │   ├── listing.ts
│   │   │   ├── auth.ts
│   │   │   ├── marketplace.ts
│   │   │   └── index.ts
│   │   ├── validators.ts       # Validation functions
│   │   ├── middleware.ts       # Validation middleware
│   │   └── index.ts            # Validation exports
│   ├── api/                     # API layer
│   │   ├── client/             # HTTP client
│   │   │   ├── fetch-client.ts # Enhanced fetch
│   │   │   ├── error-handler.ts # API error handling
│   │   │   └── index.ts
│   │   └── listings/           # Listing API (refactor existing)
│   ├── react-query/             # React Query setup
│   │   ├── providers.tsx       # QueryClient provider
│   │   ├── cache.ts            # Cache configuration
│   │   ├── keys.ts             # Query keys
│   │   ├── queries/            # Query hooks
│   │   │   ├── listings.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── error-handling/          # Global error handling
│   │   ├── global-handler.ts   # Global error handlers
│   │   └── index.ts
│   └── socket/                  # Socket.IO patterns (when needed)
│       ├── error-handling.ts
│       └── index.ts
├── components/
│   └── error-boundary.tsx       # React error boundary
├── app/
│   ├── global-error.tsx         # Global error handler
│   ├── error.tsx               # Error page
│   └── not-found.tsx           # 404 page
```

## Integration Steps

### 1. Initialize Global Error Handler

Add to your app entry point (e.g., `src/app/layout.tsx`):

```typescript
import { initializeGlobalErrorHandler } from '@/lib/error-handling'

initializeGlobalErrorHandler()
```

### 2. Wrap App with QueryClientProvider

Update `src/app/layout.tsx`:

```typescript
import { QueryClientProvider } from '@/lib/react-query'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### 3. Add Error Boundary to Components

Wrap components that might have errors:

```typescript
import { ErrorBoundary } from '@/components/error-boundary'

export default function MyComponent() {
  return (
    <ErrorBoundary>
      <MyComponentContent />
    </ErrorBoundary>
  )
}
```

### 4. Use Validation Middleware in API Routes

Update API routes to use validation:

```typescript
import { validateBody } from '@/lib/validation'
import { createListingSchema } from '@/lib/validation/schemas'

export async function POST(req: Request) {
  const body = await validateBody(req.json(), createListingSchema)
  // Use validated body...
}
```

### 5. Use Query Hooks in Components

Replace direct fetch calls with React Query hooks:

```typescript
import { useListings, useCreateListing } from '@/lib/react-query'

export function MyComponent() {
  const { data: listings, isLoading, error } = useListings()
  const createListing = useCreateListing()

  // Use the data...
}
```

### 6. Use Logger in Your Code

Import and use the logger:

```typescript
import { logger, logUserAction } from '@/lib/logger'

// Basic logging
logger.info('User logged in', { userId })

// Business event logging
logUserAction(userId, 'created_listing', { listingId })
```

### 7. Use Custom Error Classes

Throw custom errors instead of generic errors:

```typescript
import { ValidationError, NotFoundError } from '@/lib/errors'

throw new ValidationError('Invalid input')
throw new NotFoundError('Listing not found', 'listing', listingId)
```

## Usage Examples

### API Client Usage

```typescript
import { fetchClient } from '@/lib/api/client'

const response = await fetchClient.get('/api/listings')
const data = await fetchClient.post('/api/listings', { title: 'My Listing' })
```

### Validation Usage

```typescript
import { validate, createListingSchema } from '@/lib/validation'

const data = validate(createListingSchema, rawData)
```

### Error Handling Usage

```typescript
import { handleApiError } from '@/lib/error-handling'
import { isBaseError } from '@/lib/errors'

try {
  // API call
} catch (error) {
  if (isBaseError(error)) {
    // Handle custom error
  }
  const { message, shouldRetry } = handleApiError(error)
}
```

## Migration Checklist

- [ ] Install required dependencies
- [ ] Initialize global error handler
- [ ] Wrap app with QueryClientProvider
- [ ] Add error boundaries to key components
- [ ] Update API routes to use validation middleware
- [ ] Replace direct fetch calls with React Query hooks
- [ ] Add logging to key operations
- [ ] Replace generic errors with custom error classes
- [ ] Update existing API calls to use fetchClient
- [ ] Test error scenarios
- [ ] Monitor error rates in production

## Final Recommendations

1. **Monitor Errors:** Set up error monitoring (Sentry, LogRocket, etc.)
2. **Performance:** Monitor cache hit rates and API response times
3. **Testing:** Add tests for error scenarios
4. **Documentation:** Document custom error codes and their meanings
5. **Alerting:** Set up alerts for high-severity errors
6. **Review:** Regularly review error logs for patterns
7. **Optimization:** Adjust cache times based on usage patterns

## Common Patterns

### Fetching Data with React Query

```typescript
const { data, isLoading, error, refetch } = useListings({ category: 'MOTORCYCLE' })
```

### Mutating Data with React Query

```typescript
const createListing = useCreateListing()

const handleSubmit = async (data) => {
  try {
    await createListing.mutateAsync(data)
    // Success - cache automatically invalidated
  } catch (error) {
    // Error - automatically logged
  }
}
```

### Logging Business Events

```typescript
logUserAction(userId, 'viewed_listing', { listingId })
logStateChange('listing', listingId, 'DRAFT', 'PUBLISHED')
```

### Handling Errors Gracefully

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

## Next Steps

1. Install dependencies
2. Follow integration steps
3. Test error scenarios
4. Monitor production logs
5. Iterate based on real-world usage
