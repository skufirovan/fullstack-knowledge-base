import type { ArticleListItem } from './article'

export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  articles?: ArticleListItem[]
}
