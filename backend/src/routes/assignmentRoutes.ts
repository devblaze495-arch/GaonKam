import { Router } from 'express'
import { JobController } from '../controllers/jobController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/me', requireAuth, JobController.getWorkerAssignments)

export default router
