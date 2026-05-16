import type { Category } from '../types/category'
import { apiClient } from './api-client'

export type CreateCategoryDTO = {
  name: string
  description?: string
}

export type UpdateCategoryDTO = {
  name?: string
  description?: string
}

export const categoriesApi = {
  async create(dto: CreateCategoryDTO) {
    const { data } = await apiClient.post<{ category: Category }>(
      '/categories',
      dto,
    )

    return data.category
  },

  async findAll() {
    const { data } = await apiClient.get<{ categories: Category[] }>(
      '/categories',
    )

    return data.categories
  },

  async findOne(slug: string) {
    const { data } = await apiClient.get<{ category: Category }>(
      `/categories/${slug}`,
    )

    return data.category
  },

  async update(slug: string, dto: UpdateCategoryDTO) {
    const { data } = await apiClient.patch<{ category: Category }>(
      `/categories/${slug}`,
      dto,
    )

    return data.category
  },

  async remove(slug: string) {
    await apiClient.delete(`/categories/${slug}`)
  },
}
