import type { Article, ArticleStatus } from '../types/article'
import { apiClient } from './api-client'

export type CreateArticleDTO = {
  title: string
  content: string
  status: ArticleStatus
  categoryId: string
}

export type UpdateArticleDTO = {
  title?: string
  content?: string
  status?: ArticleStatus
  categoryId?: string
}

export const articlesApi = {
  async create(dto: CreateArticleDTO) {
    const { data } = await apiClient.post<{ article: Article }>(
      '/articles',
      dto,
    )

    return data.article
  },

  async findOne(categorySlug: string, articleSlug: string) {
    const { data } = await apiClient.get<{ article: Article }>(
      `/articles/${articleSlug}?categorySlug=${categorySlug}`,
    )

    return data.article
  },

  async update(
    categorySlug: string,
    articleSlug: string,
    dto: UpdateArticleDTO,
  ) {
    const { data } = await apiClient.patch<{ article: Article }>(
      `/articles/${articleSlug}?categorySlug=${categorySlug}`,
      dto,
    )

    return data.article
  },

  async remove(categorySlug: string, articleSlug: string) {
    await apiClient.delete(
      `/articles/${articleSlug}?categorySlug=${categorySlug}`,
    )
  },
}
