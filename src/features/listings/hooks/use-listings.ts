/**
 * Fetch all listings
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { CacheTimes, StaleTimes } from '@/lib/react-query/cache'
import { queryKeys } from '@/lib/react-query/keys'
import { ApiError, ApiErrorCode } from '@/lib/errors'

export function useListings(filters: Record<string, string | number> = {}) {
  return useQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: async () => {
      const response = await fetch(`/api/listings?${new URLSearchParams(filters as Record<string, string>)}`)
      if (!response.ok) {
        throw new ApiError('Failed to fetch listings', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    staleTime: StaleTimes.LISTINGS,
    gcTime: CacheTimes.LISTINGS,
  })
}
