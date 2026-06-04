import { messagingRepository } from './messaging.repository'
import { prisma } from '@/lib/prisma'
import { logBusinessEvent } from '@/lib/logger/server'
import { sanitizeContent } from '@/lib/sanitize'

export class MessagingService {
  async createConversation(listingId: string, buyerId: string) {
    logBusinessEvent('createConversation', { listingId, buyerId })
    // Get listing to find seller
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    })

    if (!listing) {
      throw new Error('Listing not found')
    }

    if (listing.sellerId === buyerId) {
      throw new Error('Cannot start conversation with yourself')
    }

    logBusinessEvent('listingFound', { listingId, sellerId: listing.sellerId })

    // Check if conversation already exists
    const existingConversation = await messagingRepository.findConversationByListingAndBuyer(
      listingId,
      buyerId
    )

    if (existingConversation) {
      logBusinessEvent('conversationAlreadyExists', { conversationId: existingConversation.id })
      return existingConversation
    }

    // Create new conversation
    logBusinessEvent('creatingConversation', { listingId, buyerId, sellerId: listing.sellerId })
    return await messagingRepository.createConversation(listingId, buyerId, listing.sellerId)
  }

  async getUserConversations(userId: string, options: { page: number; limit: number }) {
    return await messagingRepository.getUserConversations(userId, options)
  }

  async getConversation(conversationId: string) {
    return await messagingRepository.getConversationById(conversationId)
  }

  async verifyConversationAccess(conversationId: string, userId: string) {
    return await messagingRepository.verifyConversationAccess(conversationId, userId)
  }

  async getMessages(conversationId: string, options: { page: number; limit: number }) {
    return await messagingRepository.getMessages(conversationId, options)
  }

  async sendMessage(conversationId: string, content: string, senderId: string) {
    // Verify user is participant
    await messagingRepository.verifyConversationAccess(conversationId, senderId)

    const sanitizedContent = sanitizeContent(content)
    return await messagingRepository.createMessage(conversationId, senderId, sanitizedContent)
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    // Verify user is participant
    await messagingRepository.verifyConversationAccess(conversationId, userId)

    await messagingRepository.markMessagesAsRead(conversationId, userId)
  }

  async getUnreadCount(userId: string) {
    return await messagingRepository.getUnreadCount(userId)
  }

  async deleteConversation(conversationId: string, userId: string) {
    await messagingRepository.deleteConversation(conversationId, userId)
  }
}

export const messagingService = new MessagingService()
