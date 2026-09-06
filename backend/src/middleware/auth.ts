import type { NextFunction, Request, Response } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email?: string | null
    role?: string
  }
}

export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authentication required')
    ;(error as Error & { statusCode?: number }).statusCode = 401
    return next(error)
  }

  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    const error = new Error('Authentication token is missing')
    ;(error as Error & { statusCode?: number }).statusCode = 401
    return next(error)
  }

  req.user = {
    id: 'placeholder-user-id',
    email: 'placeholder@example.com',
    role: 'USER',
  }

  return next()
}
