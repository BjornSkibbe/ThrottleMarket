import { prisma } from '@/lib/prisma'
import { logBusinessEvent } from '@/lib/logger/server'

import { Prisma } from '@prisma/client'

export class MessagingRepository {
  async findConversationByListingAndBuyer(listingId: string, buyerId: string) {
    return await prisma.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: {
              select: {
                id: true,
                url: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  }

  async createConversation(listingId: string, buyerId: string, sellerId: string) {
    logBusinessEvent('creatingConversation', { listingId, buyerId, sellerId })
    try {
      const conversation = await prisma.conversation.create({
        data: {
          listingId,
          buyerId,
          sellerId,
          participants: {
            create: [
              { userId: buyerId },
              { userId: sellerId },
            ],
          },
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              images: {
                select: {
                  id: true,
                  url: true,
                  order: true,
                },
                orderBy: {
                  order: 'asc',
                },
                take: 1,
              },
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
      logBusinessEvent('conversationCreated', { conversationId: conversation.id })
      return conversation
    } catch (error) {
      // Handle race condition: if conversation already exists, return it
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        logBusinessEvent('conversationRaceCondition', { listingId, buyerId })
        const existingConversation = await this.findConversationByListingAndBuyer(listingId, buyerId)
        if (!existingConversation) {
          throw new Error('Failed to retrieve conversation after race condition')
        }
        return existingConversation
      }
      throw error
    }
  }

  async getUserConversations(
    userId: string,
    options: { page: number; limit: number }
  ) {
    const skip = (options.page - 1) * options.limit

    // Buyers can see all conversations (including ones without messages yet)
    // Sellers can only see conversations that have at least one message
    const where = {
      OR: [
        { buyerId: userId },
        {
          sellerId: userId,
          lastMessage: { not: null },
        },
      ],
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              images: {
                select: {
                  id: true,
                  url: true,
                  order: true,
                },
                orderBy: {
                  order: 'asc',
                },
                take: 1,
              },
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          participants: {
            where: {
              userId,
            },
            select: {
              unreadCount: true,
            },
          },
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
        skip,
        take: options.limit,
      }),
      prisma.conversation.count({
        where,
      }),
    ])

    return {
      data: conversations.map((conv) => ({
        ...conv,
        unreadCount: conv.participants[0]?.unreadCount || 0,
      })),
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    }
  }

  async getConversationById(conversationId: string) {
    return await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: {
              select: {
                id: true,
                url: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  }

  async verifyConversationAccess(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        buyerId: true,
        sellerId: true,
      },
    })

    if (!conversation) {
      throw new Error('Conversation not found')
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new Error('Access denied')
    }

    return conversation
  }

  async getMessages(
    conversationId: string,
    options: { page: number; limit: number }
  ) {
    const skip = (options.page - 1) * options.limit

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: options.limit,
      }),
      prisma.message.count({
        where: { conversationId },
      }),
    ])

    return {
      data: messages,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    }
  }

  async createMessage(
    conversationId: string,
    senderId: string,
    content: string
  ) {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update conversation's last message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
      },
    })

    // Increment unread count for the other participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    })

    if (conversation) {
      const otherUserId = conversation.buyerId === senderId ? conversation.sellerId : conversation.buyerId
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId,
          userId: otherUserId,
        },
        data: {
          unreadCount: {
            increment: 1,
          },
        },
      })
    }

    return message
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    // Update all unread messages from other users
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    // Reset unread count for user
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        unreadCount: 0,
        lastReadAt: new Date(),
      },
    })
  }

  async getUnreadCount(userId: string) {
    const participant = await prisma.conversationParticipant.aggregate({
      where: {
        userId,
        unreadCount: { gt: 0 },
      },
      _sum: {
        unreadCount: true,
      },
    })

    return participant._sum.unreadCount || 0
  }

  async deleteConversation(conversationId: string, userId: string) {
    // Verify user is participant before deleting
    await this.verifyConversationAccess(conversationId, userId)

    // Delete conversation (cascade will delete messages and participants)
    await prisma.conversation.delete({
      where: { id: conversationId },
    })
  }
}

export const messagingRepository = new MessagingRepository()
