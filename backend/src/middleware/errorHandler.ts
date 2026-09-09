import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errorCode: 'NOT_FOUND',
  })
}

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const issue = error.issues[0]
    const message = issue ? `${issue.path.join('.')}: ${issue.message}` : 'Validation error'
    return res.status(400).json({
      success: false,
      message,
      errorCode: 'VALIDATION_ERROR',
    })
  }

  // Custom status code and error code attached to Error object
  const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500
  const errorCode = error.errorCode || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST')
  const message = error.message || 'An unexpected error occurred'

  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  })
}
