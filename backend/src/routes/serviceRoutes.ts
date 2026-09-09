import { Router } from 'express'
import { ServiceCatalogController } from '../controllers/serviceCatalogController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

router.get('/nearby', optionalAuth, ServiceCatalogController.getNearbyServices)
router.get('/', optionalAuth, ServiceCatalogController.getServices)

export default router
