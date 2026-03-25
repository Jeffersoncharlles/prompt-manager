export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 400,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(resource = 'Registro') {
    super(`${resource}_NOT_FOUND`, 404)
    this.name = 'ResourceNotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(resource = 'RESOURCE') {
    super(`${resource}_CONFLICT`, 409)
    this.name = 'ConflictError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422)
    this.name = 'ValidationError'
  }
}
