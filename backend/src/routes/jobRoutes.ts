import { Router } from 'express'
import { JobController } from '../controllers/jobController.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', optionalAuth, JobController.getJobs)
router.get('/nearby', optionalAuth, JobController.getNearbyJobs)
router.get('/:id', optionalAuth, JobController.getJobById)
router.get('/:jobId/application', requireAuth, JobController.getJobApplication)
router.post('/:jobId/applications', requireAuth, JobController.applyForJob)

export default router
