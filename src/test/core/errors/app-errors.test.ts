import { AppError } from '@/core/errors/app-errors'

describe('AppErrors', () => {
  it('should create an instance of AppErrors with the correct message', () => {
    const errorMessage = 'An error occurred'
    const error = new AppError(errorMessage)

    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe(errorMessage)
  })
})
