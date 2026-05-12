import { Injectable } from '@nestjs/common'

import { AppException } from '@/common/exceptions/api.exceptions'
import { PrismaService } from '@/prisma/prisma.service'
import { TokenService } from '@/token/token.service'

import { UserDto } from '../common/dtos/user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService
  ) {}

  async getMe(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) throw AppException.userNotFound()

    return new UserDto(user)
  }

  async deactivateUser(id: string) {
    await this.prisma.$transaction(async tx => {
      const user = await tx.user.update({
        where: { id },
        data: { isActive: false },
      })

      await this.tokenService.removeAllUserSessions(user.id)
    })
  }
}
