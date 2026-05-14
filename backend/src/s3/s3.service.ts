import {
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
  private readonly bucketName: string
  private readonly bucketUuid: string

  constructor(
    private readonly s3: S3Client,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    this.bucketUuid = this.configService.getOrThrow<string>('S3_BUCKET_UUID')
  }

  publicUrl(key: string) {
    return `https://${this.bucketUuid}.selstorage.ru/${encodeURI(key)}`
  }

  async presignPut(options: {
    key: string
    contentType: string
    contentLength: number
    cacheControl?: string
    expiresInSeconds: number
    metadata?: Record<string, string>
  }) {
    const cmd = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: options.key,
      ContentType: options.contentType,
      ContentLength: options.contentLength,
      CacheControl: options.cacheControl,
      Metadata: options.metadata,
    })

    return getSignedUrl(this.s3, cmd, { expiresIn: options.expiresInSeconds })
  }

  async headObject(key: string): Promise<HeadObjectCommandOutput> {
    return this.s3.send(
      new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    )
  }

  async deleteObject(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucketName, Key: key })
    )
  }

  isNotFound(error: any): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('name' in error || '$metadata' in error) &&
      ((error as any).name === 'NotFound' ||
        (error as any).$metadata?.httpStatusCode === 404)
    )
  }
}
