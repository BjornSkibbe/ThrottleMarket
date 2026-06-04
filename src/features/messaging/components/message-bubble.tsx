'use client'

import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    senderId: string
    sender?: { name: string | null; image: string | null }
    createdAt: string
    isRead: boolean
    isOptimistic?: boolean
  }
  currentUserId: string
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwn = message.senderId === currentUserId

  return (
    <div
      className={cn(
        'flex gap-3',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender?.image || undefined} alt={message.sender?.name || 'User'} />
        <AvatarFallback className="border-0">{message.sender?.name?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <Card
        className={cn(
          'max-w-[70%] p-6',
          isOwn 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted',
          message.isOptimistic && 'opacity-50'
        )}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs opacity-70">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </p>
          {isOwn && !message.isOptimistic && (
            <span className="text-xs opacity-70">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </Card>
    </div>
  )
}
