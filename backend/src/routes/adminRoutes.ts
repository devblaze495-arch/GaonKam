import { Router } from 'express'
import { JobController } from '../controllers/jobController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/disputes', requireAuth, JobController.getAdminDisputes)
router.patch('/disputes/:disputeId', requireAuth, JobController.updateAdminDispute)

export default router
