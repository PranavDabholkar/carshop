import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Services', href: '/services', icon: WrenchScrewdriverIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-800 bg-primary-700 px-6 pb-4 text-primary-50">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              CarShop
            </h1>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        clsx(
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-primary-100 hover:text-white hover:bg-primary-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )
                      }
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 