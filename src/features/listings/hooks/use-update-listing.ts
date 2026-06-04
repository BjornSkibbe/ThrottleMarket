/**
 * Update a listing mutation
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { logErrorWithStrategy } from '@/lib/logger/client'
import { ApiError, ApiErrorCode } from '@/lib/errors'
import { ListingData } from '@/types'

export function useUpdateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ListingData }) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new ApiError('Failed to update listing', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.listings.all })

      // Snapshot previous value
      const previousListings = queryClient.getQueryData(queryKeys.listings.all)

      // Optimistically update the listing in the list
      queryClient.setQueryData(queryKeys.listings.all, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.map((listing) => 
          (listing as { id: string }).id === id ? { ...listing, ...data } : listing
        )
      })

      return { previousListings }
    },
    onError: (error, _, context) => {
      // Rollback to previous value
      if (context?.previousListings) {
        queryClient.setQueryData(queryKeys.listings.all, context.previousListings)
      }
      logErrorWithStrategy(error, { action: 'update_listing' })
    },
    onSettled: (_, variables) => {
      // Refetch to ensure server state
      const vars = variables as unknown as { id: string }
      if (variables && typeof vars.id === 'string') {
        queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(vars.id) })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}
