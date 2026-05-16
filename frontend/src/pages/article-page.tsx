import { Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { AppSpinner } from '@/components'
import { Button } from '@/components/ui/button'
import { useArticle } from '@/hooks/use-article'
import { useUser } from '@/hooks/use-user'
import { articlePolicy } from '@/lib/types/article'
import { NotFoundPage } from './not-found-page'

export function ArticlePage() {
  const { categorySlug, articleSlug } = useParams()

  const { data, isLoading } = useArticle(categorySlug ?? '', articleSlug ?? '')
  const { user } = useUser()

  if (!categorySlug || !articleSlug) return null

  if (isLoading) return <AppSpinner />
  if (!data) return <NotFoundPage />

  const canUpdate = articlePolicy.canUpdate(data, user)

  return (
    <article className="relative mx-auto max-w-4xl cursor-default">
      {canUpdate && (
        <Button size="icon-lg" variant="outline" className="absolute right-0">
          <Link to="edit">
            <Pencil />
          </Link>
        </Button>
      )}
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
