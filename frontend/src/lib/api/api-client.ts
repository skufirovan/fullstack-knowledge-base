import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getDeviceId } from '../deviceId'

type FailedRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

const BASE_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

let accessToken: string | undefined

export const setAccessToken = (token?: string) => {
  accessToken = token
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers['x-device-id'] = getDeviceId()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error)
      return
    }

    if (token) {
      request.resolve(token)
    }
  })

  failedQueue = []
}

const AUTH_SKIP_RETRY_URLS = ['/auth/login', '/auth/logout', '/auth/refresh']

const shouldSkipAuthRetry = (url?: string) => {
  if (!url) return true

  return AUTH_SKIP_RETRY_URLS.some(authUrl => url.includes(authUrl))
}

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipAuthRetry(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const response = await axios.post<{
        accessToken: string
      }>(
        `${BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      )

      const newAccessToken = response.data.accessToken

      setAccessToken(newAccessToken)

      processQueue(null, newAccessToken)

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)

      setAccessToken(undefined)

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
