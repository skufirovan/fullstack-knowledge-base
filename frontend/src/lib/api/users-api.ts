import type { User } from '../types/user'
import { apiClient } from './api-client'
import type { AuthCredentialsDto } from './auth-api'

export const usersApi = {
  async register(dto: AuthCredentialsDto) {
    const { data } = await apiClient.post<{ user: User }>('/auth/register', dto)

    return data.user
  },

  async me() {
    const { data } = await apiClient.get<{ user: User }>('/users/me')

    return data.user
  },
}
