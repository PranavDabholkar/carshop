import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function DashboardTopAuth() {
  const { user, logout, isLoading } = useAuth()
  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-primary-800 bg-primary-700 p-4 text-white">
      <div>
        <h3 className="text-lg font-semibold">Welcome{user ? `, ${user.name}` : ''}</h3>
        <p className="text-sm opacity-90">{user ? 'You are signed in.' : 'Sign in or create an account to manage your shop.'}</p>
      </div>
      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login" className="btn bg-white text-primary-700 hover:bg-primary-50">Login</Link>
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50">Create account</Link>
          </>
        ) : (
          <button onClick={logout} disabled={isLoading} className="btn bg-red-600 text-white hover:bg-red-700">
            {isLoading ? 'Signing out...' : 'Logout'}
          </button>
        )}
      </div>
    </div>
  )
}


