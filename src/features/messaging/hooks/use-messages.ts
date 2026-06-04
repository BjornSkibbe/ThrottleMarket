import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { fetchMessages, sendMessage, markMessagesAsRead } from '@/lib/api/messaging'
import { toast } from '@/hooks/use-toast'

export function useMessages(conversationId: string, options?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.messaging.messages(conversationId, options),
    queryFn: () => fetchMessages(conversationId, options),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 10 * 1000, // Poll every 10 seconds for active chat
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendMessage(conversationId, content),
    onMutate: async ({ conversationId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.messaging.messages(conversationId) 
      })

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        queryKeys.messaging.messages(conversationId)
      )

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.messaging.messages(conversationId),
        (old: unknown) => {
          const messages = old as { data: unknown[] } | undefined
          return {
            ...messages,
            data: [
              ...(messages?.data ?? []),
              {
                id: 'temp-' + Date.now(),
                content,
                senderId: 'current-user',
                createdAt: new Date().toISOString(),
                isRead: false,
                isOptimistic: true,
              },
            ],
          }
        }
      )

      return { previousMessages }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.messaging.messages(variables.conversationId),
        context?.previousMessages
      )
      toast({ title: 'Failed to send message', variant: 'destructive' })
    },
    onSettled: (data, error, variables) => {
      // Refetch after settle
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.messaging.messages(variables.conversationId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.messaging.conversations() 
      })
    },
  })
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId }: { conversationId: string }) =>
      markMessagesAsRead(conversationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messaging.messages(variables.conversationId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.messaging.conversations(),
      })
    },
  })
}