import * as z from 'zod'

export const authCredentialsSchema = z.object({
  email: z.email({
    error: 'Введите корректную почту',
  }),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
})

export type AuthCredentialsDTO = z.infer<typeof authCredentialsSchema>
