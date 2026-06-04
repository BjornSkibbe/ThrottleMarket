import { fetchClient } from './client'

const API_TIMEOUTS = {
  FETCH: 10000,
  SUBMIT: 15000,
} as const

interface Conversation {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  createdAt: string
  updatedAt: string
  lastMessage: string | null
  lastMessageAt: string | null
  unreadCount: number
  listing: {
    id: string
    title: string
    images: { id: string; url: string; order: number }[]
  }
  buyer: {
    id: string
    name: string | null
    image: string | null
  }
  seller: {
    id: string
    name: string | null
    image: string | null
  }
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
  isRead: boolean
}

interface ConversationsResponse {
  data: Conversation[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface MessagesResponse {
  data: Message[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchConversations(options?: { page?: number; limit?: number }): Promise<ConversationsResponse> {
  const params = new URLSearchParams()
  if (options?.page) params.set('page', options.page.toString())
  if (options?.limit) params.set('limit', options.limit.toString())

  const queryString = params.toString()
  const url = `/api/features/messaging/conversations${queryString ? `?${queryString}` : ''}`

  const response = await fetchClient.get<ConversationsResponse>(url, {
    timeout: API_TIMEOUTS.FETCH,
  })

  return response.data
}

export async function createConversation(listingId: string): Promise<Conversation> {
  const response = await fetchClient.post<Conversation>(
    '/api/features/messaging/conversations',
    { listingId },
    {
      timeout: API_TIMEOUTS.SUBMIT,
    }
  )

  return response.data
}

export async function fetchMessages(
  conversationId: string,
  options?: { page?: number; limit?: number }
): Promise<MessagesResponse> {
  const params = new URLSearchParams()
  if (options?.page) params.set('page', options.page.toString())
  if (options?.limit) params.set('limit', options.limit.toString())

  const queryString = params.toString()
  const url = `/api/features/messaging/messages/${conversationId}${queryString ? `?${queryString}` : ''}`

  const response = await fetchClient.get<MessagesResponse>(url, {
    timeout: API_TIMEOUTS.FETCH,
  })

  return response.data
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const response = await fetchClient.post<Message>(
    '/api/features/messaging/messages',
    { conversationId, content },
    {
      timeout: API_TIMEOUTS.SUBMIT,
    }
  )

  return response.data
}

export async function deleteConversation(conversationId: string): Promise<{ success: boolean }> {
  const response = await fetchClient.delete<{ success: boolean }>(
    `/api/features/messaging/conversations?conversationId=${conversationId}`,
    {
      timeout: API_TIMEOUTS.SUBMIT,
    }
  )

  return response.data
}

export async function markMessagesAsRead(conversationId: string): Promise<void> {
  await fetchClient.patch(
    `/api/features/messaging/messages/${conversationId}`,
    undefined,
    {
      timeout: API_TIMEOUTS.SUBMIT,
    }
  )
}
