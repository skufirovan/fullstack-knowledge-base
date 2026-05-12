import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

import { ValidationCode } from '@/common/constants/validation-codes.enum'
import { vmsg } from '@/common/utils/validation.utils'

export class RegisterDto {
  @IsNotEmpty({ message: vmsg(ValidationCode.EMAIL_REQUIRED) })
  @IsEmail({}, { message: vmsg(ValidationCode.EMAIL_INVALID) })
  readonly email: string

  @IsNotEmpty({ message: vmsg(ValidationCode.PASSWORD_REQUIRED) })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: vmsg(ValidationCode.PASSWORD_WEAK) }
  )
  readonly password: string
}
