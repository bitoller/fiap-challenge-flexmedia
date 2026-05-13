export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout', public timeoutMs?: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super('NOT_FOUND', message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super('CONFLICT', message);
    this.name = 'ConflictError';
  }
}
