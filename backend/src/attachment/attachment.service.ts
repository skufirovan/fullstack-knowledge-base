import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { ValidationCode } from '@/common/constants/validation-codes.enum'
import { AppException } from '@/common/exceptions/api.exceptions'
import { PrismaService } from '@/prisma/prisma.service'
import { S3Service } from '@/s3/s3.service'

import { ATTACHMENT_RULES } from './attachment.rules'
import { GetUploadUrlDto } from './dto/get-upload-url.dto'
import { Attachment } from './entities/attachment.entity'

@Injectable()
export class AttachmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service
  ) {}

  async getUploadUrl(userId: string, dto: GetUploadUrlDto) {
    const { contentLength, contentType, fileName } = dto

    if (contentLength > ATTACHMENT_RULES.maxBytes)
      throw AppException.validationFailed({
        fields: {
          contentLength: [{ code: ValidationCode.CONTENT_LENGTH_MAX }],
        },
      })

    if (!ATTACHMENT_RULES.allowedContentTypes.includes(contentType))
      throw AppException.validationFailed({
        fields: {
          contentType: [{ code: ValidationCode.UNSUPPORTED_CONTENT_TYPE }],
        },
      })

    const id = randomUUID()
    const ext = contentType.split('/')[1]
    const key = `${userId}/${id}.${ext}`

    const url = this.s3Service.publicUrl(key)

    await this.prisma.attachment.create({
      data: {
        id,
        key,
        url,
        fileName,
        contentType,
        size: contentLength,
        uploadedById: userId,
      },
    })

    const uploadUrl = await this.s3Service.presignPut({
      key,
      contentType,
      contentLength,
      cacheControl: ATTACHMENT_RULES.cacheControl,
      expiresInSeconds: ATTACHMENT_RULES.expiresInSeconds,
      metadata: { uid: userId },
    })

    return {
      key,
      uploadUrl,
      headers: {
        'Content-Type': contentType,
        'x-amz-meta-uid': userId,
      },
    }
  }

  async confirm(userId: string, key: string) {
    if (!key.startsWith(`${userId}/`))
      throw AppException.validationFailed({
        fields: { key: [{ code: ValidationCode.KEY_INVALID }] },
      })

    const attachment = await this.prisma.attachment.findUnique({
      where: { key },
    })

    if (!attachment || attachment.uploadedById !== userId) {
      throw AppException.validationFailed({
        fields: { key: [{ code: ValidationCode.KEY_INVALID }] },
      })
    }

    try {
      const head = await this.s3Service.headObject(key)

      const size = head.ContentLength ?? 0
      const contentType = head.ContentType ?? ''
      const metaUid = head.Metadata?.uid

      if (!metaUid || metaUid !== userId) {
        await this.s3Service.deleteObject(key)
        throw AppException.validationFailed({
          fields: { key: [{ code: ValidationCode.KEY_INVALID }] },
        })
      }

      if (size > ATTACHMENT_RULES.maxBytes) {
        await this.s3Service.deleteObject(key)
        throw AppException.validationFailed({
          fields: {
            contentLength: [{ code: ValidationCode.CONTENT_LENGTH_MAX }],
          },
        })
      }

      if (!ATTACHMENT_RULES.allowedContentTypes.includes(contentType)) {
        await this.s3Service.deleteObject(key)
        throw AppException.validationFailed({
          fields: {
            contentType: [{ code: ValidationCode.UNSUPPORTED_CONTENT_TYPE }],
          },
        })
      }
    } catch (err) {
      if (this.s3Service.isNotFound(err)) {
        throw AppException.validationFailed({
          fields: { key: [{ code: ValidationCode.KEY_INVALID }] },
        })
      }
      throw err
    }

    const updated = await this.prisma.attachment.update({
      where: { key },
      data: { status: 'uploaded' },
    })

    return { url: updated.url }
  }

  async findAll(options: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = options

    const [items, total] = await this.prisma.$transaction([
      this.prisma.attachment.findMany({
        where: { status: 'uploaded' },
        orderBy: { createdAt: 'desc' },
        include: { uploadedBy: true },
        skip,
        take,
      }),
      this.prisma.attachment.count({ where: { status: 'uploaded' } }),
    ])

    return { items: items.map(item => new Attachment(item)), total }
  }
}
