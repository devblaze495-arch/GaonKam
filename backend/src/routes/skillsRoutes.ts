import { Router } from 'express'
import { MasterDataController } from '../controllers/masterDataController.js'

const router = Router()

router.get('/', MasterDataController.getSkills)

export default router
