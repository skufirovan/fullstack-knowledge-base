import type { Category } from './category'
import type { User } from './user'

export type ArticleStatus = 'draft' | 'published'

export type ArticleListItem = {
  id: string
  title: string
  slug: string
  status: ArticleStatus
}

export type Article = {
  id: string
  title: string
  slug: string
  content: string
  status: ArticleStatus
  author: User
  category?: Category
  createdAt: string
  updatedAt: string
}

type ArticlePolicyArticle = {
  authorId: string
  status?: 'draft' | 'published'
}

export const articlePolicy = {
  canCreate(user?: User | null) {
    return user?.role === 'admin' || user?.role === 'editor'
  },

  canUpdate(article: ArticlePolicyArticle, user?: User) {
    if (!user) return false
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  },

  canDelete(article: ArticlePolicyArticle, user?: User) {
    if (!user) return false
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  },

  canPublish(article: ArticlePolicyArticle, user?: User) {
    if (!user) return false
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  },

  canView(article: ArticlePolicyArticle, user?: User) {
    if (!user) return false
    if (article.status === 'published') return true
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  },
}
