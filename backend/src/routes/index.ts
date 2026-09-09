import { Router } from 'express'
import applicationRoutes from './applicationRoutes.js'
import authRoutes from './authRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import healthRoutes from './healthRoutes.js'
import jobRoutes from './jobRoutes.js'
import serviceRoutes from './serviceRoutes.js'
import skillsRoutes from './skillsRoutes.js'
import userRoutes from './userRoutes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/jobs', jobRoutes)
router.use('/applications', applicationRoutes)
router.use('/skills', skillsRoutes)
router.use('/categories', categoryRoutes)
router.use('/services', serviceRoutes)

export default router
