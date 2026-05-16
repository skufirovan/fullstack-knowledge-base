import { useMe } from './use-me'

export const useUser = () => {
  const { data: user, isLoading } = useMe()

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor',
  }
}
