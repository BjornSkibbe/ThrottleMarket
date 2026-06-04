/**
 * Delete a listing mutation
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { logErrorWithStrategy } from '@/lib/logger/client'
import { ApiError, ApiErrorCode } from '@/lib/errors'

export function useDeleteListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new ApiError('Failed to delete listing', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.listings.all })

      // Snapshot previous value
      const previousListings = queryClient.getQueryData(queryKeys.listings.all)

      // Optimistically remove the listing from the list
      queryClient.setQueryData(queryKeys.listings.all, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.filter((listing) => (listing as { id: string }).id !== id)
      })

      return { previousListings }
    },
    onError: (error, _, context) => {
      // Rollback to previous value
      if (context?.previousListings) {
        queryClient.setQueryData(queryKeys.listings.all, context.previousListings)
      }
      logErrorWithStrategy(error, { action: 'delete_listing' })
    },
    onSettled: (_, variables) => {
      // Refetch to ensure server state
      if (variables && typeof variables === 'string') {
        queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(variables) })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}
