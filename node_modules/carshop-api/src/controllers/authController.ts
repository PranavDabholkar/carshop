import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env['JWT_SECRET'] || 'fallback-secret',
        { expiresIn: '7d' }
      )

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user },
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env['JWT_SECRET'] || 'fallback-secret',
        { expiresIn: '7d' }
      )

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie('token')
    res.json({
      success: true,
      message: 'Logout successful',
    })
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const token = req.cookies['token']

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
        })
      }

      const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as any

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        })
      }

      res.json({
        success: true,
        data: { user },
      })
    } catch (error) {
      console.error('Get current user error:', error)
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }
  },
}

export default authController 
