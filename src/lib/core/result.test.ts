import { describe, it, expect } from 'vitest'
import { success, failure, tryCatch, tryCatchAsync } from './result'
import { BaseError } from '../errors'

class TestError extends BaseError {
  constructor(message: string) {
    super(message, 'TEST_ERROR')
  }
}

describe('Result Pattern', () => {
  describe('success', () => {
    it('should create a successful result with value', () => {
      const result = success(42)
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
      expect(result.value).toBe(42)
    })

    it('should allow void success results', () => {
      const result = success(undefined)
      expect(result.isSuccess()).toBe(true)
      expect(result.value).toBeUndefined()
    })
  })

  describe('failure', () => {
    it('should create a failed result with error', () => {
      const error = new TestError('Something went wrong')
      const result = failure(error)
      expect(result.isSuccess()).toBe(false)
      expect(result.isFailure()).toBe(true)
      expect(result.error).toBe(error)
    })
  })

  describe('tryCatch', () => {
    it('should return success when function does not throw', () => {
      const result = tryCatch(() => 'hello')
      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value).toBe('hello')
      }
    })

    it('should return failure when function throws', () => {
      const result = tryCatch(() => {
        throw new Error('Boom')
      })
      expect(result.isFailure()).toBe(true)
      if (result.isFailure()) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('Boom')
      }
    })
  })

  describe('tryCatchAsync', () => {
    it('should return success when async function resolves', async () => {
      const result = await tryCatchAsync(async () => 'async value')
      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value).toBe('async value')
      }
    })

    it('should return failure when async function rejects', async () => {
      const result = await tryCatchAsync(async () => {
        throw new Error('Async boom')
      })
      expect(result.isFailure()).toBe(true)
      if (result.isFailure()) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe('Async boom')
      }
    })
  })
})
