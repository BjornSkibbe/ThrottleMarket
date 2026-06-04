/**
 * Infinite Scroll Listings Hook
 * 
 * Custom hook for implementing infinite scroll with React Query.
 * Provides automatic pagination and data fetching as user scrolls.
 */

'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { ApiError, ApiErrorCode } from '@/lib/errors'

interface InfiniteListingsParams {
  filters?: Record<string, string | number>
  enabled?: boolean
}

export function useInfiniteListings({ filters = {}, enabled = true }: InfiniteListingsParams = {}) {
  const queryClient = useQueryClient()

  return useInfiniteQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({ ...filters, page: String(pageParam) } as Record<string, string>)
      const response = await fetch(`/api/listings?${params}`)
      
      if (!response.ok) {
        throw new ApiError('Failed to fetch listings', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      
      return response.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
