import type { Category } from './category'

export type ArticleStatus = 'draft' | 'published'

export type ArticleListItem = {
  id: string
  title: string
  slug: string
}

export type Article = {
  id: string
  title: string
  slug: string
  content: string
  status: ArticleStatus
  authorId: string
  authorEmail?: string
  category?: Category
  createdAt: string
  updatedAt: string
}
