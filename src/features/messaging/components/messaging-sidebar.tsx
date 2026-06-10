"use client"

import { MessageSquare } from "lucide-react"
import { SidebarShell } from "@/components/sidebar-shell"
import { ConversationList } from "@/features/messaging/components/conversation-list"

interface MessagingSidebarProps {
  selectedConversationId?: string | null
  onSelectConversation?: (conversationId: string) => void
}

export function MessagingSidebar({
  selectedConversationId,
  onSelectConversation,
}: MessagingSidebarProps) {
  return (
    <SidebarShell
      icon={MessageSquare}
      title="Messages"
      description="Manage your conversations"
      transparent
      cardClassName="h-screen"
    >
      <ConversationList
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
      />
    </SidebarShell>
  )
}
