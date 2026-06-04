/**
 * Fetch user's listings
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { CacheTimes, StaleTimes } from '@/lib/react-query/cache'
import { queryKeys } from '@/lib/react-query/keys'
import { ApiError, ApiErrorCode } from '@/lib/errors'

export function useUserListings(userId: string) {
  return useQuery({
    queryKey: queryKeys.listings.user(userId),
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/listings`)
      if (!response.ok) {
        throw new ApiError('Failed to fetch user listings', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    staleTime: StaleTimes.USER_LISTINGS,
    gcTime: CacheTimes.USER_LISTINGS,
    enabled: !!userId,
  })
}
