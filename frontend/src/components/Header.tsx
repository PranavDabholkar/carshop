import { BellIcon } from '@heroicons/react/24/outline'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-primary-800 bg-primary-700 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-primary-200 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-primary-600"
            aria-hidden="true"
          />

          <div className="flex items-center gap-x-4">
            <div className="-m-1.5 flex items-center p-1.5">
              <UserCircleIcon className="h-8 w-8 text-primary-200" aria-hidden="true" />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">
                  {user?.name ?? 'User'}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 