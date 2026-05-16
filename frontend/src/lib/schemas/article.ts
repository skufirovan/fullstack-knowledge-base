import * as z from 'zod'

export const articleSchema = z.object({
  title: z
    .string('Введите название статьи')
    .min(1, 'Введите название статьи')
    .max(60, 'Название статьи не должно содержать больше 60 символов'),
  content: z.string('Введите содержимое статьи'),
  categoryId: z.uuidv4('Выберите категорию'),
})

export type ArticleDTO = z.infer<typeof articleSchema>
