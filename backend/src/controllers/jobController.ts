import type { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { JobService } from '../services/jobService.js'
import { successResponse } from '../utils/response.js'
import { createApplicationSchema, getJobsQuerySchema, getNearbyJobsQuerySchema } from '../validators/jobValidators.js'
import { prisma } from '../utils/prisma.js'

export class JobController {
  /**
   * GET /api/jobs
   */
  static async getJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await getJobsQuerySchema.parseAsync(req.query)
      const data = await JobService.getJobs(validated, req.user?.id)
      return res.json(successResponse(data, 'Jobs retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/nearby
   */
  static async getNearbyJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await getNearbyJobsQuerySchema.parseAsync(req.query)
      let village = validated.village
      let taluka = validated.taluka
      let district = validated.district

      if (req.user?.id && (!village && !taluka && !district)) {
        const u = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { village: true, taluka: true, district: true },
        })
        if (u) {
          village = u.village || undefined
          taluka = u.taluka || undefined
          district = u.district || undefined
        }
      }

      const data = await JobService.getNearbyJobs({ village, taluka, district }, req.user?.id)
      return res.json(successResponse(data, 'Nearby jobs retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/:id
   */
  static async getJobById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.id)
      const data = await JobService.getJobById(jobId, req.user?.id)
      return res.json(successResponse(data, 'Job details retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/:jobId/application
   */
  static async getJobApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication token required',
          errorCode: 'UNAUTHORIZED',
        })
      }
      const jobId = String(req.params.jobId)
      const data = await JobService.getUserApplicationForJob(jobId, req.user.id)
      return res.json(successResponse(data, 'Application details retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/jobs/:jobId/applications
   */
  static async applyForJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication token required',
          errorCode: 'UNAUTHORIZED',
        })
      }
      const jobId = String(req.params.jobId)
      const validated = await createApplicationSchema.parseAsync(req.body)
      const data = await JobService.applyForJob(jobId, req.user.id, validated.message)
      return res.status(201).json(successResponse(data, 'Application submitted successfully'))
    } catch (error) {
      return next(error)
    }
  }
}
