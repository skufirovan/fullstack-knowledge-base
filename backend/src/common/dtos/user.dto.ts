import { Expose } from 'class-transformer'

export class UserDto {
  @Expose()
  readonly email: string

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
