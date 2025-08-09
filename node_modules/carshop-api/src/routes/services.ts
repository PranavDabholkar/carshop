import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest'
import { serviceController } from '../controllers/serviceController'

const router = Router()

// Validation schemas
const serviceSchema = [
  body('type').trim().isLength({ min: 1 }).withMessage('Service type is required'),
  body('description').optional().trim(),
  body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('scheduledAt').isISO8601().withMessage('Please provide a valid date'),
  body('customerId').isUUID().withMessage('Valid customer ID is required'),
  body('vehicleId').isUUID().withMessage('Valid vehicle ID is required'),
]

// Routes
router.get('/', serviceController.getAllServices)
router.get('/:id', serviceController.getServiceById)
router.post('/', serviceSchema, validateRequest, serviceController.createService)
router.put('/:id', serviceSchema, validateRequest, serviceController.updateService)
router.delete('/:id', serviceController.deleteService)
router.patch('/:id/status', serviceController.updateServiceStatus)

export default router 