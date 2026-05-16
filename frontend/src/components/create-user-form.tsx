import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { usersApi } from '@/lib/api/users-api'
import {
  authCredentialsSchema,
  type AuthCredentialsDTO,
} from '@/lib/schemas/auth-credentials'
import { isApiError } from '@/lib/types/api-error'
import { cn } from '@/lib/utils'
import { AuthCredentialsFields } from './auth-credentials-fields'

export function CreateUserForm({ className }: { className?: string }) {
  const form = useForm<AuthCredentialsDTO>({
    resolver: zodResolver(authCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (dto: AuthCredentialsDTO) => {
    try {
      const data = await usersApi.register(dto)
      console.log(data)
      toast.success(`Пользователь ${data.email} успешно создан`)
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
      id="create-user-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Создание пользователя</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Заполните форму ниже, чтобы создать нового пользователя
          </p>
        </div>

        <div className={cn('flex flex-col gap-5', className)}>
          <AuthCredentialsFields control={form.control} />

          <Field>
            <FieldError errors={[form.formState.errors.root]} />
            <Button type="submit" form="create-user-form">
              Создать
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  )
}
