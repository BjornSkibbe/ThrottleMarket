import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  signUpFormSchema,
  loginSchema,
  updatePasswordSchema,
} from './auth.schema'

describe('Auth Schemas', () => {
  describe('registerSchema', () => {
    const validRegistration = {
      email: 'user@example.com',
      password: 'Password123',
      name: 'John Doe',
    }

    it('should validate a correct registration payload', () => {
      const result = registerSchema.safeParse(validRegistration)
      expect(result.success).toBe(true)
    })

    it('should reject an invalid email', () => {
      const invalid = { ...validRegistration, email: 'not-an-email' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a short password', () => {
      const invalid = { ...validRegistration, password: 'short1' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a password without uppercase', () => {
      const invalid = { ...validRegistration, password: 'password123' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a password without a number', () => {
      const invalid = { ...validRegistration, password: 'PasswordABC' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject a short name', () => {
      const invalid = { ...validRegistration, name: 'J' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('signUpFormSchema', () => {
    it('should validate when passwords match', () => {
      const result = signUpFormSchema.safeParse({
        email: 'user@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        name: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should reject when passwords do not match', () => {
      const result = signUpFormSchema.safeParse({
        email: 'user@example.com',
        password: 'Password123',
        confirmPassword: 'Different123',
        name: 'John Doe',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('should validate a correct login payload', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'any-password',
      })
      expect(result.success).toBe(true)
    })

    it('should reject an empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updatePasswordSchema', () => {
    it('should validate a correct password change', () => {
      const result = updatePasswordSchema.safeParse({
        currentPassword: 'old-pass',
        newPassword: 'NewPassword123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject a weak new password', () => {
      const result = updatePasswordSchema.safeParse({
        currentPassword: 'old-pass',
        newPassword: 'weak',
      })
      expect(result.success).toBe(false)
    })
  })
})
