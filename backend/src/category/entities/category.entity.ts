import { Expose } from 'class-transformer'

import { ArticleListItem } from '@/article/entities/article-list-item.entity'

export class Category {
  @Expose()
  readonly id: string

  @Expose()
  readonly name: string

  @Expose()
  readonly slug: string

  @Expose()
  readonly description: string | null

  @Expose()
  readonly articles?: ArticleListItem[]

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial)

    if (partial.articles) {
      this.articles = partial.articles.map(
        article => new ArticleListItem(article)
      )
    }
  }
}
