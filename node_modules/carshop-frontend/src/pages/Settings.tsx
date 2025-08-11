import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'

export default function Settings() {
  const { user, logout } = useAuth()

  return (
    <>
      <Helmet>
        <title>Settings - Car Shop Management</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <Cog6ToothIcon className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h2>
          </div>
          <p className="mt-1 text-sm text-gray-700">Manage your account and support options.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-primary-800 bg-primary-700 p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Account</h3>
              {user ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm opacity-90">Signed in as</div>
                    <div className="font-medium">{user.name} ({user.email})</div>
                    <div className="text-xs opacity-90 break-all">ID: {user.id}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={logout} className="btn bg-red-600 text-white hover:bg-red-700" aria-label="Logout">Logout</button>
                    <Link to="/" className="btn bg-white text-primary-700 hover:bg-primary-50 inline-flex items-center">
                      <HomeIcon className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="opacity-90">You are not signed in.</div>
                  <div className="flex gap-3">
                    <Link to="/login" className="btn bg-white text-primary-700 hover:bg-primary-50">Login</Link>
                    <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50">Register</Link>
                    <Link to="/" className="btn bg-white text-primary-700 hover:bg-primary-50 inline-flex items-center">
                      <HomeIcon className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                  </div>
                </div>
              )}
          </div>

          <div className="rounded-lg border border-primary-800 bg-primary-700 p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
            <ul className="space-y-2">
                <li>
                  Phone: <a href="tel:+18001234567" className="underline">+1 (800) 123-4567</a>
                </li>
                <li>
                  WhatsApp: <a href="https://wa.me/18001234567" target="_blank" rel="noreferrer" className="underline">+1 (800) 123-4567</a>
                </li>
                <li>
                  Email: <a href="mailto:support@carshop.local" className="underline">support@carshop.local</a>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}


