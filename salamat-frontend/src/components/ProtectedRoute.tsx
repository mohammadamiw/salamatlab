import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import LoadingSpinner from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: ReactNode
  requireProfileComplete?: boolean
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProfileComplete = true,
  adminOnly = false,
}) => {
  const { state } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Check admin permissions
  if (adminOnly && state.user?.email !== 'admin@salamatlab.com') {
    return <Navigate to="/" replace />
  }

  // Check if profile completion is required
  if (requireProfileComplete && !state.isProfileComplete) {
    return <Navigate to="/auth/complete-profile" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
