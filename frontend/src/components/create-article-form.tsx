import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { articlesApi } from '@/lib/api/articles-api'
import {
  createArticleSchema,
  type CreateArticleDTO,
} from '@/lib/schemas/create-article'
import { isApiError } from '@/lib/types/api-error'
import type { ArticleStatus } from '@/lib/types/article'
import { CategoriesSelect } from './categories-select'
import { Button } from './ui/button'
import { FieldGroup, Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const contentPlaceholder = `# Заголовок статьи

**Жирный текст**, *курсив*, ~~зачеркивание~~

- Списки
- [ ] Чек-листы
- [x] Выполненные задачи

| Таблицы | Поддерживаются |
|--------|----------------|
| Ячейка | Ячейка         |

[Ссылки](https://example.com) и автоссылки https://example.com
`

export function CreateArticleForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<CreateArticleDTO>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
    },
  })

  const handleSubmit = async (dto: CreateArticleDTO, status: ArticleStatus) => {
    try {
      const data = await articlesApi.create({ ...dto, status })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      navigate(`/${data.category?.slug}/${data.slug}`, { replace: true })
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
    <form className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Создание статьи</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Статью можно сохранить как черновик и продолжить редактирование
            позже
          </p>
        </div>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-sm">
              <FieldLabel htmlFor={field.name}>Название</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <CategoriesSelect control={form.control} />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Статья</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={contentPlaceholder}
                className="min-h-30"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldError errors={[form.formState.errors.root]} />
          <div className="flex gap-3">
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() =>
                form.handleSubmit(data => handleSubmit(data, 'draft'))()
              }
            >
              В черновик
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() =>
                form.handleSubmit(data => handleSubmit(data, 'published'))()
              }
            >
              Опубликовать
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
