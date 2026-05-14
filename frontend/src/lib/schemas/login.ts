import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({
    message: 'Введите корректную почту',
  }),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
})

export type LoginDTO = z.infer<typeof loginSchema>
