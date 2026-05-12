import { UserRole } from '@/generated/prisma/enums'

export type AccessPayload = {
  sub: string
  role: UserRole
  isActive: boolean
}
