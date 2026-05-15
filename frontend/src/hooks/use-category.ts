import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/lib/api/categories-api'

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => categoriesApi.findOne(slug),
    enabled: !!slug,
  })
}
