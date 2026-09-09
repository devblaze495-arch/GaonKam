import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/request-otp', AuthController.requestOtp)
router.post('/verify-otp', AuthController.verifyOtp)
router.get('/me', requireAuth, AuthController.me)
router.post('/logout', AuthController.logout)

export default router
