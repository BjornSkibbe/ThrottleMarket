'use client'

import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface ConversationItemProps {
  conversation: {
    id: string
    listing: { title: string; images: { url: string }[] }
    buyer: { id: string; name: string | null; image: string | null }
    seller: { id: string; name: string | null; image: string | null }
    lastMessage: string | null
    lastMessageAt: string | null
    unreadCount: number
  }
  isActive?: boolean
  onClick: () => void
  onRequestDelete: (conversationId: string) => void
}

export function ConversationItem({ conversation, isActive, onClick, onRequestDelete }: ConversationItemProps) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // Determine which user is the "other" user (not the current user)
  const otherUser = conversation.buyer.id === currentUserId ? conversation.seller : conversation.buyer

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRequestDelete(conversation.id)
  }

  return (
    <Card
      className={`group/item p-3 cursor-pointer transition-colors bg-muted/50 hover:bg-muted duration-300 ${
        isActive ? 'bg-muted' : 'bg-muted/50'
      }`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        {/* 
          User Avatar Image 
        */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherUser.image || undefined} alt={otherUser.name || 'User'} />
          <AvatarFallback>
            {otherUser.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start mb-1">
            {/* 
              User Name 
            */}
            <h4 className="font-semibold truncate">
              {otherUser.name || 'Anonymous'}
            </h4>
            {/* 
              Unread Count Badge 
            */}
            {conversation.unreadCount > 0 && (
              <span className="ml-2 text-xs text-accent font-bold">
                {conversation.unreadCount}
              </span>
            )}
          </div>
          {/* 
            Listing Title 
          */}
          <p className="text-sm text-muted-foreground truncate">
            {conversation.listing.title}
          </p>
          {/* 
            Most Recent Message 
          */}
          <div className="flex items-center gap-2 mt-1">
            <MessageCircle className="h-4 w-4 text-foreground" />
            <p className="text-xs text-foreground truncate">
              {conversation.lastMessage || 'No messages yet'}
            </p>
          </div>
          {/* 
            Last Message Time 
          */}
          <p className="text-xs text-muted-foreground mt-1">
            {conversation.lastMessageAt
              ? formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })
              : 'Just now'}
          </p>
        </div>
        {/* 
          Delete Conversation Button 
        */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-accent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}