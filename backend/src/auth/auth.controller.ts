import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { RequireAuth } from '@/common/decorators/require-auth.decorator'
import { AppException } from '@/common/exceptions/api.exceptions'
import { isProd } from '@/common/utils/env.util'
import { RefreshCookieConfig } from '@/config/cookies.config'

import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RegisterDto } from './dtos/register.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @RequireAuth('admin')
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const userAgent = req.headers['user-agent'] ?? null
    const deviceId = req.headers['x-device-id']

    if (typeof deviceId !== 'string' || !deviceId.trim())
      throw AppException.invalidHeader('x-device-id header is required')

    const { accessToken, refreshToken, user } = await this.authService.login(
      dto,
      {
        userAgent,
        deviceId,
        ipAddress: req.ip,
      }
    )

    const refreshCookie =
      this.configService.getOrThrow<RefreshCookieConfig>('cookies.refresh')
    res.setCookie(refreshCookie.name, refreshToken, {
      ...refreshCookie,
      maxAge:
        this.configService.getOrThrow<number>('REFRESH_TTL_DAYS') * 86_400,
      secure: isProd,
    })

    return { accessToken, user }
  }

  @Post('logout')
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const refreshToken = req.cookies['refreshToken']

    if (refreshToken) {
      await this.authService.logout(refreshToken)

      const refreshCookie =
        this.configService.getOrThrow<RefreshCookieConfig>('cookies.refresh')
      res.clearCookie(refreshCookie.name, refreshCookie)

      return { message: 'Logged out successfully' }
    }

    return { message: 'No active session found' }
  }

  @Post('refresh')
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw AppException.authRefreshTokenInvalid()

    const data = await this.authService.refresh(refreshToken, req.ip)

    const refreshCookie =
      this.configService.getOrThrow<RefreshCookieConfig>('cookies.refresh')
    res.setCookie(refreshCookie.name, data.refreshToken, {
      ...refreshCookie,
      maxAge:
        this.configService.getOrThrow<number>('REFRESH_TTL_DAYS') * 86_400,
      secure: isProd,
    })

    return {
      accessToken: data.accessToken,
      user: data.user,
    }
  }
}
