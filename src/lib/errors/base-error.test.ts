import { describe, it, expect } from 'vitest'
import { BaseError, ErrorSeverity } from './base-error'

class TestError extends BaseError {
  constructor(message: string) {
    super(message, 'TEST_ERROR', { severity: ErrorSeverity.HIGH, statusCode: 418 })
  }
}

describe('BaseError', () => {
  it('should create an error with code and message', () => {
    const error = new TestError('Something failed')
    expect(error.message).toBe('Something failed')
    expect(error.code).toBe('TEST_ERROR')
    expect(error.severity).toBe(ErrorSeverity.HIGH)
    expect(error.statusCode).toBe(418)
  })

  it('should add context', () => {
    const error = new TestError('Context test')
    error.addContext({ userId: '123' })
    expect(error.context).toEqual({ userId: '123' })
  })

  it('should serialize with stack trace', () => {
    const error = new TestError('Serialize test')
    const serialized = error.serialize(true)
    expect(serialized.code).toBe('TEST_ERROR')
    expect(serialized.message).toBe('Serialize test')
    expect(serialized.stack).toBeDefined()
  })

  it('should serialize without stack trace', () => {
    const error = new TestError('Serialize test')
    const serialized = error.serialize(false)
    expect(serialized.stack).toBeUndefined()
  })
})
