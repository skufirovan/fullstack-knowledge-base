import type { User } from '../types/user'
import { apiClient } from './api-client'

export type AuthCredentialsDto = {
  email: string
  password: string
}

export type AuthResponse = {
  user: User
  accessToken: string
}

export const authApi = {
  async login(dto: AuthCredentialsDto) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', dto)

    return data
  },

  async logout() {
    await apiClient.post('/auth/logout')
  },

  async refresh() {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh')

    return data
  },
}
