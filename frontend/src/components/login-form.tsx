import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth-api'
import { useAuthSession } from '@/lib/auth-context'
import { loginSchema, type LoginDTO } from '@/lib/schemas/login'
import { isApiError } from '@/lib/types/api-error'

export function LoginForm() {
  const queryClient = useQueryClient()
  const { setAuthenticated } = useAuthSession()
  const navigate = useNavigate()

  const form = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (dto: LoginDTO) => {
    try {
      const data = await authApi.login(dto)
      setAuthenticated(data.accessToken)
      queryClient.setQueryData(['me'], data.user)
      navigate('/', { replace: true })
    } catch (error) {
      let message = 'Произошла внутренняя ошибка. Попробуйте позже'

      if (error instanceof AxiosError) {
        const response = error.response?.data

        if (isApiError(response)) {
          message = response.message
        }
      }

      form.setError('root', { message })
    }
  }

  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Войдите в свой аккаунт</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Введите свой адрес электронной почты ниже, чтобы войти в свой
            аккаунт.
          </p>
        </div>
        <Controller
          name="email"
          control={form.control}
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
          control={form.control}
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

        <Field>
          <FieldError errors={[form.formState.errors.root]} />
          <Button type="submit" form="login-form">
            Войти
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
