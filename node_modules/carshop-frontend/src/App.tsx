import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Customers from '@/pages/Customers'
import Vehicles from '@/pages/Vehicles'
import Services from '@/pages/Services'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return (
    <>
      <Helmet>
        <title>Car Shop Management System</title>
        <meta name="description" content="Comprehensive car shop management system for automotive service operations" />
      </Helmet>
      
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={<Layout />}
          >
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route
              path="vehicles"
              element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App 