import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users-api'
import { useAuthSession } from '@/lib/auth-context'

export const useMe = () => {
  const { authStatus } = useAuthSession()

  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
    enabled: authStatus === 'authenticated',
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
