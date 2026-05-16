import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { setAccessToken } from './api/api-client'
import { authApi } from './api/auth-api'

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated'

type AuthSessionState = {
  authStatus: AuthStatus
}

type AuthContextValue = AuthSessionState & {
  setAuthenticated: (accessToken: string) => void
  setAuthStatus: (authStatus: AuthStatus) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthSessionState>({
    authStatus: 'unknown',
  })
  const queryClient = useQueryClient()

  const setAuthenticated = useCallback((accessToken: string) => {
    setAccessToken(accessToken)

    setSession({
      authStatus: 'authenticated',
    })
  }, [])

  const setAuthStatus = useCallback((authStatus: AuthStatus) => {
    setSession({
      authStatus,
    })
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(undefined)

      queryClient.clear()

      setSession({
        authStatus: 'unauthenticated',
      })
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...session,
      setAuthenticated,
      setAuthStatus,
      logout,
    }),
    [session, setAuthenticated, setAuthStatus, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthSession = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthSession must be used within AuthProvider')
  }

  return context
}
