import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ActivityItem = {
  id: string
  type: 'customer' | 'vehicle' | 'service'
  title: string
  description: string
  timestamp: string
}

export const activityController = {
  async getRecentActivity(req: Request, res: Response) {
    try {
      const userId = (req as any).userId as string | undefined
      if (!userId) {
        // For dashboard UX, return empty activity when unauthenticated
        return res.json({ success: true, data: [] })
      }

      const [customers, vehicles, services] = await Promise.all([
        prisma.customer.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { id: true, name: true, email: true, createdAt: true },
        }),
        prisma.vehicle.findMany({
          where: { customer: { userId } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { customer: { select: { name: true } } },
        }),
        prisma.service.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            customer: { select: { name: true } },
            vehicle: { select: { make: true, model: true, year: true } },
          },
        }),
      ])

      const activities: ActivityItem[] = []

      for (const c of customers) {
        activities.push({
          id: `customer:${c.id}`,
          type: 'customer',
          title: 'New customer',
          description: `${c.name}`,
          timestamp: c.createdAt.toISOString(),
        })
      }

      for (const v of vehicles) {
        activities.push({
          id: `vehicle:${v.id}`,
          type: 'vehicle',
          title: 'Vehicle added',
          description: `${v.year} ${v.make} ${v.model} for ${v.customer?.name ?? 'customer'}`,
          timestamp: v.createdAt.toISOString(),
        })
      }

      for (const s of services) {
        activities.push({
          id: `service:${s.id}`,
          type: 'service',
          title: s.status === 'COMPLETED' ? 'Service completed' : 'Service scheduled',
          description: `${s.type} for ${s.customer?.name ?? 'customer'} on ${new Date(s.scheduledAt).toLocaleString()}`,
          timestamp: s.createdAt.toISOString(),
        })
      }

      activities.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

      res.json({ success: true, data: activities.slice(0, 15) })
    } catch (error) {
      console.error('Get recent activity error:', error)
      // Fail-soft: return empty activity list instead of error to avoid breaking dashboard
      res.status(200).json({ success: true, data: [] })
    }
  },
}


