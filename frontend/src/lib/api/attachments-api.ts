import { PAGE_SIZE } from '../constants'
import type { Attachment } from '../types/attachment'
import { apiClient } from './api-client'

export type GetUploadUrlDTO = {
  contentType: string
  contentLength: number
  fileName: string
}

export type GetUploadUrlResponse = {
  key: string
  uploadUrl: string
  headers: Record<string, string>
}

export type ConfirmUploadDTO = { key: string }

export type ConfirmUploadResponse = { url: string }

export type AttachmentsResponse = {
  items: Attachment[]
  total: number
}

export const attachmentsApi = {
  async getAttachments(page: number = 1) {
    const skip = (page - 1) * PAGE_SIZE
    const { data } = await apiClient.get<AttachmentsResponse>(
      `/attachments?skip=${skip}&take=${PAGE_SIZE}`,
    )

    return data
  },

  async getUploadUrl(dto: GetUploadUrlDTO) {
    const { data } = await apiClient.post<GetUploadUrlResponse>(
      '/attachments/upload-url',
      dto,
    )

    return data
  },

  async confirmUpload(dto: ConfirmUploadDTO) {
    const { data } = await apiClient.post<ConfirmUploadResponse>(
      '/attachments/confirm',
      dto,
    )

    return data
  },
}
