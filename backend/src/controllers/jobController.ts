import type { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { JobService } from '../services/jobService.js'
import { successResponse } from '../utils/response.js'
import {
  createApplicationSchema,
  createDisputeSchema,
  createJobSchema,
  createRatingSchema,
  editJobSchema,
  getJobsQuerySchema,
  getNearbyJobsQuerySchema,
  updateApplicationStatusSchema,
  updateDisputeSchema,
} from '../validators/jobValidators.js'
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
   * POST /api/jobs (Create Job)
   */
  static async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await createJobSchema.parseAsync(req.body)
      const data = await JobService.createJob(req.user!.id, validated)
      return res.status(201).json(successResponse(data, 'Job created successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/me/posted (My Posted Jobs)
   */
  static async getMyPostedJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await JobService.getMyPostedJobs(req.user!.id)
      return res.json(successResponse(data, 'My posted jobs retrieved successfully'))
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
   * PATCH /api/jobs/:id (Edit Job)
   */
  static async editJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.id)
      const validated = await editJobSchema.parseAsync(req.body)
      const data = await JobService.editJob(jobId, req.user!.id, validated)
      return res.json(successResponse(data, 'Job updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/jobs/:id/cancel (Cancel Job)
   */
  static async cancelJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.id)
      const data = await JobService.cancelJob(jobId, req.user!.id)
      return res.json(successResponse(data, 'Job cancelled successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/:id/applications (Poster Application Management)
   */
  static async getJobApplicationsForPoster(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.id)
      const data = await JobService.getJobApplicationsForPoster(jobId, req.user!.id)
      return res.json(successResponse(data, 'Applications retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/jobs/:jobId/applications/:applicationId (Accept/Reject Application)
   */
  static async updateApplicationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const applicationId = String(req.params.applicationId)
      const validated = await updateApplicationStatusSchema.parseAsync(req.body)
      const data = await JobService.updateApplicationStatus(jobId, applicationId, req.user!.id, validated.status)
      return res.json(successResponse(data, `Application ${validated.status} successfully`))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/:id/assignments (Poster Assignments)
   */
  static async getJobAssignmentsForPoster(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.id)
      const data = await JobService.getJobAssignmentsForPoster(jobId, req.user!.id)
      return res.json(successResponse(data, 'Assignments retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/assignments/me (Worker Assignments)
   */
  static async getWorkerAssignments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await JobService.getWorkerAssignments(req.user!.id)
      return res.json(successResponse(data, 'Worker assignments retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/jobs/:jobId/application (Current User Application Status)
   */
  static async getJobApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const data = await JobService.getUserApplicationForJob(jobId, req.user!.id)
      return res.json(successResponse(data, 'Application details retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/jobs/:jobId/applications (Apply for Job)
   */
  static async applyForJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const validated = await createApplicationSchema.parseAsync(req.body)
      const data = await JobService.applyForJob(jobId, req.user!.id, validated.message)
      return res.status(201).json(successResponse(data, 'Application submitted successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/jobs/:jobId/application/withdraw (Withdraw Application)
   */
  static async withdrawApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const data = await JobService.withdrawApplication(jobId, req.user!.id)
      return res.json(successResponse(data, 'Application withdrawn successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/jobs/:jobId/assignments/:assignmentId/completion (Worker Submit Completion)
   */
  static async submitWorkCompletion(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const assignmentId = String(req.params.assignmentId)
      const data = await JobService.submitWorkCompletion(jobId, assignmentId, req.user!.id)
      return res.json(successResponse(data, 'Work completion submitted successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/jobs/:jobId/assignments/:assignmentId/completion (Poster Confirm Completion)
   */
  static async confirmWorkCompletion(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const assignmentId = String(req.params.assignmentId)
      const data = await JobService.confirmWorkCompletion(jobId, assignmentId, req.user!.id)
      return res.json(successResponse(data, 'Work completion confirmed successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/jobs/:jobId/ratings (Ratings & Reviews)
   */
  static async createJobRating(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const validated = await createRatingSchema.parseAsync(req.body)
      const data = await JobService.createJobRating(jobId, req.user!.id, validated)
      return res.status(201).json(successResponse(data, 'Rating submitted successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/jobs/:jobId/disputes (Disputes)
   */
  static async createJobDispute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId)
      const validated = await createDisputeSchema.parseAsync(req.body)
      const data = await JobService.createJobDispute(jobId, req.user!.id, validated)
      return res.status(201).json(successResponse(data, 'Dispute raised successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/admin/disputes (Admin Disputes)
   */
  static async getAdminDisputes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await JobService.getAdminDisputes(req.user!.id)
      return res.json(successResponse(data, 'Admin disputes retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/admin/disputes/:disputeId (Admin Manage Dispute)
   */
  static async updateAdminDispute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const disputeId = String(req.params.disputeId)
      const validated = await updateDisputeSchema.parseAsync(req.body)
      const data = await JobService.updateAdminDispute(disputeId, req.user!.id, validated)
      return res.json(successResponse(data, 'Dispute updated successfully'))
    } catch (error) {
      return next(error)
    }
  }
}
