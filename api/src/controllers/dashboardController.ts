import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dashboardController = {
  async getPublicStats(req: Request, res: Response) {
    try {
      // Get all stats in parallel
      const [customers, vehicles, services] = await Promise.all([
        prisma.customer.findMany(),
        prisma.vehicle.findMany(),
        prisma.service.findMany(),
      ])

      // Calculate aggregated stats
      const totalCustomers = customers.length
      const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE').length
      const totalServices = services.length
      const totalRevenue = services.reduce((sum, service) => sum + (Number(service.cost) || 0), 0)

      res.json({
        success: true,
        data: {
          customers: totalCustomers,
          activeVehicles,
          services: totalServices,
          revenue: totalRevenue,
        },
      })
    } catch (error) {
      console.error('Get public stats error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },

  async getPublicActivity(req: Request, res: Response) {
    try {
      // Get recent services as activity items
      const recentServices = await prisma.service.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: {
            include: {
              customer: true,
            },
          },
        },
      })

      // Format services as activity items
      const activityItems = recentServices.map(service => ({
        id: service.id,
        type: 'service' as const,
        title: `New Service Added`,
        description: `${service.type} service for ${service.vehicle.customer.name}'s vehicle`,
        timestamp: service.createdAt,
      }))

      res.json({
        success: true,
        data: activityItems,
      })
    } catch (error) {
      console.error('Get public activity error:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  },
}
