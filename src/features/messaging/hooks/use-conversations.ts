import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { fetchConversations, createConversation, deleteConversation } from '@/lib/api/messaging'
import { toast } from '@/hooks/use-toast'
import { useRef } from 'react'

// React-Query hook fetching conversations with optional paging and polling control.

// Returns useQuery with queryKey from queryKeys.messaging.conversations(options)
// Optional polling via enablePolling toggling refetchInterval to 30s when true

export function useConversations(options?: { page?: number; limit?: number }, enablePolling: boolean = false) {
  return useQuery({
    queryKey: queryKeys.messaging.conversations(options),
    queryFn: () => fetchConversations(options),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: enablePolling ? 30 * 1000 : false, // Only poll if explicitly enabled
  })
}
// React Query mutation to create a new conversation with a listing, guarding against duplicates.

// Uses a request lock via isCreatingRef to prevent concurrent calls
// On success, invalidates conversations cache and shows a toast
// On error, suppresses duplicate-call toast when locked

export function useCreateConversation() {
  const queryClient = useQueryClient()
  const isCreatingRef = useRef(false)

  return useMutation({
    mutationFn: async ({ listingId }: { listingId: string }) => {
      // Request lock: prevent duplicate calls
      if (isCreatingRef.current) {
        throw new Error('Conversation creation already in progress')
      }

      isCreatingRef.current = true
      try {
        return await createConversation(listingId)
      } finally {
        isCreatingRef.current = false
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messaging.conversations() })
      toast({ title: 'Conversation started' })
    },
    onError: (error) => {
      // Don't show toast for request lock errors (duplicate calls)
      if (error.message !== 'Conversation creation already in progress') {
        toast({ title: 'Failed to start conversation', variant: 'destructive' })
      }
    },
  })
}
// React-Query mutation hook to delete a conversation and update UI on success.

// Uses deleteConversation API call.
// Invalidate messaging.conversations cache on success.
// Shows toast: "Conversation deleted" on success, error toast on failure.

export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await deleteConversation(conversationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messaging.conversations() })
      toast({ title: 'Conversation deleted' })
    },
    onError: () => {
      toast({ title: 'Failed to delete conversation', variant: 'destructive' })
    },
  })
}