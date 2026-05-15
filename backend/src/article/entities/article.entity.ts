import { Expose } from 'class-transformer'

import type { Category } from '@/generated/prisma/client'
import { ArticleStatus } from '@/generated/prisma/enums'

export class Article {
  @Expose()
  readonly id: string

  @Expose()
  readonly title: string

  @Expose()
  readonly slug: string

  @Expose()
  readonly content: string

  @Expose()
  readonly status: ArticleStatus

  @Expose()
  readonly authorId: string

  @Expose()
  readonly authorEmail?: string

  @Expose()
  readonly category?: Category

  @Expose()
  readonly createdAt: Date

  @Expose()
  readonly updatedAt: Date

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial)
  }
}
