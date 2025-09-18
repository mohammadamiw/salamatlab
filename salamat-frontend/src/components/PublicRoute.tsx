import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import LoadingSpinner from './ui/LoadingSpinner'

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/',
}) => {
  const { state } = useAuth()

  // Show loading while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect authenticated users away from public routes like login
  if (state.isAuthenticated) {
    // If profile is not complete, redirect to complete profile
    if (!state.isProfileComplete) {
      return <Navigate to="/auth/complete-profile" replace />
    }
    
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default PublicRoute
