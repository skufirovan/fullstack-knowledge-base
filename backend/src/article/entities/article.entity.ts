import { Expose } from 'class-transformer'

import { Category } from '@/category/entities/category.entity'
import { ArticleStatus } from '@/generated/prisma/enums'
import { User } from '@/user/entities/user.entity'

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
  readonly author: User

  @Expose()
  readonly category?: Category

  @Expose()
  readonly createdAt: Date

  @Expose()
  readonly updatedAt: Date

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial)

    if (partial.author) this.author = new User(partial.author)
    if (partial.category) this.category = new Category(partial.category)
  }
}
