import { Expose } from 'class-transformer'

import { UserRole } from '@/generated/prisma/enums'

export class User {
  @Expose()
  readonly id: string

  @Expose()
  readonly email: string

  @Expose()
  readonly role: UserRole

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }
}
