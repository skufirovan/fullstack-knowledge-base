import { Controller, type Control } from 'react-hook-form'
import type { AuthCredentialsDTO } from '@/lib/schemas/auth-credentials'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'

type Props = {
  control: Control<AuthCredentialsDTO>
}

export function AuthCredentialsFields({ control }: Props) {
  return (
    <>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="login-email">Почта</FieldLabel>
            <Input
              {...field}
              id="login-email"
              aria-invalid={fieldState.invalid}
              type="email"
              autoComplete="email"
              placeholder="mail@mirea.ru"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center">
              <FieldLabel htmlFor="login-password">Пароль</FieldLabel>
            </div>
            <Input
              {...field}
              id="login-password"
              aria-invalid={fieldState.invalid}
              type="password"
              autoComplete="current-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  )
}
