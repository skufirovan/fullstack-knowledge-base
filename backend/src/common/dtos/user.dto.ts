import { Expose } from 'class-transformer'

import { UserRole } from '@/generated/prisma/enums'

export class UserDto {
  @Expose()
  readonly id: string

  @Expose()
  readonly email: string

  @Expose()
  readonly role: UserRole

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
