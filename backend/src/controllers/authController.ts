import type { NextFunction, Request, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { AuthService } from '../services/authService.js'
import { successResponse } from '../utils/response.js'
import { requestOtpSchema, verifyOtpSchema } from '../validators/authValidators.js'

export class AuthController {
  /**
   * POST /api/auth/request-otp
   */
  static async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await requestOtpSchema.parseAsync(req.body)
      const result = await AuthService.requestOtp(validated.phone)
      return res.json(successResponse(result, 'OTP sent successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/auth/verify-otp
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await verifyOtpSchema.parseAsync(req.body)
      const data = await AuthService.verifyOtp(validated.phone, validated.otp)
      return res.json(successResponse(data, 'OTP verified successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/auth/me
   */
  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthenticated',
          errorCode: 'UNAUTHORIZED',
        })
      }
      const data = await AuthService.getCurrentUser(req.user.id)
      return res.json(successResponse(data, 'User details retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(_req: Request, res: Response) {
    return res.json(
      successResponse(
        { info: 'JWT is stateless; frontend should clear stored token' },
        'Logged out successfully',
      ),
    )
  }
}
