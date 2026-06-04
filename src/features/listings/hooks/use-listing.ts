/**
 * Fetch a single listing by ID
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { CacheTimes, StaleTimes } from '@/lib/react-query/cache'
import { queryKeys } from '@/lib/react-query/keys'
import { ApiError, ApiErrorCode } from '@/lib/errors'

export function useListing(id: string) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/listings/${id}`)
      if (!response.ok) {
        throw new ApiError('Failed to fetch listing', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    staleTime: StaleTimes.LISTING_DETAIL,
    gcTime: CacheTimes.LISTING_DETAIL,
    enabled: !!id, // Only fetch if ID is provided
  })
}
