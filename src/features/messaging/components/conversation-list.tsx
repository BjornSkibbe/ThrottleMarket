'use client'

import { useState, useCallback } from 'react'
import { useConversations, useDeleteConversation } from '@/features/messaging/hooks/use-conversations'
import { ConversationItem } from './conversation-item'
import { DeleteConversationDialog } from './delete-conversation-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { Frown, MessageCircle, MessageCircleMore, Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

interface ConversationListProps {
  selectedConversationId?: string | null
  onSelectConversation?: (conversationId: string) => void
}

export function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { data, isLoading, error } = useConversations(undefined, true)
  const { isMobile, setOpenMobile } = useSidebar()
  const deleteConversation = useDeleteConversation()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const handleRequestDelete = useCallback((conversationId: string) => {
    setPendingId(conversationId)
    setDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!pendingId) return
    deleteConversation.mutate(pendingId, {
      onSettled: () => {
        setDialogOpen(false)
        setPendingId(null)
      },
    })
  }, [pendingId, deleteConversation])

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-muted-foreground border-2 border-rose-500 rounded-2xl">
        <MessageCircleMore className="mx-auto mb-2 h-8 w-8 text-rose-500"/>
        <p className='text-rose-500'>Failed to load conversations</p>
      </div>
    )
  }

  if (!data?.data?.length) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No conversations yet"
        description="Start a conversation by messaging a seller"
        action={
          <Link href="/marketplace">
            <Button size="lg"><Store /> Browse Marketplace</Button>
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="space-y-2">
        {data.data.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === selectedConversationId}
            onClick={() => {
              onSelectConversation?.(conversation.id)

              // Close sidebar on mobile only
              if (isMobile) {
                setOpenMobile(false)
              }
            }}
            onRequestDelete={handleRequestDelete}
          />
        ))}
      </div>

      <DeleteConversationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmDelete}
        isPending={deleteConversation.isPending}
      />
    </>
  )
}