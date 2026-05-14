import { useEffect } from 'react'
import { authApi } from '@/lib/api/auth-api'
import { useAuthSession } from '@/lib/auth-context'
import { initDeviceId } from '@/lib/deviceId'

type Props = {
  children: React.ReactNode
}

export const AuthBootstrap = ({ children }: Props) => {
  const { setAuthenticated, setAuthStatus } = useAuthSession()

  useEffect(() => {
    const bootstrap = async () => {
      try {
        initDeviceId()

        const response = await authApi.refresh()

        setAuthenticated(response.accessToken, response.user)
      } catch (error) {
        setAuthStatus('unauthenticated')
      }
    }

    bootstrap()
  }, [setAuthStatus, setAuthenticated])

  return children
}
