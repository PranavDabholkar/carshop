import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function DashboardTopAuth() {
  const { user, logout, isLoading } = useAuth()
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Welcome{user ? `, ${user.name}` : ''}</h3>
        <p className="text-sm text-gray-600">{user ? 'You are signed in.' : 'Sign in or create an account to manage your shop.'}</p>
      </div>
      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Create account</Link>
          </>
        ) : (
          <button onClick={logout} disabled={isLoading} className="btn btn-outline text-red-700 ring-red-200">
            {isLoading ? 'Signing out...' : 'Logout'}
          </button>
        )}
      </div>
    </div>
  )
}


