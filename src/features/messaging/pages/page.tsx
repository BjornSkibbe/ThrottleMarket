'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChatWindow } from '@/features/messaging/components/chat-window'
import { useCreateConversation } from '@/features/messaging/hooks/use-conversations'
import { Frown, MoveLeft } from 'lucide-react'
import { useSidebarContext } from '@/contexts/sidebar-props-context'

export default function MessagingPage() {
  const { sidebarProps, setSidebarProps } = useSidebarContext()

  const selectedConversationId =
    sidebarProps.selectedConversationId || null

  const hasAttemptedCreationRef = useRef(false)

  const searchParams = useSearchParams()
  const listingId = searchParams.get('listingId')

  const createConversation = useCreateConversation()

  useEffect(() => {
    if (
      listingId &&
      !hasAttemptedCreationRef.current &&
      !createConversation.isPending
    ) {
      hasAttemptedCreationRef.current = true

      createConversation.mutate(
        { listingId },
        {
          onSuccess: (data) => {
            setSidebarProps({
              selectedConversationId: data.id,
            })
          },
        }
      )
    }

    // Cleanup for React Strict Mode
    return () => {
      if (!listingId) {
        hasAttemptedCreationRef.current = false
      }
    }
  }, [listingId, createConversation, setSidebarProps])

  return (
    <div className="px-3 sm:px-6 min-h-[calc(100vh-94px)]">
      <div className="flex flex-col md:flex-row gap-6 mx-auto w-full bg-muted/20 rounded-4xl h-full">
        {/* 
          ChatWindow COMPONENT 
        */}
        <div className="flex flex-1 flex-col">
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
            />
          ) : (
            <div className="p-6 text-center text-muted-foreground py-48">
              <MoveLeft className="mx-auto mb-2 h-8 w-8 text-accent" />
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}