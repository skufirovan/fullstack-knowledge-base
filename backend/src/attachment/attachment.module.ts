import { Module } from '@nestjs/common'

import { S3Module } from '@/s3/s3.module'
import { TokenModule } from '@/token/token.module'

import { AttachmentController } from './attachment.controller'
import { AttachmentService } from './attachment.service'

@Module({
  imports: [S3Module, TokenModule],
  controllers: [AttachmentController],
  providers: [AttachmentService],
})
export class AttachmentModule {}
