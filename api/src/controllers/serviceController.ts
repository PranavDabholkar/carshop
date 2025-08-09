import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const serviceController = {
  async getAllServices(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        include: {
          customer: true,
          vehicle: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      })

      res.json({
        success: true,
        data: services,
      })
    } catch (error) {
      console.error('Get all services error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async getServiceById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          customer: true,
          vehicle: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        })
      }

      res.json({
        success: true,
        data: service,
      })
    } catch (error) {
      console.error('Get service by ID error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async createService(req: Request, res: Response) {
    try {
      const { type, description, cost, scheduledAt, customerId, vehicleId } = req.body

      const service = await prisma.service.create({
        data: {
          type,
          description,
          cost,
          scheduledAt: new Date(scheduledAt),
          customerId,
          vehicleId,
          userId: 'temp-user-id', // TODO: Get from auth middleware
        },
        include: {
          customer: true,
          vehicle: true,
        },
      })

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: service,
      })
    } catch (error) {
      console.error('Create service error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async updateService(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { type, description, cost, scheduledAt, customerId, vehicleId } = req.body

      const service = await prisma.service.update({
        where: { id },
        data: {
          type,
          description,
          cost,
          scheduledAt: new Date(scheduledAt),
          customerId,
          vehicleId,
        },
        include: {
          customer: true,
          vehicle: true,
        },
      })

      res.json({
        success: true,
        message: 'Service updated successfully',
        data: service,
      })
    } catch (error) {
      console.error('Update service error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async deleteService(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.service.delete({
        where: { id },
      })

      res.json({
        success: true,
        message: 'Service deleted successfully',
      })
    } catch (error) {
      console.error('Delete service error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async updateServiceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body

      const updateData: any = { status }
      
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }

      const service = await prisma.service.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
          vehicle: true,
        },
      })

      res.json({
        success: true,
        message: 'Service status updated successfully',
        data: service,
      })
    } catch (error) {
      console.error('Update service status error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },
} 