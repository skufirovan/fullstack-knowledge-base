import { FolderOpen } from 'lucide-react'

export function EmptyDashboard() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-muted p-6">
        <FolderOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="font-semibold">Здесь пока пусто</h1>
        <p className="text-sm text-muted-foreground">
          Выберите статью в боковом меню
        </p>
      </div>
    </div>
  )
}
