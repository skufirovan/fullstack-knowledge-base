import { Injectable } from '@nestjs/common'

import { RequestUser } from '@/common/types/fastify'
import { Article, Prisma } from '@/generated/prisma/client'

@Injectable()
export class ArticlePolicy {
  canView(
    user: RequestUser | null,
    article: Pick<Article, 'authorId' | 'status'>
  ): boolean {
    if (article.status === 'published') return true

    if (!user) return false

    if (user.role === 'admin') return true

    if (user.role === 'editor' && article.authorId === user.id) return true

    return false
  }

  canCreate(user: RequestUser): boolean {
    return user.role === 'admin' || user.role === 'editor'
  }

  canUpdate(user: RequestUser, article: Pick<Article, 'authorId'>): boolean {
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  }

  canDelete(user: RequestUser, article: Pick<Article, 'authorId'>): boolean {
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  }

  canPublish(user: RequestUser, article: Pick<Article, 'authorId'>): boolean {
    if (user.role === 'admin') return true

    return user.role === 'editor' && article.authorId === user.id
  }

  getVisibleWhere(user?: RequestUser): Prisma.ArticleWhereInput {
    if (!user) {
      return {
        status: 'published',
      }
    }

    if (user.role === 'admin') {
      return {}
    }

    if (user.role === 'editor') {
      return {
        OR: [
          { status: 'published' },
          {
            status: 'draft',
            authorId: user.id,
          },
        ],
      }
    }

    return {
      status: 'published',
    }
  }
}
