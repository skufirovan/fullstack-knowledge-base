import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { AppSpinner } from '@/components'
import { useArticle } from '@/hooks/use-article'
import { NotFoundPage } from './not-found-page'

export function ArticlePage() {
  const { categorySlug, articleSlug } = useParams()

  if (!categorySlug || !articleSlug) return

  const { data, isLoading } = useArticle(categorySlug, articleSlug)

  if (isLoading) return <AppSpinner />
  if (!data) return <NotFoundPage />

  return (
    <article className="mx-auto max-w-4xl">
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
