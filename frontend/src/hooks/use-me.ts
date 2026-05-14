import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users-api'

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
