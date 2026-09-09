import { Router } from 'express'
import { MasterDataController } from '../controllers/masterDataController.js'

const router = Router()

router.get('/jobs', MasterDataController.getJobCategories)
router.get('/services', MasterDataController.getServiceCategories)

export default router
