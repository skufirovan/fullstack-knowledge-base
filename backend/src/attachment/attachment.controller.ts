import { Body, Controller, Post } from '@nestjs/common'

import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequireAuth } from '@/common/decorators/require-auth.decorator'

import { AttachmentService } from './attachment.service'
import { ConfirmAttachmentDto } from './dto/confirm-attachment.dto'
import { GetUploadUrlDto } from './dto/get-upload-url.dto'

@Controller('attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @RequireAuth()
  @Post('upload-url')
  async getUploadUrl(
    @CurrentUser('id') id: string,
    @Body() dto: GetUploadUrlDto
  ) {
    return this.attachmentService.getUploadUrl(id, dto)
  }

  @RequireAuth()
  @Post('confirm')
  async confirm(
    @CurrentUser('id') id: string,
    @Body() body: ConfirmAttachmentDto
  ) {
    return this.attachmentService.confirm(id, body.key)
  }
}
