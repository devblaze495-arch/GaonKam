import { Router } from 'express'
import { ApplicationController } from '../controllers/applicationController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/me', requireAuth, ApplicationController.getMyApplications)

export default router
