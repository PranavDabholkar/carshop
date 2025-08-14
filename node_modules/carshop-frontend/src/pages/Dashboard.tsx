import { Helmet } from 'react-helmet-async'
import { 
  UsersIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'
import DashboardTopAuth from '@/components/DashboardTopAuth'
import { useEffect, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import apiClient from '@/lib/api'

type StatCard = { name: string; value: string; icon: ComponentType<SVGProps<SVGSVGElement>> }

type ActivityItem = {
  id: string
  type: 'customer' | 'vehicle' | 'service'
  title: string
  description: string
  timestamp: string
}

export default function Dashboard() {
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatCard[]>([
    { name: 'Total Customers', value: '—', icon: UsersIcon },
    { name: 'Active Vehicles', value: '—', icon: TruckIcon },
    { name: 'Services', value: '—', icon: WrenchScrewdriverIcon },
    { name: 'Revenue', value: '—', icon: CurrencyDollarIcon },
  ])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      console.log('Starting to load dashboard data...')
      try {
        // Fetch public stats and activity in parallel
        const [statsRes, activityRes] = await Promise.all([
          apiClient.get('/dashboard/public/stats'),
          apiClient.get('/dashboard/public/activity')
        ])

        console.log('Dashboard data:', {
          stats: statsRes.data,
          activity: activityRes.data
        })

        // Set activity
        setActivity(activityRes.data.data)

        // Set stats
        const { customers, activeVehicles, services, revenue: revenueNumber } = statsRes.data.data
        const revenue = new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR', 
          maximumFractionDigits: 2 
        }).format(revenueNumber)
        setStats([
          { name: 'Total Customers', value: String(customers), icon: UsersIcon },
          { name: 'Active Vehicles', value: String(activeVehicles), icon: TruckIcon },
          { name: 'Services', value: String(services), icon: WrenchScrewdriverIcon },
          { name: 'Revenue', value: revenue, icon: CurrencyDollarIcon },
        ])
      } catch (e: any) {
        // Always show an error message if loading fails, regardless of auth status
        setError(e?.response?.data?.message || 'Failed to load activity')
      } finally {
        setIsLoading(false)
      }
    }
    load()
    // Refresh periodically so revenue and counts update as services are added
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <Helmet>
        <title>Dashboard - Car Shop Management</title>
      </Helmet>
      
      <div className="space-y-6">
        <DashboardTopAuth />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your car shop operations and performance metrics.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-gray-600">Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : activity.length === 0 ? (
              <div className="text-gray-600">No recent activity yet.</div>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        item.type === 'service' ? 'bg-green-100' : item.type === 'vehicle' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {item.type === 'service' ? (
                          <WrenchScrewdriverIcon className={`h-4 w-4 ${'text-green-600'}`} />
                        ) : item.type === 'vehicle' ? (
                          <TruckIcon className={`h-4 w-4 ${'text-yellow-600'}`} />
                        ) : (
                          <UsersIcon className={`h-4 w-4 ${'text-blue-600'}`} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 