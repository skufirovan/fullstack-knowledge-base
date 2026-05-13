import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

import { ValidationCode } from '@/common/constants/validation-codes.enum'
import { vmsg } from '@/common/utils/validation.utils'

export class CreateCategoryDto {
  @IsNotEmpty({ message: vmsg(ValidationCode.NAME_REQUIRED) })
  @IsString({ message: vmsg(ValidationCode.NAME_INVALID) })
  @MaxLength(60)
  readonly name: string

  @IsOptional()
  @IsString({ message: vmsg(ValidationCode.DESCRIPTION_INVALID) })
  @MaxLength(500)
  readonly description?: string | null
}
