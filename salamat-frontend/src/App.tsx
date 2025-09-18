import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './store/AuthContext'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'))
const DoctorsPage = React.lazy(() => import('./pages/DoctorsPage'))
const BlogPage = React.lazy(() => import('./pages/BlogPage'))
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'))

// Auth pages
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const CompleteProfilePage = React.lazy(() => import('./pages/auth/CompleteProfilePage'))

// Protected pages
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const CheckupRequestPage = React.lazy(() => import('./pages/CheckupRequestPage'))
const HomeSamplingPage = React.lazy(() => import('./pages/HomeSamplingPage'))
const MyRequestsPage = React.lazy(() => import('./pages/MyRequestsPage'))
const FeedbackPage = React.lazy(() => import('./pages/FeedbackPage'))

// Admin pages
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'))

const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:category" element={<ServicesPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctors/:specialty" element={<DoctorsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />

                {/* Authentication Routes */}
                <Route
                  path="/auth/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/complete-profile"
                  element={
                    <ProtectedRoute requireProfileComplete={false}>
                      <CompleteProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkup/request"
                  element={
                    <ProtectedRoute>
                      <CheckupRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/home-sampling/request"
                  element={
                    <ProtectedRoute>
                      <HomeSamplingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-requests"
                  element={
                    <ProtectedRoute>
                      <MyRequestsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/login"
                  element={
                    <PublicRoute>
                      <AdminLoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>

            {/* Toast Notifications */}
            <Toaster
              position="top-center"
              expand={true}
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: 'Shabnam, Tahoma, Arial, sans-serif',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App