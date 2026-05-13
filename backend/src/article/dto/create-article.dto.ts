import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

import { ValidationCode } from '@/common/constants/validation-codes.enum'
import { vmsg } from '@/common/utils/validation.utils'
import { ArticleStatus } from '@/generated/prisma/enums'

export class CreateArticleDto {
  @IsNotEmpty({ message: vmsg(ValidationCode.TITLE_REQUIRED) })
  @IsString({ message: vmsg(ValidationCode.TITLE_INVALID) })
  @MaxLength(60)
  readonly title: string

  @IsNotEmpty({ message: vmsg(ValidationCode.CONTENT_REQUIRED) })
  @IsString({ message: vmsg(ValidationCode.CONTENT_INVALID) })
  readonly content: string

  @IsNotEmpty({ message: vmsg(ValidationCode.STATUS_REQUIRED) })
  @IsEnum(ArticleStatus, { message: vmsg(ValidationCode.STATUS_INVALID) })
  readonly status: ArticleStatus

  @IsNotEmpty({ message: vmsg(ValidationCode.CATEGORY_ID_REQUIRED) })
  @IsUUID(4, { message: vmsg(ValidationCode.CATEGORY_ID_INVALID) })
  readonly categoryId: string
}
