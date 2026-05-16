import { Link, useParams } from 'react-router-dom'
import { AppSpinner } from '@/components'
import { useCategory } from '@/hooks/use-category'
import { NotFoundPage } from './not-found-page'

export function CategoryPage() {
  const { categorySlug } = useParams()

  if (!categorySlug) return

  const { data: category, isLoading } = useCategory(categorySlug)

  if (isLoading) return <AppSpinner />
  if (!category) return <NotFoundPage />

  return (
    <article className="mx-auto max-w-4xl">
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <h1>{category.name}</h1>
        {category.description && <p>{category.description}</p>}

        <ul className="flex flex-col">
          {category.articles &&
            category.articles.map(article => (
              <li>
                <Link to={`${article.slug}`} className="no-underline">
                  {article.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </article>
  )
}
