import { Controller, type Control } from 'react-hook-form'
import { useCategories } from '@/hooks/use-categories'
import type { CreateArticleDTO } from '@/lib/schemas/create-article'
import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from './ui/field'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select'
import { Skeleton } from './ui/skeleton'

type Props = {
  control: Control<CreateArticleDTO>
}

export function CategoriesSelect({ control }: Props) {
  const { data, isLoading } = useCategories()

  if (isLoading)
    return (
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )

  if (!data || data.length === 0) return

  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="responsive"
          className="w-sm"
          data-invalid={fieldState.invalid}
        >
          <FieldContent>
            <FieldLabel htmlFor={field.name}>Раздел</FieldLabel>
            <FieldDescription>
              Выберите раздел базы знаний, где будет опубликована статья
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder="Выбрать" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {data.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  )
}
