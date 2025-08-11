import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const vehicleController = {
  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        include: {
          customer: true,
          services: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.json({
        success: true,
        data: vehicles,
      })
    } catch (error) {
      console.error('Get all vehicles error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          customer: true,
          services: {
            orderBy: {
              scheduledAt: 'desc',
            },
          },
        },
      })

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found',
        })
      }

      res.json({
        success: true,
        data: vehicle,
      })
    } catch (error) {
      console.error('Get vehicle by ID error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async createVehicle(req: Request, res: Response) {
    try {
      const { make, model, year, vin, licensePlate, color, mileage, customerId } = req.body

      // Ensure customer exists
      const customer = await prisma.customer.findUnique({ where: { id: customerId } })
      if (!customer) {
        return res.status(400).json({ success: false, message: 'Customer does not exist' })
      }

      // Check if VIN already exists
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { vin },
      })

      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle with this VIN already exists',
        })
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          make,
          model,
          year,
          vin,
          licensePlate,
          color,
          mileage,
          customerId,
        },
        include: {
          customer: true,
        },
      })

      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle,
      })
    } catch (error) {
      console.error('Create vehicle error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { make, model, year, vin, licensePlate, color, mileage, customerId } = req.body

      if (customerId) {
        const customer = await prisma.customer.findUnique({ where: { id: customerId } })
        if (!customer) {
          return res.status(400).json({ success: false, message: 'Customer does not exist' })
        }
      }

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          make,
          model,
          year,
          vin,
          licensePlate,
          color,
          mileage,
          customerId,
        },
        include: {
          customer: true,
        },
      })

      res.json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      })
    } catch (error) {
      console.error('Update vehicle error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async updateVehicleStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body as { status: 'ACTIVE' | 'IN_SERVICE' | 'INACTIVE' }

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { status },
      })

      res.json({
        success: true,
        message: 'Vehicle status updated successfully',
        data: vehicle,
      })
    } catch (error) {
      console.error('Update vehicle status error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.vehicle.delete({
        where: { id },
      })

      res.json({
        success: true,
        message: 'Vehicle deleted successfully',
      })
    } catch (error) {
      console.error('Delete vehicle error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },
} 