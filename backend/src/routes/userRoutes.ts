import { Router } from 'express'
import { ProfileController } from '../controllers/profileController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/me/profile', requireAuth, ProfileController.getProfile)
router.patch('/me/profile', requireAuth, ProfileController.patchProfile)
router.put('/me/intents', requireAuth, ProfileController.updateIntents)
router.put('/me/skills', requireAuth, ProfileController.updateSkills)
router.put('/me/preferences', requireAuth, ProfileController.updatePreferences)
router.put('/me/transportation', requireAuth, ProfileController.updateTransportation)

export default router
