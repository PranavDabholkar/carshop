import { Router } from 'express'
import { dashboardController } from '../controllers/dashboardController'

const router = Router()

// Public routes that don't require authentication
router.get('/public/stats', dashboardController.getPublicStats)
router.get('/public/activity', dashboardController.getPublicActivity)

export default router
