import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '@/lib/api/articles-api'

export const useArticle = (categorySlug: string, articleSlug: string) => {
  return useQuery({
    queryKey: ['article', categorySlug, articleSlug],
    queryFn: () => articlesApi.findOne(categorySlug, articleSlug),
    enabled: !!categorySlug && !!articleSlug,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status
      if (status === 404) return false
      return failureCount < 3
    },
  })
}
