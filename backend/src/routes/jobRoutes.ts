import { Router } from 'express'
import { JobController } from '../controllers/jobController.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', optionalAuth, JobController.getJobs)
router.post('/', requireAuth, JobController.createJob)
router.get('/nearby', optionalAuth, JobController.getNearbyJobs)
router.get('/me/posted', requireAuth, JobController.getMyPostedJobs)

router.get('/:id', optionalAuth, JobController.getJobById)
router.patch('/:id', requireAuth, JobController.editJob)
router.patch('/:id/cancel', requireAuth, JobController.cancelJob)

router.get('/:id/applications', requireAuth, JobController.getJobApplicationsForPoster)
router.patch('/:jobId/applications/:applicationId', requireAuth, JobController.updateApplicationStatus)
router.get('/:id/assignments', requireAuth, JobController.getJobAssignmentsForPoster)

router.get('/:jobId/application', requireAuth, JobController.getJobApplication)
router.post('/:jobId/applications', requireAuth, JobController.applyForJob)
router.patch('/:jobId/application/withdraw', requireAuth, JobController.withdrawApplication)

router.post('/:jobId/assignments/:assignmentId/completion', requireAuth, JobController.submitWorkCompletion)
router.patch('/:jobId/assignments/:assignmentId/completion', requireAuth, JobController.confirmWorkCompletion)

router.post('/:jobId/ratings', requireAuth, JobController.createJobRating)
router.post('/:jobId/disputes', requireAuth, JobController.createJobDispute)

export default router
