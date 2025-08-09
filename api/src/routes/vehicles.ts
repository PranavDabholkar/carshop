import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest'
import { vehicleController } from '../controllers/vehicleController'

const router = Router()

// Validation schemas
const vehicleSchema = [
  body('make').trim().isLength({ min: 1 }).withMessage('Make is required'),
  body('model').trim().isLength({ min: 1 }).withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Please provide a valid year'),
  body('vin').trim().isLength({ min: 17, max: 17 }).withMessage('VIN must be 17 characters'),
  body('licensePlate').optional().trim(),
  body('color').optional().trim(),
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
  body('customerId').isUUID().withMessage('Valid customer ID is required'),
]

// Routes
router.get('/', vehicleController.getAllVehicles)
router.get('/:id', vehicleController.getVehicleById)
router.post('/', vehicleSchema, validateRequest, vehicleController.createVehicle)
router.put('/:id', vehicleSchema, validateRequest, vehicleController.updateVehicle)
router.delete('/:id', vehicleController.deleteVehicle)

export default router 