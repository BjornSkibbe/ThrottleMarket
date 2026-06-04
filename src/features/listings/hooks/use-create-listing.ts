/**
 * Create a new listing mutation
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { logErrorWithStrategy } from '@/lib/logger/client'
import { ApiError, ApiErrorCode } from '@/lib/errors'
import { ListingData } from '@/types'

export function useCreateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ListingData) => {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new ApiError('Failed to create listing', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    onMutate: async (newListing) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.listings.all })

      // Snapshot previous value
      const previousListings = queryClient.getQueryData(queryKeys.listings.all)

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.listings.all, (old: unknown) => {
        const optimisticListing = {
          ...newListing,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
          seller: { id: 'temp', name: 'You', image: null },
          images: newListing.images || [],
          motorcycle: newListing.motorcycle || null,
        }
        if (Array.isArray(old)) {
          return [optimisticListing, ...old]
        }
        return [optimisticListing]
      })

      return { previousListings }
    },
    onError: (error, _, context) => {
      // Rollback to previous value
      if (context?.previousListings) {
        queryClient.setQueryData(queryKeys.listings.all, context.previousListings)
      }
      logErrorWithStrategy(error, { action: 'create_listing' })
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}
