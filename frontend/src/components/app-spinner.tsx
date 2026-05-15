import { Spinner } from './ui/spinner'

export function AppSpinner() {
  return (
    <div className="h-full">
      <div className="flex h-full items-start justify-center gap-2 pt-[20%] text-muted-foreground">
        <Spinner className="size-5" />
        <span>Загрузка страницы...</span>
      </div>
    </div>
  )
}
