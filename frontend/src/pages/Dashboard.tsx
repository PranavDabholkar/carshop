import { Helmet } from 'react-helmet-async'
import { 
  UsersIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'
import DashboardTopAuth from '@/components/DashboardTopAuth'

const stats = [
  { name: 'Total Customers', value: '1,234', icon: UsersIcon, change: '+12%', changeType: 'positive' },
  { name: 'Active Vehicles', value: '567', icon: TruckIcon, change: '+5%', changeType: 'positive' },
  { name: 'Services Today', value: '23', icon: WrenchScrewdriverIcon, change: '+8%', changeType: 'positive' },
  { name: 'Revenue This Month', value: '$45,678', icon: CurrencyDollarIcon, change: '+15%', changeType: 'positive' },
]

export default function Dashboard() {
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
                  <item.icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
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
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <WrenchScrewdriverIcon className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Oil change completed for John Doe's 2020 Toyota Camry
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    New customer registration: Jane Smith
                  </p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TruckIcon className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Vehicle added: 2018 Honda Civic for Mike Johnson
                  </p>
                  <p className="text-sm text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 