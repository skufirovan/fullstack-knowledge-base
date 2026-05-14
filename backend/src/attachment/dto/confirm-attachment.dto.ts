import { IsString, MinLength } from 'class-validator'

import { ValidationCode } from '@/common/constants/validation-codes.enum'
import { vmsg } from '@/common/utils/validation.utils'

export class ConfirmAttachmentDto {
  @IsString({ message: vmsg(ValidationCode.KEY_REQUIRED) })
  @MinLength(1, { message: vmsg(ValidationCode.KEY_REQUIRED) })
  key: string
}
