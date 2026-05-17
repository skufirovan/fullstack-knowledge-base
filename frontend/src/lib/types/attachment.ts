import type { User } from './user'

export type Attachment = {
  id: string
  url: string
  fileName: string
  uploadedBy: User
  createdAt: Date
}
