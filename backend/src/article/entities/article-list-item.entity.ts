import { Expose } from 'class-transformer'

import { ArticleStatus } from '@/generated/prisma/enums'

export class ArticleListItem {
  @Expose()
  readonly id: string

  @Expose()
  readonly title: string

  @Expose()
  readonly slug: string

  @Expose()
  readonly status: ArticleStatus

  constructor(partial: Partial<ArticleListItem>) {
    Object.assign(this, partial)
  }
}
