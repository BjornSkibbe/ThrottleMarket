import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MessagingService } from './messaging.service'
import { messagingRepository } from './messaging.repository'

vi.mock('./messaging.repository', () => ({
  messagingRepository: {
    findConversationByListingAndBuyer: vi.fn(),
    createConversation: vi.fn(),
    getUserConversations: vi.fn(),
    verifyConversationAccess: vi.fn(),
    createMessage: vi.fn(),
    getMessages: vi.fn(),
    markMessagesAsRead: vi.fn(),
    getUnreadCount: vi.fn(),
    deleteConversation: vi.fn(),
    getConversationById: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    listing: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

describe('MessagingService', () => {
  const service = new MessagingService()
  const buyerId = 'buyer-1'
  const sellerId = 'seller-1'
  const listingId = 'listing-1'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createConversation', () => {
    it('should create a new conversation when none exists', async () => {
      vi.mocked(prisma.listing.findUnique).mockResolvedValue({ sellerId } as any)
      vi.mocked(messagingRepository.findConversationByListingAndBuyer).mockResolvedValue(null)
      vi.mocked(messagingRepository.createConversation).mockResolvedValue({ id: 'conv-1' } as any)

      const result = await service.createConversation(listingId, buyerId)

      expect(result).toEqual({ id: 'conv-1' })
      expect(messagingRepository.createConversation).toHaveBeenCalledWith(listingId, buyerId, sellerId)
    })

    it('should return existing conversation if found', async () => {
      const existing = { id: 'conv-existing' }
      vi.mocked(prisma.listing.findUnique).mockResolvedValue({ sellerId } as any)
      vi.mocked(messagingRepository.findConversationByListingAndBuyer).mockResolvedValue(existing as any)

      const result = await service.createConversation(listingId, buyerId)

      expect(result).toEqual(existing)
      expect(messagingRepository.createConversation).not.toHaveBeenCalled()
    })

    it('should throw when listing is not found', async () => {
      vi.mocked(prisma.listing.findUnique).mockResolvedValue(null)

      await expect(service.createConversation(listingId, buyerId)).rejects.toThrow('Listing not found')
    })

    it('should throw when buyer is the seller', async () => {
      vi.mocked(prisma.listing.findUnique).mockResolvedValue({ sellerId: buyerId } as any)

      await expect(service.createConversation(listingId, buyerId)).rejects.toThrow('Cannot start conversation with yourself')
    })
  })

  describe('sendMessage', () => {
    it('should send a message after verifying access', async () => {
      vi.mocked(messagingRepository.verifyConversationAccess).mockResolvedValue({ buyerId, sellerId } as any)
      vi.mocked(messagingRepository.createMessage).mockResolvedValue({ id: 'msg-1' } as any)

      const result = await service.sendMessage('conv-1', 'Hello', buyerId)

      expect(messagingRepository.verifyConversationAccess).toHaveBeenCalledWith('conv-1', buyerId)
      expect(messagingRepository.createMessage).toHaveBeenCalledWith('conv-1', buyerId, 'Hello')
      expect(result).toEqual({ id: 'msg-1' })
    })
  })

  describe('deleteConversation', () => {
    it('should delete a conversation via repository', async () => {
      vi.mocked(messagingRepository.deleteConversation).mockResolvedValue(undefined)

      await service.deleteConversation('conv-1', buyerId)

      expect(messagingRepository.deleteConversation).toHaveBeenCalledWith('conv-1', buyerId)
    })
  })
})
