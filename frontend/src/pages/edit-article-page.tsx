import { Navigate, useParams } from 'react-router-dom'
import { AppSpinner, ArticleForm } from '@/components'
import { useArticle } from '@/hooks/use-article'
import { useUser } from '@/hooks/use-user'
import { articlesApi } from '@/lib/api/articles-api'
import { articlePolicy } from '@/lib/types/article'
import { NotFoundPage } from './not-found-page'

export function EditArticlePage() {
  const { categorySlug, articleSlug } = useParams()

  const { data, isLoading } = useArticle(categorySlug ?? '', articleSlug ?? '')
  const { user } = useUser()

  if (!categorySlug || !articleSlug) return null

  if (isLoading) return <AppSpinner />
  if (!data) return <NotFoundPage />

  const canUpdate = articlePolicy.canUpdate(data, user)

  if (!canUpdate) return <Navigate to={`/${categorySlug}/${articleSlug}`} />

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Редактирование статьи</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Статью можно сохранить как черновик и продолжить редактирование позже
        </p>
      </div>
      <ArticleForm
        article={data}
        onSubmit={(dto, status) =>
          articlesApi.update(categorySlug, articleSlug, { ...dto, status })
        }
      />
    </div>
  )
}
