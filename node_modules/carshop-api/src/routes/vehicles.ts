import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest'
import { vehicleController } from '../controllers/vehicleController'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()

// Validation schemas
const vehicleSchema = [
  body('make').trim().isLength({ min: 1 }).withMessage('Make is required'),
  body('model').trim().isLength({ min: 1 }).withMessage('Model is required'),
  body('year')
    .toInt()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  // Relax VIN validation to allow non-standard dev/test VINs
  body('vin').trim().isLength({ min: 8, max: 32 }).withMessage('VIN must be between 8 and 32 characters'),
  body('licensePlate').optional().trim(),
  body('color').optional().trim(),
  body('mileage').optional().toInt().isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
  // Prisma uses CUIDs, not UUIDs
  body('customerId').isString().notEmpty().withMessage('Valid customer ID is required'),
]

// Routes
router.get('/', requireAuth, vehicleController.getAllVehicles)
router.get('/:id', requireAuth, vehicleController.getVehicleById)
router.post('/', requireAuth, vehicleSchema, validateRequest, vehicleController.createVehicle)
router.put('/:id', requireAuth, vehicleSchema, validateRequest, vehicleController.updateVehicle)
router.delete('/:id', requireAuth, vehicleController.deleteVehicle)

// Status update
router.patch(
  '/:id/status',
  requireAuth,
  body('status').isIn(['ACTIVE', 'IN_SERVICE', 'INACTIVE']).withMessage('Invalid status'),
  validateRequest,
  vehicleController.updateVehicleStatus
)

export default router 