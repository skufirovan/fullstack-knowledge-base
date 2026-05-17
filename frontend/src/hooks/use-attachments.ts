import { useQuery } from '@tanstack/react-query'
import { attachmentsApi } from '@/lib/api/attachments-api'

export const useAttachments = (page: number) => {
  return useQuery({
    queryKey: ['attachments', page],
    queryFn: () => attachmentsApi.getAttachments(page),
    retry: false,
    enabled: !!page && page > 0,
  })
}
