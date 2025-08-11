import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { activityController } from '../controllers/activityController'

const router = Router()

router.get('/recent', requireAuth, activityController.getRecentActivity)

export default router


