import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const customerController = {
  async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          vehicles: true,
          services: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.json({
        success: true,
        data: customers,
      })
    } catch (error) {
      console.error('Get all customers error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          vehicles: true,
          services: {
            include: {
              vehicle: true,
            },
          },
        },
      })

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        })
      }

      res.json({
        success: true,
        data: customer,
      })
    } catch (error) {
      console.error('Get customer by ID error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async createCustomer(req: Request, res: Response) {
    try {
      const { name, email, phone, address } = req.body

      // Check if customer already exists
      const existingCustomer = await prisma.customer.findUnique({
        where: { email },
      })

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Customer already exists with this email',
        })
      }

      const userId = (req as any).userId || 'temp-user-id'
      const customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          address,
          userId,
        },
      })

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer,
      })
    } catch (error) {
      console.error('Create customer error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email, phone, address } = req.body

      const customer = await prisma.customer.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          address,
        },
      })

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer,
      })
    } catch (error) {
      console.error('Update customer error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.customer.delete({
        where: { id },
      })

      res.json({
        success: true,
        message: 'Customer deleted successfully',
      })
    } catch (error) {
      console.error('Delete customer error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },
} 