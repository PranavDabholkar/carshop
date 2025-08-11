import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest'
import { customerController } from '../controllers/customerController'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()

// Validation schemas
const customerSchema = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('address').optional().trim(),
]

// Routes
router.get('/', requireAuth, customerController.getAllCustomers)
router.get('/:id', requireAuth, customerController.getCustomerById)
router.post('/', requireAuth, customerSchema, validateRequest, customerController.createCustomer)
router.put('/:id', requireAuth, customerSchema, validateRequest, customerController.updateCustomer)
router.delete('/:id', requireAuth, customerController.deleteCustomer)

export default router 