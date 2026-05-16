import { Injectable } from '@nestjs/common'
import slugify from 'slugify'

import { ArticlePolicy } from '@/article/article.policy'
import { AppException } from '@/common/exceptions/api.exceptions'
import { RequestUser } from '@/common/types/fastify'
import { isP2002 } from '@/common/utils/prisma.utils'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlePolicy: ArticlePolicy
  ) {}

  async create(dto: CreateCategoryDto) {
    const slug = await this.generateUniqueSlug(dto.name)

    try {
      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
        },
      })

      return { category: new Category(category) }
    } catch (err) {
      if (isP2002(err)) {
        throw AppException.conflict(`Category ${dto.name} already exists`)
      }

      throw err
    }
  }

  async findAll(user: RequestUser) {
    const categories = await this.prisma.category.findMany({
      include: {
        articles: {
          where: this.articlePolicy.getVisibleWhere(user),
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      categories: categories.map(c => new Category(c)),
    }
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { articles: true },
    })

    if (!category) throw AppException.notFound('Category not found')

    return { category: new Category(category) }
  }

  async update(slug: string, dto: UpdateCategoryDto) {
    await this.findOne(slug)

    const data: UpdateCategoryDto & { slug?: string } = { ...dto }

    if (dto.name) {
      data.slug = await this.generateUniqueSlug(dto.name, slug)
    }

    const category = await this.prisma.category.update({
      where: { slug },
      data,
    })

    return { category: new Category(category) }
  }

  async remove(slug: string) {
    await this.findOne(slug)
    await this.prisma.category.delete({ where: { slug } })

    return { message: `Category ${slug} was deleted` }
  }

  private async generateUniqueSlug(
    name: string,
    excludeSlug?: string
  ): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true, locale: 'ru' })

    if (!baseSlug) {
      throw AppException.badRequest(
        'Category name must contain valid characters'
      )
    }

    let uniqueSlug = baseSlug
    let counter = 2

    while (
      await this.prisma.category.findFirst({
        where: {
          slug: uniqueSlug,
          NOT: excludeSlug ? { slug: excludeSlug } : undefined,
        },
      })
    ) {
      uniqueSlug = `${baseSlug}-${counter++}`
    }

    return uniqueSlug
  }
}
