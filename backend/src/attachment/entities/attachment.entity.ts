import { Expose } from 'class-transformer'

import { User } from '@/user/entities/user.entity'

export class Attachment {
  @Expose()
  id: string

  @Expose()
  url: string

  @Expose()
  fileName: string

  @Expose()
  uploadedBy: User

  @Expose()
  createdAt: Date

  constructor(partial: Partial<Attachment>) {
    Object.assign(this, partial)

    if (partial.uploadedBy) this.uploadedBy = new User(partial.uploadedBy)
  }
}
