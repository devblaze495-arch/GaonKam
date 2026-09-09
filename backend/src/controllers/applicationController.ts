import type { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { JobService } from '../services/jobService.js'
import { successResponse } from '../utils/response.js'

export class ApplicationController {
  /**
   * GET /api/applications/me
   */
  static async getMyApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication token required',
          errorCode: 'UNAUTHORIZED',
        })
      }
      const data = await JobService.getUserApplications(req.user.id)
      return res.json(successResponse(data, 'My applications retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }
}
