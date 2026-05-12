import { IsBoolean, IsEnum, IsUUID } from 'class-validator'

import { UserRole } from '@/generated/prisma/enums'

export class AccessPayloadDto {
  @IsUUID()
  sub: string

  @IsEnum(UserRole)
  role: UserRole

  @IsBoolean()
  isActive: boolean
}
