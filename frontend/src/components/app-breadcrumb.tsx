import { Link, useParams } from 'react-router-dom'
import { useArticle } from '@/hooks/use-article'
import { useCategory } from '@/hooks/use-category'
import { AppSpinner } from './app-spinner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

export function AppBreadcrumb() {
  const { categorySlug, articleSlug } = useParams()

  if (!categorySlug) return null

  if (articleSlug) {
    return (
      <ArticleBreadcrumb
        categorySlug={categorySlug}
        articleSlug={articleSlug}
      />
    )
  }

  return <CategoryBreadcrumb categorySlug={categorySlug} />
}

function CategoryBreadcrumb({ categorySlug }: { categorySlug: string }) {
  const { data: category, isLoading } = useCategory(categorySlug)

  if (isLoading) return <AppSpinner />
  if (!category) return null

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{category.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function ArticleBreadcrumb({
  categorySlug,
  articleSlug,
}: {
  categorySlug: string
  articleSlug: string
}) {
  const { data: article, isLoading } = useArticle(categorySlug, articleSlug)

  if (isLoading) return <AppSpinner />
  if (!article) return null

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to={`/${categorySlug}`}>{article.category?.name}</Link>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{article.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
