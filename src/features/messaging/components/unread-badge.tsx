'use client'

import { Badge } from '@/components/ui/badge'
import { useConversations } from '@/features/messaging/hooks/use-conversations'

export function UnreadBadge() {
  const { data } = useConversations(undefined, false)

  const totalUnread = data?.data?.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  ) || 0

  if (totalUnread === 0) {
    return null
  }

  return (
    <Badge variant="default" className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
      {totalUnread > 99 ? '99+' : totalUnread}
    </Badge>
  )
}
