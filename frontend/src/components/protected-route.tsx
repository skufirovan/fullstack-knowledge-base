import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/lib/auth-context'

type Props = {
  onlyUnAuth?: boolean
}

export const ProtectedRoute = ({ onlyUnAuth }: Props) => {
  const { authStatus } = useAuthSession()

  if (authStatus === 'unknown') {
    return null
  }

  if (onlyUnAuth) {
    return authStatus === 'authenticated' ? (
      <Navigate to="/" replace />
    ) : (
      <Outlet />
    )
  }

  return authStatus === 'authenticated' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  )
}
