import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageLoader } from './LoadingSpinner'

/**
 * Wraps any route that requires the user to be logged in.
 * Optionally restricts by role ('student' | 'teacher' | 'admin').
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader label="Authenticating..." />

  // Not logged in → redirect to login, keeping the intended destination
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role check (only when allowedRole is specified)
  if (allowedRole && userProfile?.role !== allowedRole) {
    const roleHome = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin:   '/admin/dashboard',
    }
    return <Navigate to={roleHome[userProfile?.role] ?? '/'} replace />
  }

  return children
}
