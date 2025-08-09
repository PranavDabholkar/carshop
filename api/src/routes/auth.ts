import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest'
import { authController } from '../controllers/authController'

const router = Router()

// Validation schemas
const loginSchema = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const registerSchema = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

// Routes
router.post('/login', loginSchema, validateRequest, authController.login)
router.post('/register', registerSchema, validateRequest, authController.register)
router.post('/logout', authController.logout)
router.get('/me', authController.getCurrentUser)

export default router 