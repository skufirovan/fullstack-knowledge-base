import { Expose } from 'class-transformer'

export class ArticleListItem {
  @Expose()
  readonly id: string

  @Expose()
  readonly title: string

  @Expose()
  readonly slug: string

  constructor(partial: Partial<ArticleListItem>) {
    Object.assign(this, partial)
  }
}
