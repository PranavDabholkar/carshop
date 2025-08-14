import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Import routes
import authRoutes from './routes/auth'
import customerRoutes from './routes/customers'
import vehicleRoutes from './routes/vehicles'
import serviceRoutes from './routes/services'
import activityRoutes from './routes/activity'
import dashboardRoutes from './routes/dashboard'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env['PORT'] || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(limiter)
// Configure CORS with a whitelist. FRONTEND_URL may be a comma-separated list of allowed origins.
const frontendOrigins = (process.env['FRONTEND_URL'] || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl, server-side) where origin is undefined
    if (!origin) return callback(null, true)
    if (frontendOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('CORS not allowed for origin ' + origin))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

// Only start server when not running in serverless environment
if (!process.env['VERCEL']) {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`)
    logger.info(`📊 Health check: http://localhost:${PORT}/health`)
    logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`)
  })
}

export default app