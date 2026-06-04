import { z } from 'zod'

export const createConversationSchema = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
})

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation ID'),
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
})

export const getMessagesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
})

export const getConversationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const markAsReadSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation ID'),
})
