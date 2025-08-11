import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest'
import { serviceController } from '../controllers/serviceController'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()

// Validation schemas
const serviceSchema = [
  body('type').trim().isLength({ min: 1 }).withMessage('Service type is required'),
  body('description').optional().trim(),
  body('cost').toFloat().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('scheduledAt').isISO8601().withMessage('Please provide a valid date'),
  // Prisma uses CUIDs in this project
  body('customerId').isString().trim().isLength({ min: 1 }).withMessage('Valid customer ID is required'),
  body('vehicleId').isString().trim().isLength({ min: 1 }).withMessage('Valid vehicle ID is required'),
]

// Routes
router.get('/', requireAuth, serviceController.getAllServices)
router.get('/:id', requireAuth, serviceController.getServiceById)
router.post('/', requireAuth, serviceSchema, validateRequest, serviceController.createService)
router.put('/:id', requireAuth, serviceSchema, validateRequest, serviceController.updateService)
router.delete('/:id', requireAuth, serviceController.deleteService)
router.patch(
  '/:id/status',
  requireAuth,
  body('status').isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
  validateRequest,
  serviceController.updateServiceStatus
)

export default router 