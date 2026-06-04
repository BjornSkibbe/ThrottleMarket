/**
 * User Service
 * 
 * Business logic layer for user operations.
 * This layer contains business rules, validation, and orchestrates repository calls.
 */

import { userRepository, UserPublic } from './user.repository'
import { DatabaseError, DatabaseErrorCode, ValidationError, ValidationErrorCode } from '@/lib/errors'
import { logErrorWithStrategy } from '@/lib/logger/server'

export interface CreateUserInput {
  name: string
  email: string
  password: string
  image?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  image?: string
}

/**
 * User Service Class
 */
export class UserService {
  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<UserPublic> {
    try {
      const user = await userRepository.findById(id)
      
      if (!user) {
        throw new DatabaseError('User not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }
      
      return user
    } catch (error) {
      logErrorWithStrategy(error, { action: 'get_user', userId: id })
      throw error
    }
  }

  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<UserPublic> {
    try {
      const user = await userRepository.findByEmail(email)
      
      if (!user) {
        throw new DatabaseError('User not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }
      
      return user
    } catch (error) {
      logErrorWithStrategy(error, { action: 'get_user_by_email', email })
      throw error
    }
  }

  /**
   * Get multiple users
   */
  async getUsers(options: {
    skip?: number
    take?: number
    where?: {
      email?: string
      name?: string
    }
  } = {}): Promise<UserPublic[]> {
    try {
      return await userRepository.findMany(options)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'get_users', options })
      throw error
    }
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserInput): Promise<UserPublic> {
    try {
      // Business validation
      if (!data.email || !this.isValidEmail(data.email)) {
        throw new ValidationError('Invalid email format', ValidationErrorCode.INVALID_EMAIL)
      }

      if (!data.password || data.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters', ValidationErrorCode.INVALID_RANGE)
      }

      if (!data.name || data.name.length < 2) {
        throw new ValidationError('Name must be at least 2 characters', ValidationErrorCode.INVALID_RANGE)
      }

      // Check if email already exists
      const emailExists = await userRepository.emailExists(data.email)
      if (emailExists) {
        throw new DatabaseError('Email already exists', DatabaseErrorCode.RECORD_ALREADY_EXISTS)
      }

      // Create user through repository
      return await userRepository.create(data)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'create_user', email: data.email })
      throw error
    }
  }

  /**
   * Update a user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<UserPublic> {
    try {
      // Check if user exists
      const existingUser = await userRepository.findById(id)
      if (!existingUser) {
        throw new DatabaseError('User not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }

      // Business validation
      if (data.email !== undefined) {
        if (!this.isValidEmail(data.email)) {
          throw new ValidationError('Invalid email format', ValidationErrorCode.INVALID_EMAIL)
        }

        // Check if email already exists (excluding current user)
        const emailExists = await userRepository.emailExists(data.email, id)
        if (emailExists) {
          throw new DatabaseError('Email already exists', DatabaseErrorCode.RECORD_ALREADY_EXISTS)
        }
      }

      if (data.password !== undefined && data.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters', ValidationErrorCode.INVALID_RANGE)
      }

      if (data.name !== undefined && data.name.length < 2) {
        throw new ValidationError('Name must be at least 2 characters', ValidationErrorCode.INVALID_RANGE)
      }

      // Update user through repository
      return await userRepository.update(id, data)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'update_user', userId: id })
      throw error
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      // Check if user exists
      const existingUser = await userRepository.findById(id)
      if (!existingUser) {
        throw new DatabaseError('User not found', DatabaseErrorCode.RECORD_NOT_FOUND)
      }

      // Delete user through repository
      await userRepository.delete(id)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'delete_user', userId: id })
      throw error
    }
  }

  /**
   * Count users
   */
  async countUsers(where?: {
    email?: string
    name?: string
  }): Promise<number> {
    try {
      return await userRepository.count(where)
    } catch (error) {
      logErrorWithStrategy(error, { action: 'count_users', where })
      throw error
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Export singleton instance
export const userService = new UserService()
