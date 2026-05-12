import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'

import { UserDto } from '@/common/dtos/user.dto'
import { AppException } from '@/common/exceptions/api.exceptions'
import { isP2002 } from '@/common/utils/prisma.utils'
import { isEqualIgnoreCase } from '@/common/utils/string.utils'
import { PrismaService } from '@/prisma/prisma.service'
import { TokenService } from '@/token/token.service'

import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'
import { AuthMetadata } from './types/auth-metadata.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService
  ) {}

  async register(data: RegisterDto) {
    const { email, password } = data
    const hashPassword = await hash(password)

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashPassword,
        },
      })

      return { user: new UserDto(user) }
    } catch (err) {
      if (isP2002(err)) {
        const existing = await this.prisma.user.findFirst({
          where: { email },
          select: { email: true },
        })

        if (isEqualIgnoreCase(existing?.email, email))
          throw AppException.authEmailTaken()

        throw AppException.conflict('User already exists')
      }
      throw err
    }
  }

  async login(data: LoginDto, meta: AuthMetadata) {
    const { email, password } = data

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) throw AppException.authInvalidCredentials()
    if (!user.isActive) throw AppException.userInactive()

    const isPassEquals = await verify(user.password, password)
    if (!isPassEquals) throw AppException.authInvalidCredentials()

    return this.prisma.$transaction(async tx => {
      const accessToken = this.tokenService.generateAccessToken({
        sub: user.id,
        role: user.role,
        isActive: user.isActive,
      })

      const refreshToken = this.tokenService.generateRefreshToken({
        sub: user.id,
        deviceId: meta.deviceId,
      })

      await this.tokenService.saveTokenTx(
        tx,
        user.id,
        refreshToken,
        meta.deviceId,
        meta.userAgent,
        meta.ipAddress
      )

      return { accessToken, refreshToken, user: new UserDto(user) }
    })
  }

  async logout(refreshToken: string) {
    const payload = this.tokenService.validateRefreshToken(refreshToken)
    if (!payload) return

    await this.tokenService.removeTokenByDevice(payload.sub, payload.deviceId)
    return { message: 'Logged out from device successfully' }
  }

  async refresh(expiredRefreshToken: string, ipAddress: string) {
    const payload = this.tokenService.validateRefreshToken(expiredRefreshToken)
    if (!payload) throw AppException.authRefreshTokenInvalid()

    return this.prisma.$transaction(async tx => {
      const session = await tx.token.findUnique({
        where: {
          userId_deviceId: { userId: payload.sub, deviceId: payload.deviceId },
        },
      })

      if (!session) throw AppException.authRefreshTokenInvalid()

      const isValid = await verify(session.refreshHash, expiredRefreshToken)
      if (!isValid) {
        await tx.token.delete({
          where: {
            userId_deviceId: {
              userId: payload.sub,
              deviceId: payload.deviceId,
            },
          },
        })
        throw AppException.authRefreshTokenInvalid()
      }

      const user = await tx.user.findUnique({
        where: { id: payload.sub },
      })

      if (!user) throw AppException.userNotFound()

      const accessToken = this.tokenService.generateAccessToken({
        sub: payload.sub,
        role: user.role,
        isActive: user.isActive,
      })

      const refreshToken = this.tokenService.generateRefreshToken({
        sub: payload.sub,
        deviceId: payload.deviceId,
      })

      await this.tokenService.saveTokenTx(
        tx,
        payload.sub,
        refreshToken,
        session.deviceId,
        session.userAgent,
        ipAddress
      )

      return { accessToken, refreshToken, user: new UserDto(user) }
    })
  }
}
