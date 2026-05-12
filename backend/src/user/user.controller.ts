import { Controller, Get, Param, Patch } from '@nestjs/common'

import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequireAuth } from '@/common/decorators/require-auth.decorator'

import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequireAuth()
  @Get('me')
  async getMe(@CurrentUser('id') id: string) {
    return this.userService.getMe(id)
  }

  @RequireAuth('admin')
  @Patch(':id/deactivate')
  async deactivateSelf(@Param('id') id: string) {
    await this.userService.deactivateUser(id)

    return { message: 'Account deactivated successfully' }
  }
}
