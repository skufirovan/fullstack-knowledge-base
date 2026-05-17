import { Navigate } from 'react-router-dom'
import { CategoryForm } from '@/components'
import { useUser } from '@/hooks/use-user'
import { categoriesApi } from '@/lib/api/categories-api'
import { articlePolicy } from '@/lib/types/article'

export function CreateCategoryPage() {
  const { user } = useUser()
  const canCreate = articlePolicy.canCreate(user)

  if (!canCreate) return <Navigate to="/" />

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Создание категории</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Укажите название категории и краткое описание (необязательно)
        </p>
      </div>
      <CategoryForm onSubmit={dto => categoriesApi.create(dto)} />
    </div>
  )
}
