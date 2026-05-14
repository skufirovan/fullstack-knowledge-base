import { IsIn, IsNotEmpty, IsNumber, IsString, Max } from 'class-validator'

import { ValidationCode } from '@/common/constants/validation-codes.enum'
import { vmsg } from '@/common/utils/validation.utils'

import { ATTACHMENT_RULES } from '../attachment.rules'

export class GetUploadUrlDto {
  @IsIn(ATTACHMENT_RULES.allowedContentTypes, {
    message: vmsg(ValidationCode.UNSUPPORTED_CONTENT_TYPE),
  })
  readonly contentType: string

  @IsNumber({}, { message: vmsg(ValidationCode.CONTENT_LENGTH_INVALID) })
  @Max(ATTACHMENT_RULES.maxBytes, {
    message: vmsg(ValidationCode.CONTENT_LENGTH_MAX),
  })
  readonly contentLength: number

  @IsNotEmpty({ message: vmsg(ValidationCode.FILE_NAME_REQUIRED) })
  @IsString({ message: vmsg(ValidationCode.FILE_NAME_INVALID) })
  readonly fileName: string
}
