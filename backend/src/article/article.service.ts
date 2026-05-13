import { Injectable } from '@nestjs/common'
import slugify from 'slugify'

import { AppException } from '@/common/exceptions/api.exceptions'
import { RequestUser } from '@/common/types/fastify'
import { isP2002 } from '@/common/utils/prisma.utils'
import { Prisma } from '@/generated/prisma/client'
import { PrismaService } from '@/prisma/prisma.service'

import { ArticlePolicy } from './article.policy'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { Article } from './entities/article.entity'

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlePolicy: ArticlePolicy
  ) {}

  async create(authorId: string, dto: CreateArticleDto) {
    const slug = await this.generateUniqueSlug(dto.title, dto.categoryId)

    try {
      const article = await this.prisma.article.create({
        data: {
          ...dto,
          authorId,
          slug,
        },
        include: this.articleInclude,
      })

      return {
        article: this.toEntity(article),
      }
    } catch (err) {
      if (isP2002(err))
        throw AppException.conflict(
          `Article ${dto.title} already exists in this category`
        )

      throw err
    }
  }

  async findOne(id: string, user: RequestUser) {
    const article = await this.getById(id)

    if (!article || !this.articlePolicy.canView(user, article))
      throw AppException.notFound('Article not found')

    return {
      article: this.toEntity(article),
    }
  }

  async update(id: string, dto: UpdateArticleDto, user: RequestUser) {
    const article = await this.getById(id)

    if (!article) throw AppException.notFound('Article not found')

    if (!this.articlePolicy.canUpdate(user, article))
      throw AppException.authForbidden()

    const targetCategoryId = dto.categoryId ?? article.categoryId
    const data: UpdateArticleDto & { slug?: string } = { ...dto }

    if (dto.title || dto.categoryId) {
      data.slug = await this.generateUniqueSlug(
        dto.title ?? article.title,
        targetCategoryId,
        article.id
      )
    }

    try {
      const updated = await this.prisma.article.update({
        where: { id },
        data,
        include: this.articleInclude,
      })

      return {
        article: this.toEntity(updated),
      }
    } catch (err) {
      if (isP2002(err)) {
        throw AppException.conflict(
          `Article ${dto.title ?? article.title} already exists in this category`
        )
      }

      throw err
    }
  }

  async remove(id: string, user: RequestUser) {
    const article = await this.getById(id)

    if (!article) throw AppException.notFound('Article not found')

    if (!this.articlePolicy.canDelete(user, article))
      throw AppException.authForbidden()

    await this.prisma.article.delete({ where: { id } })

    return { message: `Article ${article.title} was deleted` }
  }

  private get articleInclude() {
    return {
      author: {
        select: {
          email: true,
        },
      },
    } satisfies Prisma.ArticleInclude
  }

  private async getById(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
      include: this.articleInclude,
    })
  }

  private toEntity(
    article: Prisma.ArticleGetPayload<{
      include: {
        author: {
          select: {
            email: true
          }
        }
      }
    }>
  ) {
    return new Article({
      ...article,
      authorEmail: article.author.email,
    })
  }

  private async generateUniqueSlug(
    title: string,
    categoryId: string,
    excludeId?: string
  ): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true, locale: 'ru' })

    if (!baseSlug) {
      throw AppException.badRequest(
        'Article title must contain valid characters'
      )
    }

    let uniqueSlug = baseSlug
    let counter = 2

    while (
      await this.prisma.article.findFirst({
        where: {
          slug: uniqueSlug,
          categoryId,
          NOT: excludeId ? { id: excludeId } : undefined,
        },
        select: {
          id: true,
        },
      })
    ) {
      uniqueSlug = `${baseSlug}-${counter++}`
    }

    return uniqueSlug
  }
}
