import { Navigate } from 'react-router-dom'
import { ArticleForm } from '@/components'
import { useUser } from '@/hooks/use-user'
import { articlesApi } from '@/lib/api/articles-api'
import { articlePolicy } from '@/lib/types/article'

export function CreateArticlePage() {
  const { user } = useUser()
  const canCreate = articlePolicy.canCreate(user)

  if (!canCreate) return <Navigate to="/" />

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Создание статьи</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Статью можно сохранить как черновик и продолжить редактирование позже
        </p>
      </div>
      <ArticleForm
        onSubmit={(dto, status) => articlesApi.create({ ...dto, status })}
      />
    </div>
  )
}
