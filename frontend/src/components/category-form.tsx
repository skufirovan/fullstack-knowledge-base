import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { categorySchema, type CategoryDTO } from '@/lib/schemas/category'
import { isApiError } from '@/lib/types/api-error'
import type { Category } from '@/lib/types/category'
import { Button } from './ui/button'
import { FieldGroup, Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type Props = {
  category?: Category
  onSubmit: (dto: CategoryDTO) => Promise<Category>
}

export function CategoryForm({ category, onSubmit }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<CategoryDTO>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  })

  const handleSubmit = async (dto: CategoryDTO) => {
    try {
      const data = await onSubmit(dto)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      navigate(`/${data.slug}`, { replace: true })
    } catch (error) {
      let message = 'Произошла внутренняя ошибка. Попробуйте позже'

      if (error instanceof AxiosError) {
        const response = error.response?.data

        if (isApiError(response)) message = response.message
      }

      form.setError('root', { message })
    }
  }

  return (
    <form
      id="create-category-form"
      className="mx-auto flex w-sm flex-col gap-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
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

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Описание</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="min-h-30"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldError errors={[form.formState.errors.root]} />
          <Button type="submit" form="create-category-form" size="lg">
            Создать
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
