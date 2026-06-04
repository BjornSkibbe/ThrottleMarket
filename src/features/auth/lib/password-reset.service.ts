import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail, generatePasswordResetHtml } from '@/lib/email.service'

export class PasswordResetService {
  static async createResetToken(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        // Don't reveal if user exists or not for security
        return { success: true, message: 'If an account exists with this email, a reset link has been sent.' }
      }

      // Check if user has password (OAuth users might not)
      if (!user.password) {
        return { success: false, message: 'This account uses OAuth sign-in. Please sign in with your provider.' }
      }

      // Delete any existing unused tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
          isUsed: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      })

      // Generate secure token
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      // Save token to database
      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      })

      // Send reset email
      const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password/${token}`
      const emailSent = await sendEmail({
        to: user.email,
        subject: 'Reset your ThrottleMarket password',
        html: generatePasswordResetHtml(resetLink),
      })

      if (!emailSent) {
        // Clean up token if email failed
        await prisma.passwordResetToken.delete({
          where: { token },
        })
        return { success: false, message: 'Failed to send reset email. Please try again.' }
      }

      return { success: true, message: 'If an account exists with this email, a reset link has been sent.' }
    } catch (error) {
      console.error('Password reset request error:', error)
      return { success: false, message: 'Something went wrong. Please try again.' }
    }
  }

  static async validateToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
      })

      if (!resetToken) {
        return { valid: false }
      }

      // Check if token is expired
      if (resetToken.expiresAt < new Date()) {
        return { valid: false }
      }

      // Check if token is already used
      if (resetToken.isUsed) {
        return { valid: false }
      }

      return { valid: true, userId: resetToken.userId }
    } catch (error) {
      console.error('Token validation error:', error)
      return { valid: false }
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate token
      const tokenValidation = await this.validateToken(token)
      if (!tokenValidation.valid || !tokenValidation.userId) {
        return { success: false, message: 'Invalid or expired reset token.' }
      }

      // Hash new password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Update user password
      await prisma.user.update({
        where: { id: tokenValidation.userId },
        data: { password: hashedPassword },
      })

      // Mark token as used
      await prisma.passwordResetToken.update({
        where: { token },
        data: { isUsed: true },
      })

      // Delete any other unused tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: tokenValidation.userId,
          isUsed: false,
          id: { not: token },
        },
      })

      return { success: true, message: 'Password reset successfully. You can now sign in with your new password.' }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, message: 'Something went wrong. Please try again.' }
    }
  }
}
