import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../types/models'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, hasRole } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles?.length && !hasRole(...roles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
