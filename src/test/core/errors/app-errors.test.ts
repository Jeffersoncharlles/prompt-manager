import {
  AppError,
  ConflictError,
  ResourceNotFoundError,
  ValidationError,
} from '@/core/errors/app-errors'

describe('AppErrors', () => {
  it('should create an instance of AppErrors with the correct message', () => {
    const errorMessage = 'An error occurred'
    const error = new AppError(errorMessage)

    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe(errorMessage)
  })

  it('should use default status code in AppError when not provided', () => {
    const error = new AppError('Default status')

    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('AppError')
  })

  it('should have instance ResourceNotFoundError with correct message and status code', () => {
    const resourceName = 'User'
    const error = new ResourceNotFoundError(resourceName)

    expect(error).toBeInstanceOf(ResourceNotFoundError)
    expect(error.message).toBe(`${resourceName}_NOT_FOUND`)
    expect(error.statusCode).toBe(404)
  })

  it('should use default resource in ResourceNotFoundError', () => {
    const error = new ResourceNotFoundError()

    expect(error.message).toBe('Registro_NOT_FOUND')
    expect(error.statusCode).toBe(404)
  })

  it('should have instance ConflictError with correct message and status code', () => {
    const resourceName = 'User'
    const error = new ConflictError(resourceName)

    expect(error).toBeInstanceOf(ConflictError)
    expect(error.message).toBe(`${resourceName}_CONFLICT`)
    expect(error.statusCode).toBe(409)
  })

  it('should use default resource in ConflictError', () => {
    const error = new ConflictError()

    expect(error.message).toBe('RESOURCE_CONFLICT')
    expect(error.statusCode).toBe(409)
  })

  it('should have instance ValidationError with correct message and status code', () => {
    const errorMessage = 'Invalid data'
    const error = new ValidationError(errorMessage)

    expect(error).toBeInstanceOf(ValidationError)
    expect(error.message).toBe(errorMessage)
    expect(error.statusCode).toBe(422)
  })
})
