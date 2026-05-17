import * as z from 'zod'

export const categorySchema = z.object({
  name: z
    .string('Введите название раздела')
    .min(1, 'Введите название раздела')
    .max(60, 'Название раздела не должно содержать больше 60 символов'),
  description: z
    .string()
    .max(500, 'Описание не может превышать 500 символов')
    .optional(),
})

export type CategoryDTO = z.infer<typeof categorySchema>
