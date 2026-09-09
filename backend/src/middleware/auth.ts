import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { prisma } from '../utils/prisma.js'
import { errorResponse } from '../utils/response.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    mobile: string
    fullName: string
  }
}

interface JwtPayload {
  id: string
  mobile: string
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('Authentication token required', 'UNAUTHORIZED'))
    }

    const token = authHeader.substring(7).trim()

    if (!token) {
      return res.status(401).json(errorResponse('Authentication token missing', 'UNAUTHORIZED'))
    }

    let decoded: JwtPayload
    try {
      decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
    } catch {
      return res.status(401).json(errorResponse('Invalid or expired authentication token', 'UNAUTHORIZED'))
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, mobile: true, fullName: true },
    })

    if (!user || !user.mobile) {
      return res.status(401).json(errorResponse('User account not found', 'USER_NOT_FOUND'))
    }

    req.user = {
      id: user.id,
      mobile: user.mobile,
      fullName: user.fullName,
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim()
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, mobile: true, fullName: true },
          })
          if (user && user.mobile) {
            req.user = {
              id: user.id,
              mobile: user.mobile,
              fullName: user.fullName,
            }
          }
        } catch {
          // Token invalid, ignore for optional auth
        }
      }
    }

    return next()
  } catch (error) {
    return next(error)
  }
}
