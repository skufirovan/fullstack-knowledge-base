import { Link, useParams } from 'react-router-dom'
import { useArticle } from '@/hooks/use-article'
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

  if (!categorySlug || !articleSlug) return

  const { data: article, isLoading } = useArticle(categorySlug, articleSlug)

  if (isLoading) return <AppSpinner />
  if (!article) return

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to={`/${article.slug}`}>{article.category?.slug}</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{article.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
