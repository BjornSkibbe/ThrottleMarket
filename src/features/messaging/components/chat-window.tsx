'use client'

import { useMessages, useSendMessage, useMarkMessagesAsRead } from '@/features/messaging/hooks'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useRef } from 'react'
import { useSession } from '@/lib/react-query/queries/auth'
import { Frown } from 'lucide-react'

interface ChatWindowProps {
  conversationId: string
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { data, isLoading, error } = useMessages(conversationId)
  const sendMessage = useSendMessage()
  const markMessagesAsRead = useMarkMessagesAsRead()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // Mark messages as read when conversation opens and messages are loaded
  useEffect(() => {
    if (data?.data && data.data.length > 0 && !markMessagesAsRead.isPending) {
      markMessagesAsRead.mutate({ conversationId })
    }
  }, [conversationId, data?.data?.length])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [data?.data?.length])

  const handleSendMessage = (content: string) => {
    sendMessage.mutate({ conversationId, content })
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-muted-foreground border-2 border-border rounded-2xl">
        <Frown className="mx-auto mb-2 h-8 w-8" />
        Failed to load messages
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-90px)]">
      <ScrollArea className="flex-1 p-3 md:p-12" ref={scrollRef}>
        <div className="space-y-4">
          {data?.data?.map((message) => (
            <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
          ))}
        </div>
      </ScrollArea>
      <MessageInput 
        onSend={handleSendMessage}
        disabled={sendMessage.isPending}
      />
    </div>
  )
}