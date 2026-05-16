import { Command } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 md:justify-start">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Command className="size-4" />
      </div>
      База Знаний
    </div>
  )
}
