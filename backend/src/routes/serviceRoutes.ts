import { Router } from 'express'
import { ServiceCatalogController } from '../controllers/serviceCatalogController.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/nearby', optionalAuth, ServiceCatalogController.getNearbyServices)
router.get('/', optionalAuth, ServiceCatalogController.getServices)
router.post('/', requireAuth, ServiceCatalogController.createService)
router.patch('/:serviceId', requireAuth, ServiceCatalogController.updateService)
router.delete('/:serviceId', requireAuth, ServiceCatalogController.deleteService)

export default router
