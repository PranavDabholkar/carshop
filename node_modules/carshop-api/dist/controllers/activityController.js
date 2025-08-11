"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.activityController = {
    async getRecentActivity(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.json({ success: true, data: [] });
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
            ]);
            const activities = [];
            for (const c of customers) {
                activities.push({
                    id: `customer:${c.id}`,
                    type: 'customer',
                    title: 'New customer',
                    description: `${c.name}`,
                    timestamp: c.createdAt.toISOString(),
                });
            }
            for (const v of vehicles) {
                activities.push({
                    id: `vehicle:${v.id}`,
                    type: 'vehicle',
                    title: 'Vehicle added',
                    description: `${v.year} ${v.make} ${v.model} for ${v.customer?.name ?? 'customer'}`,
                    timestamp: v.createdAt.toISOString(),
                });
            }
            for (const s of services) {
                activities.push({
                    id: `service:${s.id}`,
                    type: 'service',
                    title: s.status === 'COMPLETED' ? 'Service completed' : 'Service scheduled',
                    description: `${s.type} for ${s.customer?.name ?? 'customer'} on ${new Date(s.scheduledAt).toLocaleString()}`,
                    timestamp: s.createdAt.toISOString(),
                });
            }
            activities.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
            res.json({ success: true, data: activities.slice(0, 15) });
        }
        catch (error) {
            console.error('Get recent activity error:', error);
            res.status(200).json({ success: true, data: [] });
        }
    },
};
//# sourceMappingURL=activityController.js.map