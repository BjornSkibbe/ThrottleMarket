/**
 * User Repository
 * 
 * Data access layer for user-related database operations.
 * This layer abstracts Prisma queries and provides a clean interface for the service layer.
 */

import { prisma } from '@/lib/prisma'

export interface UserPublic {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * User Repository Class
 */
export class UserRepository {
  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<UserPublic | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<UserPublic | null>
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<UserPublic | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<UserPublic | null>
  }

  /**
   * Find multiple users
   */
  async findMany(options: {
    skip?: number
    take?: number
    where?: {
      email?: string
      name?: string
    }
  } = {}): Promise<UserPublic[]> {
    const { skip = 0, take = 20, where = {} } = options

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }) as Promise<UserPublic[]>
  }

  /**
   * Create a new user
   */
  async create(data: {
    name: string
    email: string
    password: string
    image?: string
  }): Promise<UserPublic> {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<UserPublic>
  }

  /**
   * Update a user
   */
  async update(
    id: string,
    data: {
      name?: string
      email?: string
      password?: string
      image?: string
    }
  ): Promise<UserPublic> {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<UserPublic>
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    })
  }

  /**
   * Count users
   */
  async count(where?: {
    email?: string
    name?: string
  }): Promise<number> {
    return prisma.user.count({ where })
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (!user) {
      return false
    }

    if (excludeId && user.id === excludeId) {
      return false
    }

    return true
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
