export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 500
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super("BAD_REQUEST", message, 400);
  }
}

export class UpstreamError extends AppError {
  constructor(message: string) {
    super("UPSTREAM_ERROR", message, 502);
  }
}
