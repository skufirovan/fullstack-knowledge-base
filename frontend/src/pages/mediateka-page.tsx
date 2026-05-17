import Masonry from 'react-masonry-css'
import { Navigate, useSearchParams } from 'react-router-dom'
import {
  AppPagination,
  AppSpinner,
  ImageUploadButton,
  MediaLibraryImage,
} from '@/components'
import { useAttachments } from '@/hooks/use-attachments'
import { useUser } from '@/hooks/use-user'
import { articlePolicy } from '@/lib/types/article'
import { parsePage } from '@/lib/utils'
import { NotFoundPage } from './not-found-page'

export function MediatekaPage() {
  const [searchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const { user } = useUser()
  const { data, isLoading } = useAttachments(page)
  const canCreate = articlePolicy.canCreate(user)

  if (!canCreate) return <Navigate to="/" />
  if (isLoading) return <AppSpinner />
  if (!data) return <NotFoundPage />

  return (
    <div className="space-y-3">
      <ImageUploadButton />
      <Masonry
        breakpointCols={{ default: 4, 1024: 3, 768: 2, 480: 1 }}
        className="flex gap-4"
        columnClassName="flex flex-col gap-4"
      >
        {data.items.map(attachment => (
          <MediaLibraryImage key={attachment.id} attachment={attachment} />
        ))}
      </Masonry>

      <AppPagination total={data.total} />
    </div>
  )
}
