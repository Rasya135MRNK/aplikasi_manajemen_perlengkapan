import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
