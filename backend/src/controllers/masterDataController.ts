import type { NextFunction, Request, Response } from 'express'
import { MasterDataService } from '../services/masterDataService.js'
import { successResponse } from '../utils/response.js'

export class MasterDataController {
  /**
   * GET /api/skills
   */
  static async getSkills(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MasterDataService.getSkills()
      return res.json(successResponse(data, 'Skills retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/categories/jobs
   */
  static async getJobCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MasterDataService.getJobCategories()
      return res.json(successResponse(data, 'Job categories retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/categories/services
   */
  static async getServiceCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MasterDataService.getServiceCategories()
      return res.json(successResponse(data, 'Service categories retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }
}
